const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Default error response
  const errorResponse = {
    success: false,
    error: "Internal server error",
    timestamp: new Date().toISOString(),
  };

  // Handle specific error types
  if (err.type) {
    errorResponse.type = err.type;
    errorResponse.error = err.message;
    errorResponse.line = err.line;
    return res.status(400).json(errorResponse);
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    errorResponse.error = "Validation failed";
    errorResponse.details = err.message;
    return res.status(400).json(errorResponse);
  }

  // Generic server error
  res.status(500).json(errorResponse);
};

module.exports = {
  errorHandler,
};
