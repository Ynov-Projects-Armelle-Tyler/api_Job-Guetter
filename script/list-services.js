const fs = require('fs');
const path = require('path');

const argv = require('yargs').argv;

const listServices = () => fs
  .readdirSync(path.resolve('./services'), { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

if (require.main === module) {
  const services = listServices();
  console.log(argv.json ? JSON.stringify(services) : services.join(' '));
}

module.exports = listServices;
