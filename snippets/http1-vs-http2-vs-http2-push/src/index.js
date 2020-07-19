const modulik = require('modulik');
const utils = require('./common');

const determineServerFile = kind => {
  switch (kind) {
    case 'h1':
      return './h1';
    case 'h2':
      return './h2';
    case 'h2-push':
    default:
      return './h2-push';
  }
};

(async () => {
  const serverKind = process.argv[2];
  const serversToRun =
    serverKind === 'all' ? ['h1', 'h2', 'h2-push'] : [serverKind];
  const { port, ...restOfConfig } = await utils.prepareConfig();

  serversToRun.forEach((kind, index) => {
    const serverFile = determineServerFile(kind);
    const serverModulik = modulik(serverFile, {
      watch: ['./common'],
      quiet: process.env.NODE_ENV !== 'development',
      disable: process.env.NODE_ENV !== 'development',
    });

    serverModulik.module.then(runServer => {
      const run = () => {
        runServer({ port: port + index, ...restOfConfig });
      };
      serverModulik.on('ready', run);
      run();
    });
  });
})();
