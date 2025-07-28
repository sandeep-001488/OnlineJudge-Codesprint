const { SUPPORTED_LANGUAGES } = require("../config/constants");

const validateCodeExecution = (req, res, next) => {
  const { language = "cpp", code, input = "" } = req.body;

  // Validate required fields
  if (!code || code.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "Code cannot be empty",
    });
  }

  // Validate language
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    return res.status(400).json({
      success: false,
      error: `Unsupported language. Supported languages: ${SUPPORTED_LANGUAGES.join(
        ", "
      )}`,
    });
  }

//   // Validate code length (prevent abuse)
//   if (code.length > 100000) {
//     // 100KB limit
//     return res.status(400).json({
//       success: false,
//       error: "Code is too long (max 100KB)",
//     });
//   }

  req.body = { language, code, input };
  next();
};

module.exports = {
  validateCodeExecution,
};
