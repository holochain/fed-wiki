var bs = require('browser-sync').create();
var util = require('util')
var exec = require('child_process').exec;
var port = "4141";
var holo;

function consoleOut (error, stdout, stderr) {
  util.print('stdout: ' + stdout);
  util.print('stderr: ' + stderr);
  if (error !== null) {
    console.log('exec error: ' + error);
  }
}

exec("hcdev --no-nat-upnp web " + port, consoleOut);

setTimeout(function () {
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
}, 1000);

bs.watch([
  "./**/*.css",
  "./**/*.js"
]).on("change", bs.reload);

bs.watch([
  "./**/*.html"
]).on("change", function () {
  util.print('HTML changed: restarting holo app.\n');
  exec('./restart.sh', consoleOut);
  setTimeout(function () {
    bs.reload("index.html");
  }, 1000);
});
