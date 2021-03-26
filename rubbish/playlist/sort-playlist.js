const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const makeAuthenticator = require('./authenticator');
const readSongs = require('./read-songs');

(async () => {
  await makeAuthenticator({ google }).authenticate({
    scopes: ['https://www.googleapis.com/auth/youtube'],
    serverPort: 3001,
  });
  const songs = readSongs();

  const list = await (async function query(pageToken) {
    console.log('page');
    const response = await google.youtube('v3').playlistItems.list({
      part: 'snippet',
      playlistId: 'PLo-3KpRGCBqZmCgkCvkp5qoymQJ_znpE1',
      pageToken,
    });

    if (!response.data) {
      throw new Error('No data');
    }

    if (!response.data.nextPageToken || response.data.items.length === 0) {
      console.log('no next page');
      console.log(JSON.stringify(response, null, 2));
      return response.data.items;
    }

    return response.data.items.concat(await query(response.data.nextPageToken));
  })();

  fs.writeFileSync(
    path.resolve(__dirname, 'playlist.json'),
    JSON.stringify(list, null, 2),
    'utf-8',
  );

  console.log('response', list.length);

  // songs
  //   .reverse()
  //   .filter((_, index) => index >= startFrom)
  //   .reduce(
  //     (acc, { phrase, videoId }, index) =>
  //       acc.then(
  //         () =>
  //           console.log(startFrom + index, phrase) ||
  //           insertVideo(videoId).then(({ statusText }) =>
  //             console.log(statusText),
  //           ),
  //         res => {
  //           console.error(res.response.data.error);
  //           throw new Error('FAILED');
  //         },
  //       ),
  //     Promise.resolve(),
  //   );
})();
