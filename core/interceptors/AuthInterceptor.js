import { Forbidden, Unauthorized } from '../utils/errors';

export default function AuthInterceptor (req, res, next) {
  const [authMode, authValue] = (req.get('authorization') || '').split(' ');

  if (!authMode && !authValue) {
    throw Forbidden('access_token_mandatory');
  }

  // try {
  //   const decoded = jwt.verify(token, config.TOKEN_KEY);
  //   req.user = decoded;
  // } catch (err) {
  //   return res.status(401).send("Invalid Token");
  // }

  next();
}
