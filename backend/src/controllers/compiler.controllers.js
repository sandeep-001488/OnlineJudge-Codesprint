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
    if (err.response) {
      console.error("Compiler response error:", err.response.data);
    }
    res.status(500).json({ error: err.message });
  }
}
