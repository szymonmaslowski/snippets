const chokidar = require('chokidar');
const fs = require('fs');
const http = require('http');
const open = require('open');
const parseUrl = require('parseurl');
const path = require('path');
const send = require('send');
const temp = require('temp');
const ws = require('ws');

temp.track();

let publicDirectories = process.argv.slice(2);
if (!publicDirectories.length) {
  publicDirectories = ['src'];
}
publicDirectories = publicDirectories.map(dirName =>
  path.resolve(process.cwd(), dirName),
);

const port = 8080;
const sockets = new Set();
const importMapSupport = true;
const indexFileName = 'index.html';
const clientSideCodePath = path.resolve(__dirname, 'client-side.js');
const indexFilePath = path.resolve(publicDirectories[0], indexFileName);

const makePrepareIndexHtmlFile = (internalPublicDir, clientSideCode) => () => {
  const importMapScriptContent =
    '<script type="importmap" src="/import-map.json"></script>';
  let indexHtmlContent;
  try {
    indexHtmlContent = fs.readFileSync(indexFilePath, 'utf-8');
  } catch (e) {
    console.error(`Could not read ${indexFileName} file from public directory`);
    throw e;
  }
  const contentEnhanceWithClientSideCode = indexHtmlContent
    .split('</body>')
    .join(`<script>${clientSideCode}</script></body>`)
    .split('<script')
    .map(
      (chunk, index) =>
        `${chunk}${
          importMapSupport && index === 0 ? importMapScriptContent : ''
        }`,
    )
    .join('<script');
  fs.writeFileSync(
    path.resolve(internalPublicDir, 'index.html'),
    contentEnhanceWithClientSideCode,
  );
};

const makeServeFile = (req, res) => ({ root, filePath, fallback404 }) => {
  const stream = send(req, filePath, { root });
  stream.on('error', error => {
    const { status, message } = error;
    if (status === 404 && fallback404) {
      fallback404(error);
      return;
    }
    res.statusCode = status || 500;
    res.end(message);
  });
  stream.pipe(res);
};

{
  const internalDirectoryPath = temp.mkdirSync('internal-directory');
  const clientSideCode = fs.readFileSync(clientSideCodePath, 'utf-8');
  const prepareIndexHtmlFile = makePrepareIndexHtmlFile(
    internalDirectoryPath,
    clientSideCode,
  );

  prepareIndexHtmlFile();

  const server = http.createServer();
  const socketServer = new ws.Server({ server });
  const fsWatcher = chokidar.watch(publicDirectories);

  server.on('request', (req, res) => {
    const serveFile = makeServeFile(req, res);
    let filePath = parseUrl(req).pathname;
    console.info(`requesting: ${filePath}`);

    const requestingRootIndexHtml = ['/', `/${indexFileName}`].includes(
      filePath,
    );

    if (filePath.endsWith('/') && !requestingRootIndexHtml) {
      filePath = path.join(filePath, 'index.js');
    }

    if (requestingRootIndexHtml) {
      serveFile({ root: internalDirectoryPath, filePath });
    } else {
      Array.from(publicDirectories)
        .reverse()
        .reduce((acc, root) => {
          const fallback404 = acc || undefined;
          return () =>
            serveFile({
              root,
              filePath,
              fallback404,
            });
        }, null)();
    }
  });

  socketServer.on('connection', function connection(socket) {
    sockets.add(socket);
  });

  server.listen(port, async () => {
    console.info(`Listening on port ${port}`);
    await open(`http://localhost:${port}`);

    fsWatcher.on('ready', () => {
      fsWatcher.on('all', (_, filePath) => {
        if (filePath === indexFilePath) {
          prepareIndexHtmlFile();
        }
        sockets.forEach(socket => {
          socket.send(JSON.stringify({ type: 'reload' }));
        });
      });
    });
  });
}
