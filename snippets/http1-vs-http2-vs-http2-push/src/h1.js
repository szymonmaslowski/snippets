const fs = require('fs');
const mimeTypes = require('mime-types');
const https = require('https');
const utils = require('./common');

const server = ({ key, cert, port }) =>
  https
    .createServer({ key, cert }, async (req, res) => {
      const { path, query } = utils.parseUrl(req.url);

      console.time(utils.makeMeasurementName(req.url));
      await utils.delay(utils.getLatencyFromQuery(query));
      console.timeEnd(utils.makeMeasurementName(req.url));

      const mimeType = mimeTypes.lookup(path);

      if (['/', '/index.html'].includes(path)) {
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(
          utils.generateIndexFile(
            utils.generateAssetsUrls(
              new Date().getTime(),
              utils.getLatencyFromQuery(query),
              utils.getAssetsCountFromQuery(query),
            ),
          ),
        );
        return;
      }

      const staticFilePath = utils.determineAssetPath(path);
      if (fs.existsSync(staticFilePath)) {
        res.writeHead(200, { 'Content-Type': mimeType });
        fs.createReadStream(staticFilePath).pipe(res);
        return;
      }

      res.writeHead(404);
      res.end();
    })
    .listen(port, () =>
      console.info(`HTTP/1 server is listening on port ${port}`),
    );

module.exports = server;
