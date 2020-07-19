const fs = require('fs');
const mimeTypes = require('mime-types');
const http2 = require('http2');
const utils = require('./common');

const serveStaticFile = (stream, filePath, mimeType) => {
  const staticFilePath = utils.determineAssetPath(filePath);
  if (fs.existsSync(staticFilePath)) {
    stream.respondWithFile(
      staticFilePath,
      {
        'Content-Type': mimeType,
      },
      {
        onError() {
          stream.respond({ ':status': 500 });
          stream.end();
        },
      },
    );
    return;
  }

  stream.respond({ ':status': 404 });
  stream.end();
};

const server = ({ key, cert, port }) =>
  http2
    .createSecureServer({ key, cert })
    .on('stream', async (stream, headers) => {
      const url = headers[':path'];
      const { path, query } = utils.parseUrl(url);

      console.time(utils.makeMeasurementName(url));
      await utils.delay(utils.getLatencyFromQuery(query));
      console.timeEnd(utils.makeMeasurementName(url));

      const mimeType = mimeTypes.lookup(path);

      if (['/', '/index.html'].includes(path)) {
        const assetsUrls = utils.generateAssetsUrls(
          new Date().getTime(),
          utils.getLatencyFromQuery(query),
          utils.getAssetsCountFromQuery(query),
        );

        assetsUrls.forEach(assetUrl => {
          stream.pushStream(
            { ':path': assetUrl },
            { parent: stream.id },
            (error, pushStream) => {
              if (error) {
                throw error;
              }
              const { path: assetPath } = utils.parseUrl(assetUrl);
              serveStaticFile(pushStream, assetPath, mimeType);
            },
          );
        });

        stream.respond({
          ':status': 200,
          'Content-Type': mimeType,
        });
        stream.end(utils.generateIndexFile(assetsUrls));
        return;
      }

      serveStaticFile(stream, path, mimeType);
    })
    .listen(port, () =>
      console.info(`HTTP/2 push server is listening on port ${port}`),
    );

module.exports = server;
