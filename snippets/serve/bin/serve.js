#!/usr/bin/env node

const cp = require('child_process');
const path = require('path');

const sourceDir = process.argv[2] || 'src';

const configPath = path.resolve(__dirname, '../config/webpack.config.js');
cp.spawn('webpack-dev-server', ['--entry', sourceDir, '--config', configPath], {
  stdio: 'inherit',
});
