var bs = require('browser-sync').create();
var util = require('util');
var exec = require('child_process').exec;
var port = "4141";

function consoleOut (error, stdout, stderr) {
  util.print('stdout: ' + stdout);
  util.print('stderr: ' + stderr);
  if (error !== null) {
    console.log('exec error: ' + error);
  }
}

exec("./restart.sh", consoleOut);

console.log('what')
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
  "./ui/**/*.css",
  "./ui/**/*.js"
]).on("change", bs.reload);

bs.watch([
  "./ui/**/*.html",
  "./dna/**/*.*"
]).on("change", function () {
  util.print('HTML/DNA changed: restarting holo app.\n');
  exec('./restart.sh', consoleOut);

  setTimeout(function () {
    bs.reload("index.html");
  }, 1000);
});

console.log('end');
