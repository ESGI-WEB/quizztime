const ApplicationError = require("../errors/ApplicationError");

module.exports = function (err, req, res, next) {
  if (err instanceof ApplicationError) {
    res.status(err.status).json({
        name: err.name,
        message: err.message,
        status: err.status
    });
  } else {
    console.error(err)
    res.sendStatus(500);
  }
};
