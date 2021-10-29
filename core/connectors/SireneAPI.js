import fetch from 'node-fetch';

import { SIRENE_URI } from '../utils/env';

export default app => {
  app.set('Sirene_API', {
    get: async path => {
      const response = await fetch(SIRENE_URI.concat(path), {
        method: 'get',
      });

      return response.json();
    },
  });
};