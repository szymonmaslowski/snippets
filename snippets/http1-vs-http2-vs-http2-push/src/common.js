const fs = require('fs');
const p = require('path');
const pem = require('pem');
const qs = require('querystring');

const port = 3000;
const defaultLatency = 300;
const defaultAssetsCount = 1000;
const publicPath = p.resolve(__dirname, '../public');

const prepareConfig = () =>
  new Promise((resolve, reject) => {
    pem.createCertificate({ days: 1, selfSigned: true }, (err, keys) => {
      if (err) {
        reject(err);
        return;
      }

      resolve({
        key: keys.serviceKey,
        cert: keys.certificate,
        port,
      });
    });
  });

const parseUrl = url => {
  const [path, rawQuery] = url.split('?');
  const query = qs.decode(rawQuery);
  return { path, query };
};

const getLatencyFromQuery = query => Number(query.l) || defaultLatency;

const getAssetsCountFromQuery = query => Number(query.c) || defaultAssetsCount;

const delay = time => new Promise(r => setTimeout(r, time));

const makeMeasurementName = url => `Serving ${url} with latency`;

const makeAssetUrl = (latency, timestamp) => index =>
  `/asset.png?l=${latency}&${index}-${timestamp}`;

const makeAsset = url => `<img src="${url}" alt="an asset" width="80" />`;

const times = count => callback =>
  new Array(count).fill(null).map((_, index) => callback(index));

const generateAssetsUrls = (
  timestamp,
  latency,
  assetsCount = defaultAssetsCount,
) => times(assetsCount)(makeAssetUrl(latency, timestamp));

const generateIndexFile = assetsUrls => `\
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Served from node server</title>
</head>
<body>
  ${assetsUrls.map(makeAsset).join('')}
</body>
</html>
`;

const determineAssetPath = path => p.resolve(publicPath, path.slice(1));

const serveFile = (path, stream) => {
  fs.createReadStream(path).pipe(stream);
};

module.exports = {
  prepareConfig,
  parseUrl,
  getLatencyFromQuery,
  getAssetsCountFromQuery,
  delay,
  makeMeasurementName,
  generateAssetsUrls,
  generateIndexFile,
  determineAssetPath,
  serveFile,
};
