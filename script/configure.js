const { promises: fsPromise, ...fs } = require('fs');
const path = require('path');

const prompts = require('prompts');
const ora = require('ora');
const colors = require('colors/safe');
const argv = require('yargs').argv;

const {
  spawnPromise,
} = require('./utils');

const createLocalDb = async () => {
  const { localDb = true } = !argv.disablePrompts && await prompts({
    type: 'confirm',
    name: 'localDb',
    message: 'Do you want to create a local mongo database ?',
  }, { onCancel });

  if (!localDb) {
    return;
  }

  const dbChecker = ora(
    'Looking for db backup files on .docs/database_schema/...'
  ).start();

  let names = [];

  try {
    names = fs
      .readdirSync(path.resolve('./.docs/database_schema'),
        { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    dbChecker.succeed();
  } catch (e) {
    dbChecker.fail();

    return onError(e);
  }

  const { fileIndex = 0 } = !argv.disablePrompts && await prompts({
    type: 'select',
    name: 'fileIndex',
    message: 'Which db backup do you want to install?',
    choices: names,
  }, { onCancel });

  const dbBackupLoader = ora('Copy backup into tmp...').start();

  const dir = names[fileIndex];
  const dbPath = path.join(
    path.resolve('./.docs/database_schema'), dir, 'db.tmp.tar.gz'
  );

  if (!fs.existsSync(dbPath)) {
    dbBackupLoader.fail();
    console.error(colors.red('Failed: open ' + colors.underline(`${dbPath}`) +
      ': no such file or directory'));

    onCancel();
  }

  try {
    !fs.existsSync('./tmp') && await fsPromise.mkdir('./tmp');
    const dbPathDest = path.join(path.resolve('./tmp'), 'db.tmp.tar.gz');

    await fsPromise.copyFile(dbPath, dbPathDest);

    dbBackupLoader.succeed();
  } catch (e) {
    dbBackupLoader.fail();

    return onError(e);
  }

  const dbImportLoader = ora('Restoring backup...').start();

  try {
    await spawnPromise('mongorestore', [
      '--gzip',
      '--archive=./tmp/db.tmp.tar.gz',
      '--noIndexRestore',
    ]);
    await fsPromise.unlink('./tmp/db.tmp.tar.gz');
    dbImportLoader.succeed();
  } catch (e) {
    dbImportLoader.fail();

    return onError(e);
  }
};

const onCancel = () =>
  process.exit();

const onError = async e => {
  try {
    await fsPromise.unlink('./tmp/db.tmp.tar.gz');
  } catch (e) {}

  console.error(colors.red(e));
  process.exit(1);
};

(async () => {
  !argv.skipMongo && await createLocalDb();
})();
