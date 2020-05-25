const socket = new WebSocket(`ws://${window.location.host}`);
socket.addEventListener('open', () => {
  socket.addEventListener('message', e => {
    let message;
    try {
      message = JSON.parse(e.data);
    } catch (error) {
      console.error(error);
    }

    const { type } = message;
    if (type === 'reload') {
      window.location.reload();
    }
  });
});
