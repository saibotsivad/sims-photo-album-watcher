var neighborhoodWatcher = require('../')
var test = require('tape')
var fs = require('fs')
var path = require('path')

var DIR = __dirname
var TMP_FILE = path.join(DIR, 'tmp.xml')
var CREATE_FILE = path.join(DIR, '/sample/sample1.xml')
var OVERWRITE_FILE = path.join(DIR, '/sample/sample2.xml')

var emitter = null

test('setup', function (t) {
	emitter = neighborhoodWatcher(DIR)
	t.end()
})

test('add neighborhood file', overwriteNeighborhoodFile(CREATE_FILE))
test('change neighborhood file', overwriteNeighborhoodFile(OVERWRITE_FILE))
test('delete neighborhood file', deleteNeighborhoodFile)
test('done', function (t) {
	t.pass('I THINK CHOKIDAR HANGS THE TEST')
	t.end()
})

function overwriteNeighborhoodFile(srcFile) {
	return function overwrite(t) {
		emitter.removeAllListeners()
		t.plan(2)

		emitter.on('error', function (err) {
			t.fail('emitted \'error\' ' + require('util').inspect(err))
		})

		fs.createReadStream(srcFile)
			.pipe( fs.createWriteStream(TMP_FILE) )
			.on('close', function () {
				t.pass('saved')

				emitter.on('save', function (photoAlbum) {
					// Does not check the validity of photoAlbum
					t.pass('emitted \'save\'')
					t.end()
				})
			})
	}
}

function deleteNeighborhoodFile(t) {
	emitter.removeAllListeners()
	t.plan(2)

	fs.unlink(TMP_FILE, function (err) {
		t.notOk(err, err ? err.message : 'no error')

		emitter.on('delete', function (path) {
			t.equal(TMP_FILE, path, 'file path is correct')
			t.end()
		})
	})
}
