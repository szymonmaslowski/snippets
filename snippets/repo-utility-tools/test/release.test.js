const scheduler = require('@snippets/scheduler');
const assert = require('assert');
const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const resourcesPath = path.resolve(__dirname, 'resources');
const fakeRepoPath = path.resolve(__dirname, 'repo');
const packagesPath = path.resolve(fakeRepoPath, 'snippets');

const makePackageJsonPath = dirName =>
  path.resolve(packagesPath, dirName, 'package.json');

const execute = (command, { operationName, options }) => {
  const finalOperationName = operationName || `"${command}"`;
  try {
    cp.execSync(command, options);
  } catch (e) {
    console.error(e);
    throw new Error(`Could not execute ${finalOperationName}`);
  }
};

const run = (packagePath, desiredVersion) => {
  const scriptPath = path.resolve(__dirname, '../bin/release.js');
  execute(`node ${scriptPath} ${packagePath} ${desiredVersion}`, {
    operationName: 'release script',
    options: {
      env: {
        ...process.env,
        // mocking git
        PATH: `${resourcesPath}:${process.env.PATH}`,
      },
      stdio: 'inherit',
      cwd: fakeRepoPath,
    },
  });
};

const readPackagesContents = () => {
  return fs.readdirSync(packagesPath).map(dir => ({
    dir,
    content: JSON.parse(fs.readFileSync(makePackageJsonPath(dir), 'utf-8')),
  }));
};

const writePackagesContents = packagesContents => {
  packagesContents.forEach(({ dir, content }) => {
    const dirPath = path.resolve(packagesPath, dir);
    if (!fs.existsSync(dirPath)) {
      execute(`mkdir -p ${dirPath}`, {
        operationName: `creation of directory ${dirPath}`,
      });
    }
    fs.writeFileSync(
      makePackageJsonPath(dir),
      JSON.stringify(content, null, 2),
      'utf-8',
    );
  });
};

const name = '@s/c';
const version = '1.2.3';

describe('Release script', () => {
  afterEach(() => {
    scheduler.run();
  });

  [
    { param: 'patch', expectedVersion: '1.2.4' },
    { param: 'minor', expectedVersion: '1.3.0' },
    { param: 'major', expectedVersion: '2.0.0' },
    { param: '3.0.0-beta.0', expectedVersion: '3.0.0-beta.0' },
  ].forEach(({ param, expectedVersion }) => {
    it(`bumps ${name} package version to ${expectedVersion} when "${param}" param has been specified`, () => {
      scheduler.add(() => {
        execute(`rm -rf ${fakeRepoPath}`, {
          operationName: `resources cleanup`,
        });
      });

      writePackagesContents([
        {
          dir: 'a',
          content: {
            name: '@s/a',
            dependencies: { [name]: '0.0.0' },
            devDependencies: {},
          },
        },
        {
          dir: 'b',
          content: {
            name: '@s/b',
            dependencies: { [name]: version },
            devDependencies: { [name]: version },
            peerDependencies: { [name]: version },
            optionalDependencies: { [name]: version },
          },
        },
        { dir: 'c', content: { name, version } },
      ]);
      run('./snippets/c', param);

      const packagesContents = readPackagesContents();
      assert.deepStrictEqual(packagesContents, [
        {
          dir: 'a',
          content: {
            name: '@s/a',
            dependencies: { [name]: '0.0.0' },
            devDependencies: {},
          },
        },
        {
          dir: 'b',
          content: {
            name: '@s/b',
            dependencies: { [name]: expectedVersion },
            devDependencies: { [name]: expectedVersion },
            peerDependencies: { [name]: expectedVersion },
            optionalDependencies: { [name]: expectedVersion },
          },
        },
        { dir: 'c', content: { name, version: expectedVersion } },
      ]);
    });
  });
});
