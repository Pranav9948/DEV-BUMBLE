const errorHandler = (err, req, res, next) => {
  console.log("🔥 ERROR HANDLER:", err);

  let message = err?.message || "Something went wrong";
  let statusCode = err?.statusCode || 500;

  // Handle Mongoose invalid ID
  if (err.name === "CastError") {
    message = `Invalid ${err.path}: ${err.value}`;
    statusCode = 400;
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((el) => el.message)
      .join(". ");
    statusCode = 400;
  }

  // Duplicate error
  if (err.code === 11000) {
    message = `Duplicate field value: ${JSON.stringify(err.keyValue)}`;
    statusCode = 400;
  }

  res.status(statusCode).json({
    status: "error",
    message,
  });
};

module.exports = errorHandler;
