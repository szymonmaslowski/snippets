const postponeDone = testCallback => done =>
  testCallback(() => setTimeout(() => done()));

module.exports = {
  postponeDone,
};
