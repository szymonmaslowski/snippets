#!/usr/bin/env node

const path = require('path');
const mockery = require('mockery');

const pathToProjectRoot = path.resolve(__dirname, '..');
const pathToExample = path.resolve(__dirname, '../example.js');

require('@babel/register')({ only: [new RegExp(pathToExample)] });

mockery.registerSubstitute(
  'callback-chain',
  path.resolve(pathToProjectRoot, 'lib/callback-chain.js'),
);
mockery.enable({ warnOnUnregistered: false });
require(pathToExample);
