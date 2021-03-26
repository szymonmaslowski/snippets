const http = require('http');
const open = require('open');
const destroyer = require('server-destroy');
const url = require('url');
const { web } = require('./oauth2.keys.json');

const makeAuthenticator = ({ google }) => ({
  authenticate: ({ scopes, serverPort }) =>
    new Promise((resolve, reject) => {
      // eslint-disable-next-line camelcase
      const { client_id, client_secret, redirect_uris } = web;
      const oauth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0],
      );

      google.options({ auth: oauth2Client });

      const authorizeUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes.join(' '),
      });

      const server = http
        .createServer(async (req, res) => {
          try {
            if (req.url.indexOf('/cb') > -1) {
              const qs = new url.URL(req.url, 'http://localhost:3000')
                .searchParams;
              res.end(
                'Authentication successful! Please return to the console.',
              );
              server.destroy();
              const { tokens } = await oauth2Client.getToken(qs.get('code'));
              oauth2Client.credentials = tokens;
              resolve();
            }
          } catch (e) {
            reject(e);
          }
        })
        .listen(serverPort, () => {
          // open the browser to the authorize url to start the workflow
          open(authorizeUrl, { wait: false }).then(cp => cp.unref());
        });
      destroyer(server);
    }),
});

module.exports = makeAuthenticator;
