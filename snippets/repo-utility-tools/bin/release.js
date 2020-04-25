#!/usr/bin/env node

const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const semver = require('semver');

const [targetPackagePath, targetVersion] = process.argv.slice(2);

const panic = msg => {
  console.error(msg);
  process.exit(1);
};

if (!targetPackagePath) {
  panic(`Invalid required "path" argument`);
}
if (!targetPackagePath) {
  panic(`Invalid required "version" argument`);
}

const targetPackageJsonPath = path.resolve(
  process.cwd(),
  targetPackagePath,
  'package.json',
);
if (!fs.existsSync(targetPackageJsonPath)) {
  panic(`Invalid package at path ${targetPackagePath}`);
}

const automaticVersionBump = ['patch', 'minor', 'major'].includes(
  targetVersion,
);

if (!automaticVersionBump && !semver.valid(targetVersion)) {
  panic(`Invalid version "${targetPackagePath}"`);
}

let currentBranchName;
try {
  currentBranchName = cp
    .execSync('git rev-parse --abbrev-ref HEAD')
    .toString()
    .trim();
} catch (e) {
  panic(`Failed to read current branch name`);
}

if (currentBranchName !== 'master') {
  panic(`Releasing allowed only from master`);
}

const packagesPath = path.resolve(process.cwd(), 'snippets');
const packageJsons = fs
  .readdirSync(packagesPath)
  .map(dir => ({
    dir,
    packageJsonPath: path.resolve(packagesPath, dir, 'package.json'),
  }))
  .filter(({ packageJsonPath }) => fs.existsSync(packageJsonPath))
  .reduce(
    (map, item) =>
      map.set(item.packageJsonPath, {
        modified: false,
        content: JSON.parse(fs.readFileSync(item.packageJsonPath, 'utf-8')),
      }),
    new Map(),
  );

const {
  version: targetPackageCurrentVersion,
  name: targetPackageName,
} = packageJsons.get(targetPackageJsonPath).content;

let nextVersion = targetVersion;
if (!nextVersion) {
  console.error(
    `Failed to bump package ${targetPackagePath}. Invalid current version ${targetPackageCurrentVersion}`,
  );
  process.exit(1);
}
if (automaticVersionBump) {
  nextVersion = semver.inc(targetPackageCurrentVersion, targetVersion);
}

packageJsons.set(targetPackageJsonPath, {
  modified: true,
  content: {
    ...packageJsons.get(targetPackageJsonPath).content,
    version: nextVersion,
  },
});

const bumpDependency = (content, dependenciesType) => {
  if (!content[dependenciesType]) return content;

  const containsTargetPackage = Object.keys(content[dependenciesType]).includes(
    targetPackageName,
  );
  if (!containsTargetPackage) return content;

  const versionSpecifier = content[dependenciesType][targetPackageName];
  const installedVersion = semver.clean(versionSpecifier);
  if (targetPackageCurrentVersion !== installedVersion) return content;

  const targetVersionSpecifier = versionSpecifier.replace(
    installedVersion,
    nextVersion,
  );
  return {
    ...content,
    [dependenciesType]: {
      ...content[dependenciesType],
      [targetPackageName]: targetVersionSpecifier,
    },
  };
};

packageJsons.forEach(({ content }, filePath) => {
  if (filePath === targetPackageJsonPath) return;
  const newContent = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies',
  ].reduce(bumpDependency, content);
  packageJsons.set(filePath, {
    modified: newContent !== content,
    content: newContent,
  });
});

packageJsons.forEach(({ modified, content }, filePath) => {
  if (!modified) return;
  fs.writeFileSync(filePath, `${JSON.stringify(content, null, 2)}\n`, 'utf-8');
});

const modifiedFiles = Array.from(packageJsons.entries())
  .filter(item => item[1].modified)
  .map(([fileName]) => fileName);
[
  { command: `git add ${modifiedFiles.join(' ')}`, description: 'stage files' },
  {
    command: `git commit -m "${targetPackageName} v${nextVersion}"`,
    description: 'commit changes',
  },
  {
    command: `git tag ${targetPackageName}@${nextVersion}`,
    description: 'create a tag',
  },
].forEach(({ command, description }) => {
  try {
    cp.execSync(command);
  } catch (e) {
    panic(`Failed to ${description}`);
  }
});

console.info(`\
Successfully bumped package ${targetPackageName} to version ${nextVersion}
In order to finalize the process run
git push --follow-tags
`);
