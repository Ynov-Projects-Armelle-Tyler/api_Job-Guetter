export default function DefaultsInterceptor (req, res, next) {
  req.jobGuetter = {};

  next();
}
