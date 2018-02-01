var holo = {
  read: function read(path, hash, callback) {
    var xhr = new XMLHttpRequest()
    var url = path
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-type', 'application/json')
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        callback(JSON.parse(xhr.responseText))
      } else {
        console.log('nope')
        console.log(xhr)
      }
    }
    var data = JSON.stringify(hash)
    xhr.send(data)
  },

  create: function create(path) {
    var xhr = new XMLHttpRequest()
    var url = '/fn/HoloWorld/holoWorldEntryCreate'
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-type', 'application/json')
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        callback(JSON.parse(xhr.responseText))
      }
    }
    var data = JSON.stringify({'content': task, 'timestamp': 101010})
    xhr.send(data)
  }
};

var wiki = {
  displayPage: function displayPage(title) {
    console.log('try to display page')
    var path = '/fn/pages/getPage';
    var hash = '???'
    // IF (page not in client cache)
    holo.read(path, hash, function (p) {
      console.log(p);
    });
    // OR
    // retrieve from client cache.
  },

  createPage: function (p) {
    
  },

  init: function () {
    console.log('GO')

    // TODO:
    // 1. add page (get hash)
    // 2. get page (with hash)
    // 3. display in UI
  }

};

wiki.init();
