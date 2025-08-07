const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  const errorResponse = {
    success: false,
    error: "Internal server error",
    timestamp: new Date().toISOString(),
  };

  if (err.type) {
    errorResponse.type = err.type;
    errorResponse.error = err.message;
    errorResponse.line = err.line;
    return res.status(400).json(errorResponse);
  }

  if (err.name === "ValidationError") {
    errorResponse.error = "Validation failed";
    errorResponse.details = err.message;
    return res.status(400).json(errorResponse);
  }

  res.status(500).json(errorResponse);
};

module.exports = {
  errorHandler,
};
