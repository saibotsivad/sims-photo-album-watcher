# sims-photo-album-watcher

Watch a Sims 2 photo album folder for changes and emit events.

## install

Install the normal way with npm:

```sh
npm install sims-photo-album-watcher
```

## use

It is an event emitter that emits `save`, `delete`, and `error`.

```js
var folderWatcher = require('sims-photo-album-watcher')
var watcher = neighborhoodWatcher('/User/me/Games/Sims2/Neighborhoods')
watcher.on('save', function(photoAlbum) {
	console.log('save:', photoAlbum.familyName)
})
watcher.on('delete', function(path) {
	console.log('delete:', path)
})
watcher.on('error', function(err) {
	console.log('err:', err)
})
```

## bugs and requests

If you find a bug, please file an [issue](https://github.com/tobiaslabs/sims-photo-album-watcher/issues).

## license

[VOL](http://veryopenlicense.com)
