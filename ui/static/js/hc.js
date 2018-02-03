var holo = {
  send: function read(zome, fn, data, callback) {
    var xhr = new XMLHttpRequest()
    var url = '/fn/' + zome + '/' + fn
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-type', 'application/json')
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        callback(JSON.parse(xhr.responseText))
      } else if (xhr.status >= 400) {
        console.log('nope')
        console.log(xhr)
      }
    }
    var stringified = JSON.stringify(data)
    xhr.send(stringified)
  }
};
