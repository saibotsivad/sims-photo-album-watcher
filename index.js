var chokidar = require('chokidar')
var path = require('path')
var fs = require('fs')
var Emitter = require('events').EventEmitter
var parser = require('sims-photo-album-parser')

module.exports = function neighborhoodWatcher(neighborhoodPath) {
	var emitter = new Emitter()

	var watcher = chokidar.watch(path.normalize(neighborhoodPath))
	watcher.on('add', emitUpdate)
	watcher.on('change', emitUpdate)
	watcher.on('unlink', emitDelete)

	function emitUpdate(path, stats) {
		if (isNeighborhoodFile(path)) {
			console.log(path)
			fs.readFile(path, { encoding: 'utf8' }, function(err, xml) {
				if (err) {
					emitter.emit('error', { readNeighborhoodFile: err })
				} else {
					parser(xml, function(err, photoAlbum) {
						if (err) {
							emitter.emit('error', { parseXml: err })
						} else {
							photoAlbum.path = path
							emitter.emit('save', photoAlbum)
						}
					})
				}
			})
		}
	}

	function emitDelete(path) {
		if (isNeighborhoodFile(path)) {
			emitter.emit('delete', path)
		}
	}

	return emitter
}

function isNeighborhoodFile(path) {
	return path.toLowerCase().indexOf('.xml') === path.length - 4
}
