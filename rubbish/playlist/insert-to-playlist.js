const { google } = require('googleapis');
const makeAuthenticator = require('./authenticator');

const chunkNum = 0;
const songs = require(`./song-ids-${chunkNum}.json`);
const startFrom = 21;

const insertVideo = videoId =>
  google.youtube('v3').playlistItems.insert({
    part: 'snippet',
    requestBody: {
      snippet: {
        playlistId: 'PLo-3KpRGCBqZmCgkCvkp5qoymQJ_znpE1',
        position: 0,
        resourceId: {
          kind: 'youtube#video',
          videoId,
        },
      },
    },
  });

(async () => {
  await makeAuthenticator({ google }).authenticate({
    scopes: ['https://www.googleapis.com/auth/youtube'],
    serverPort: 3000,
  });
  songs
    .reverse()
    .filter((_, index) => index >= startFrom)
    .reduce(
      (acc, { phrase, videoId }, index) =>
        acc.then(
          () =>
            console.log(startFrom + index, phrase) ||
            insertVideo(videoId).then(({ statusText }) =>
              console.log(statusText),
            ),
          res => {
            console.error(res.response.data.error);
            throw new Error('FAILED');
          },
        ),
      Promise.resolve(),
    );
})();

// saveToPlaylist(
//   require(`./song-ids-${chunkNum}.json`).reverse()[1].videoId,
// ).then(console.log);
