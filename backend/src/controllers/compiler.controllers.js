import axios from "axios";

export default async function runCodeController(req, res) {
  const { language, code, input } = req.body;

  try {
    const compilerURL = "http://localhost:8000/api/run";

    const response = await axios.post(compilerURL, {
      language,
      code,
      input,
    });

    res.status(200).json(response.data);
  } catch (err) {
    console.error("Compiler error:", err.message);
    res.status(500).json({ error: "Error communicating with compiler" });
  }
}
