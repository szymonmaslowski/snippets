export const getBookContent = (id, signal) => {
  const options = signal ? { signal } : {};
  return fetch(`http://localhost:3000/api/books/${id}`, options).then(
    response => {
      if (response.ok) {
        return response.text();
      }
      throw Error(response.statusText);
    },
  );
};
