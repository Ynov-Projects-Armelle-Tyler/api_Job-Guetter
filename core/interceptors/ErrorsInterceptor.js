import colors from 'colors/safe';

import { DEBUG } from '../utils/env';

export default function ErrorsInterceptor (err, req, res, _next) {
  const isDebug = !req || !req.app || DEBUG === true;

  if (req && res) {
    if (typeof err.send !== 'undefined') {
      return err.send(res);
    } else {
      return isDebug
        ? res.status(500).send(`<pre>${err.stack}</pre>`)
        /* istanbul ignore next: cannot cover this in dev/test mode */
        : res.status(500).json({ error: 'Server error' });
    }
  } else {
    /* istanbul ignore else: cannot cover this in dev/test mode */
    if (isDebug) {
      // eslint-disable-next-line
      console.error(colors.red(err));
    }
  }
}
