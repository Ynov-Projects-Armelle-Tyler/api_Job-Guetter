import client from '@sendgrid/mail';

import { SENDGRID_API_KEY } from '../utils/env';

export default app => {
  SENDGRID_API_KEY && client.setApiKey(SENDGRID_API_KEY);

  /* istanbul ignore next: sendgrid is purposefully disabled in test mode */
  app.set('Sendgrid', {
    send: ({ to, from, subject, body }) => {
      if (!SENDGRID_API_KEY) {
        return;
      }

      try {
        client.send({ to, from, subject, html: body });
      } catch (err) {
        console.error('Sendgrid:', err);
      }
    },
  });
};
