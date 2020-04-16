const schedulerQueue = [];
const scheduler = {
  add(action) {
    schedulerQueue.push(action);
  },
  async run() {
    await schedulerQueue.reduce(
      (acc, action) => acc.then(() => action()),
      Promise.resolve(),
    );
    schedulerQueue.length = 0;
  },
};

module.exports = scheduler;
