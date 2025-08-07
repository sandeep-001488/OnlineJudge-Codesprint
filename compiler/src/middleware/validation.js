const { SUPPORTED_LANGUAGES } = require("../config/constants");

const validateCodeExecution = (req, res, next) => {
  const { language = "cpp", code, input = "" } = req.body;

  if (!code || code.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "Code cannot be empty",
    });
  }

  if (!SUPPORTED_LANGUAGES.includes(language)) {
    return res.status(400).json({
      success: false,
      error: `Unsupported language. Supported languages: ${SUPPORTED_LANGUAGES.join(
        ", "
      )}`,
    });
  }


  req.body = { language, code, input };
  next();
};

module.exports = {
  validateCodeExecution,
};
