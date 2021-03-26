const fs = require('fs');
const path = require('path');

const readSongs = () =>
  fs
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

module.exports = readSongs;
