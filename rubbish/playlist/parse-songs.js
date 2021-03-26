const fs = require('fs');
const http = require('https');
const path = require('path');

const chunkNum = 3;
const apiKey = 'AIzaSyAoBpLhPAeY2VrynB7bViImmpPdx3fRRD4';

const songs = fs
  .readFileSync(path.resolve(__dirname, 'parse-songs.txt'), 'utf-8')
  .split('--')
  .map(page =>
    page.split('**').map(column =>
      column
        .split('\n')
        .filter(Boolean)
        .map(i => i.trim()),
    ),
  )
  .flatMap(([titles, artists]) =>
    artists.map((artist, index) => `${artist} - ${titles[index]}`),
  );

const getVideoId = phrase =>
  new Promise(resolve => {
    const chunks = [];
    http
      .request(
        {
          method: 'GET',
          path: `/youtube/v3/search?part=snippet&key=${apiKey}&maxResults=1&q=${encodeURI(
            phrase,
          )}`,
          host: 'www.googleapis.com',
          protocol: 'https:',
        },
        res =>
          res
            .on('data', chunk => {
              chunks.push(chunk);
            })
            .on('end', () => {
              const json = chunks.map(b => b.toString()).join('');
              const data = JSON.parse(json);
              resolve({
                phrase,
                ...(() => {
                  try {
                    if (data.error) {
                      throw new Error(data.error.message);
                    }
                    return {
                      videoId: data.items[0].id.videoId,
                    };
                  } catch (e) {
                    return {
                      error: e.message,
                    };
                  }
                })(),
              });
            }),
      )
      .end();
  });

const startFrom = 0;

songs
  .filter((_, index) => index >= chunkNum * 100 && index < (chunkNum + 1) * 100)
  .filter((_, index) => index >= startFrom)
  // .map(console.log);
  .reduce(
    (acc, songName, index) =>
      acc.then(
        list =>
          console.log(index + startFrom) ||
          getVideoId(songName).then(videoId => list.concat(videoId)),
      ),
    Promise.resolve([]),
  )
  .then(list => {
    console.log(JSON.stringify(list, null, 2));
    fs.writeFileSync(
      `song-ids-${chunkNum}.json`,
      JSON.stringify(list, null, 2),
      'utf-8',
    );
  });
