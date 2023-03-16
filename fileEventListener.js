import chokidar from 'chokidar';

const watcher = chokidar.watch('./autot.xml', {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
});

const log = console.log.bind(console);

watcher
    .on('change', path => log(`File ${path} has been changed`))

