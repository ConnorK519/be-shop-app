exports.handleCustomErrors = (err, req, res, next) => {
  console.log(err);

  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};
