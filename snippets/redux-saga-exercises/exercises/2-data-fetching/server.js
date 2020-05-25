const http = require('http');

const leremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Turpis egestas maecenas pharetra convallis posuere morbi leo. Pellentesque massa placerat duis ultricies. Et magnis dis parturient montes nascetur ridiculus mus. Nisl nunc mi ipsum faucibus vitae aliquet. Sociis natoque penatibus et magnis. Et netus et malesuada fames ac turpis egestas sed tempus. A scelerisque purus semper eget duis at tellus. Egestas congue quisque egestas diam in arcu cursus euismod. Integer quis auctor elit sed vulputate. Amet nisl suscipit adipiscing bibendum.

Maecenas accumsan lacus vel facilisis volutpat est velit egestas dui. Sagittis orci a scelerisque purus semper eget duis. Massa tincidunt dui ut ornare lectus sit. Tellus in hac habitasse platea dictumst vestibulum. Vitae ultricies leo integer malesuada nunc vel risus commodo. Amet nisl purus in mollis nunc sed id semper risus. Tortor pretium viverra suspendisse potenti nullam ac tortor. Pretium quam vulputate dignissim suspendisse in est ante. Eget sit amet tellus cras. Donec ac odio tempor orci dapibus ultrices in. Ut enim blandit volutpat maecenas volutpat blandit aliquam etiam. Etiam non quam lacus suspendisse faucibus interdum posuere. Duis ultricies lacus sed turpis tincidunt id aliquet. Enim facilisis gravida neque convallis a.

Enim neque volutpat ac tincidunt vitae. Vulputate ut pharetra sit amet aliquam id diam. Lectus urna duis convallis convallis. Consequat nisl vel pretium lectus quam id leo. Bibendum enim facilisis gravida neque. Senectus et netus et malesuada. Neque aliquam vestibulum morbi blandit cursus risus at. Morbi tristique senectus et netus et. Amet luctus venenatis lectus magna. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim. Posuere ac ut consequat semper viverra nam libero justo. Sit amet venenatis urna cursus. Vitae semper quis lectus nulla at volutpat.

Gravida dictum fusce ut placerat orci nulla pellentesque dignissim enim. Ut sem nulla pharetra diam sit amet nisl suscipit. Pellentesque diam volutpat commodo sed. Varius quam quisque id diam vel quam elementum pulvinar etiam. Et tortor consequat id porta nibh. Quam id leo in vitae turpis massa. Velit aliquet sagittis id consectetur purus ut faucibus pulvinar. Mauris pharetra et ultrices neque ornare aenean euismod. Neque egestas congue quisque egestas diam in. Ultricies lacus sed turpis tincidunt id. At auctor urna nunc id. Est sit amet facilisis magna etiam tempor orci. Quam vulputate dignissim suspendisse in. Condimentum id venenatis a condimentum vitae sapien pellentesque. Urna id volutpat lacus laoreet non curabitur. Nisl suscipit adipiscing bibendum est. Ut placerat orci nulla pellentesque dignissim enim sit. Risus at ultrices mi tempus imperdiet nulla malesuada pellentesque.

Faucibus vitae aliquet nec ullamcorper sit amet risus nullam. A scelerisque purus semper eget duis at. Molestie nunc non blandit massa. Est ullamcorper eget nulla facilisi etiam dignissim. Volutpat maecenas volutpat blandit aliquam. At ultrices mi tempus imperdiet nulla. Velit sed ullamcorper morbi tincidunt ornare massa eget. Et malesuada fames ac turpis egestas sed tempus urna. Aliquet risus feugiat in ante metus dictum. Dolor morbi non arcu risus quis varius. Et sollicitudin ac orci phasellus. Gravida arcu ac tortor dignissim convallis aenean et tortor at. Pellentesque eu tincidunt tortor aliquam nulla facilisi cras fermentum. Ultricies lacus sed turpis tincidunt id.

Elementum facilisis leo vel fringilla est ullamcorper. Orci nulla pellentesque dignissim enim sit amet. Nec ullamcorper sit amet risus. Sollicitudin nibh sit amet commodo nulla facilisi. Bibendum ut tristique et egestas. Neque gravida in fermentum et sollicitudin ac orci. Ultrices in iaculis nunc sed augue lacus viverra. Amet nulla facilisi morbi tempus iaculis urna id. Netus et malesuada fames ac turpis egestas. Habitasse platea dictumst quisque sagittis purus sit amet volutpat consequat. Adipiscing vitae proin sagittis nisl rhoncus. At ultrices mi tempus imperdiet nulla. Eget egestas purus viverra accumsan in nisl nisi. Pharetra magna ac placerat vestibulum lectus mauris ultrices eros. Interdum consectetur libero id faucibus nisl tincidunt. Aenean et tortor at risus viverra adipiscing at in. Lectus quam id leo in vitae turpis massa. Non sodales neque sodales ut.`;

const port = 3000;
http
  .createServer((req, res) => {
    setTimeout(() => {
      if (req.url === '/api/books/1') {
        res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
        res.end(leremIpsum);
        return;
      }

      res.writeHead(404, { 'Access-Control-Allow-Origin': '*' });
      res.end();
    }, 5000);
  })
  .listen(port, () => {
    console.info(`Server listening on port ${port}`);
  });
