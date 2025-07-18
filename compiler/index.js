const express = require("express");
const { generateFile } = require("./generateFile");
const { executeCpp } = require("./executeCpp");
const cors = require("cors");
const PORT = 8000;
const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.post("/run", async (req, res) => {
  const { language = "cpp", code } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, error: "Empty code" });
  }

  try {
    const filePath = generateFile(language, code);
    const output = await executeCpp(filePath);
    return res.json({ success: true, output });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
});

app.listen(PORT, (error) => {
  if (error) {
    console.log("error while starting the server", error);
  } else {
    console.log(`server running at port ${PORT}`);
  }
});
