#!/usr/bin/env node

const cp = require('child_process');
const path = require('path');

const configPath = path.resolve(__dirname, '../config/webpack.config.js');
cp.spawn('webpack-dev-server', ['--config', configPath], {
  stdio: 'inherit',
});
