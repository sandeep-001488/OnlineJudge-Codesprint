import { generateContent } from "../services/ai.service.js";

export const explainCompilationError = async (req, res) => {
  const { code, errorMessage, language } = req.body;

  if (!code || !errorMessage || !language) {
    return res
      .status(400)
      .json({ error: "Code, error message, and language are required." });
  }
  const prompt = `
You are an AI assistant for a coding platform.
A user submitted the following code in ${language} and received a compile/runtime error.

Code:
\`\`\`${language}
${code}
\`\`\`

Error:
${errorMessage}

Please explain the cause of the error in simple terms, and suggest a possible fix (no actual full code).
`;

  try {
    const response = await generateContent(prompt);
    res.status(200).json({ response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const generateHintForProblem = async (req, res) => {
  const { problemTitle, problemDescription, language, tags } = req.body;

  if (!problemTitle || !problemDescription) {
    return res
      .status(400)
      .json({ error: "Problem title and description are required." });
  }

  const prompt = `
You are a helpful AI coding assistant.
A user is working on a problem titled: "${problemTitle}".

Problem Description:
${problemDescription}

Tags: ${tags?.join(", ") || "Not provided"}
Preferred Language: ${language || "Not specified"}

Please give a helpful HINT only — do NOT reveal the solution or exact algorithm.
Do not provide full code. Tailor your hint to the chosen language.
`;

  try {
    const response = await generateContent(prompt);
    res.status(200).json({ response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const explainHiddenTestCaseFailure = async (req, res) => {
  const { code, language, problemTitle, problemDescription } = req.body;

  if (!code || !language || !problemTitle || !problemDescription) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const prompt = `
You are helping a user debug a coding problem titled "${problemTitle}".

Problem Description:
${problemDescription}

User's Code in ${language}:
\`\`\`${language}
${code}
\`\`\`

The code passed sample test cases but failed on a hidden test case.
You are NOT allowed to see the hidden test case.

Based on the code and problem, suggest which parts of the code may be fragile or cause issues in edge cases.
Do NOT rewrite the full solution — just suggest areas to inspect.
`;

  try {
    const response = await generateContent(prompt);
    res.status(200).json({ response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const explainVisibleTestCase = async (req, res) => {
  const { code, input, expectedOutput, actualOutput, language } = req.body;

  if (!code || !input || !expectedOutput || !actualOutput || !language) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const prompt = `
A user is debugging code written in ${language}.

Code:
\`\`\`${language}
${code}
\`\`\`

Test Input:
${input}

Expected Output:
${expectedOutput}

User's Output:
${actualOutput}

Please analyze the mismatch and suggest why the code might be producing incorrect output for this test case.
Mention the likely logic bug or missing check.
Do not show full corrected code.
`;

  try {
    const response = await generateContent(prompt);
    res.status(200).json({ response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const suggestOptimizations = async (req, res) => {
  const { code, language, problemDescription, problemTitle } = req.body;

  if (!code || !language || !problemDescription || !problemTitle) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const prompt = `
A user wrote the following code in ${language} for a problem titled "${problemTitle}".

Problem Description:
${problemDescription}

Code:
\`\`\`${language}
${code}
\`\`\`

The code is correct and passes all test cases, but the user wants to improve time or space efficiency.

Suggest how this code might be optimized.
Give ideas only (e.g., "use a hash map", "binary search", "avoid nested loops").
Do not rewrite the full code.
`;

  try {
    const response = await generateContent(prompt);
    res.status(200).json({ response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
