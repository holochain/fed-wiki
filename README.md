# Liquid Wiki

Federated Wiki on Holochain

## To link in this instance with fed-wiki

You will have to also run the fed-wiki proxy... https://github.com/Connoropolous/holochain-fed-wiki-proxy

## Development

Issue: Holochain caches the ui, so it needs to be restarted to get ui updates. For more rapid development, we have some solutions.

To use browsersync for 'live reloading' of assets and html:

`npm install` (Just once. Assuming you have Node.JS installed.)

`npm start`

This starts 2 servers:

- the holochain application
- browsersync as proxy server, serving from the holo app, and serving the 'static' assets directory

And it watches the ui files. When you update static assets (i.e. css or js), the change is detected and browsersync inserts the updated assets into our proxy'd view. When you update HTML, the holochain app is restarted, then (after a 1 second pause) browsersync reloads it in the browser.

It also watches and builds the JS in ui-src, using webpack. This is where coffeescript libraries from the wiki-client module get imported. This generates bundle.js.

For auto-restarting without browsersync: [check out for how to use the restart.sh file][autorestart].

[autorestart]: https://developer.holochain.org/webserver_auto_restart
