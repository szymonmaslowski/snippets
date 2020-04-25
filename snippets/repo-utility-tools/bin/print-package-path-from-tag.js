#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const packagesPath = path.resolve(process.cwd(), 'snippets');
const tagName = process.argv[2];

if (!tagName) {
  console.error(`Missing tag argument`);
  process.exit(1);
}

const packagePath = fs
  .readdirSync(packagesPath)
  .map(dir => ({
    dir,
    packageJsonPath: path.resolve(packagesPath, dir, 'package.json'),
  }))
  .filter(({ packageJsonPath }) => fs.existsSync(packageJsonPath))
  .map(item => ({
    ...item,
    // eslint-disable-next-line global-require, import/no-dynamic-require
    name: require(item.packageJsonPath).name,
  }))
  .filter(({ name }) => tagName.includes(`${name}@`))
  .map(({ dir }) => dir)
  .find(() => true);

if (!packagePath) {
  console.error(`Unable to locate package path from tag "${tagName}"`);
  process.exit(1);
}

process.stdout.write(path.resolve(packagesPath, packagePath));
