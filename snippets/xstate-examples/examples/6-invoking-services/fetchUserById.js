const fetchUserById = userId =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId === '123') {
        resolve({
          name: 'Szymon Masłowski',
          company: 'OpenX',
        });
        return;
      }

      reject(new Error('User not found'));
    }, 2000);
  });

export default fetchUserById;
