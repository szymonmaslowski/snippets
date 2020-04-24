const defaultOptions = {
  targets: {},
};

module.exports = (_, { targets } = defaultOptions) => ({
  presets: [['@babel/preset-env', { targets }]],
});
