const { spawn } = require('child_process');

const spawnPromise = (...args) =>
  new Promise((resolve, reject) => {
    let result = '';
    let error = '';
    const req = spawn(...args);
    req.stdout && req.stdout.on('data', data => { result += data; });
    req.stderr && req.stderr.on('data', data => { error += data; });
    req.on('close', code => code !== 0 ? reject(error, code) : resolve(result));
    req.on('error', err => reject(err));
  });

module.exports = {
  spawnPromise,
};
