import axios from "axios";

export default async function runCodeController(req, res) {
  const { language, code, input } = req.body;

  try {
    const response = await axios.post(`${process.env.compilerURL}`, {
      language,
      code,
      input,
    });

    res.status(200).json(response.data);
  } catch (err) {
    console.error("Compiler error:", err.message);
    if (err.response && err.response.data) {
      console.error("Compiler response error:", err.response.data);
      res.status(400).json(err.response.data);
    } else {
      res.status(500).json({
        success: false,
        type: "network",
        error: err.message,
        line: null,
      });
    }
  }
}
