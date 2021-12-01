import fetch from 'request-promise-native';

export const request = (server, opts) => fetch({
  ...opts,
  json: typeof opts.json !== 'undefined' ? opts.json : true,
  uri: getServerRoot(server) + opts.url,
  headers: {
    'Content-Type': 'application/json',
    ...opts.headers,
  },
});

export const get = (server, opts) => request(server, {
  ...opts,
  method: 'GET',
});

export const post = (server, opts) => request(server, {
  ...opts,
  method: 'POST',
});

export const put = (server, opts) => request(server, {
  ...opts,
  method: 'PUT',
});

export const patch = (server, opts) => request(server, {
  ...opts,
  method: 'PATCH',
});

export const remove = (server, opts) => request(server, {
  ...opts,
  method: 'DELETE',
});

export const getServerRoot = server =>
  `http://localhost:${server.address().port}`;

export const getAuthorizationHeaders = token => ({
  authorization: `Bearer ${token}`,
});
