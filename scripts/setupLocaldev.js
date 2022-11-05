// import shell from 'shelljs';
var shell = require('shelljs');

if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git');
  shell.exit(1);
}

// clone zkopru repo for `@zkopru/client` package
shell.echo(`Clone and build zkopru`)
shell.exec(`git submodule update --init`);
shell.cd(`zkopru`);
shell.exec(`yarn && yarn build:ts:serial`);
shell.cd(`..`);

// copy package file which is replaced local path
shell.echo(`Override package.json for using client package in local`);
shell.cp(`-f`, `package-dev.json`, `package.json`);
