var bs = require('browser-sync').create();
var util = require('util')
var exec = require('child_process').exec;
var port = "4141";
var holo;

function execError (error, stdout, stderr) {
  util.print('stdout: ' + stdout);
  util.print('stderr: ' + stderr);
  if (error !== null) {
    console.log('exec error: ' + error);
  }
}

function startHoloApp (cb) {
  return exec("hcdev --no-nat-upnp web " + port, execError);
}

holo = startHoloApp();

bs.init({
  proxy: "localhost:" + port,
  cors: true,
  serveStatic: [
    {
      route: '/static',
      dir: 'ui/static'
    }
  ]
});

bs.watch([
  "./**/*.css",
  "./**/*.js"
]).on("change", bs.reload);
