export const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

export const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  response.status(500);
  response.json({
    message: error.message,
  });
};

export const requestLogger = (req, res, next) => {
  console.log("Method:", req.method);
  console.log("Path:  ", req.path);
  console.log("Body:  ", req.body);
  console.log("---");
  next();
};
