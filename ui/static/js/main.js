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

var wiki = {
  activePageHash: null,
  visiblePages: [],
  storyDisplay: [],

  displayPage: function displayPage (page) {
    wiki.visiblePages = [];
    wiki.visiblePages.push(page);

    document.getElementById('wiki-page-title').innerHTML = page.title;
    wiki.storyDisplay = page.story;
    wiki.refreshStory();
  },

  getPage: function getPage (hash, callback) {
    // IF (page not in client cache)
    holo.send('pages', 'getFedWikiJSON', hash, callback);
    // OR
    // retrieve from client cache.
  },

  createPage: function createPage (page, callback) {
    holo.send('pages', 'createPage', page, callback);
  },

  addItem: function addItem (pageHash, item, callback) {
    var data = {
      pageHash: pageHash,
      newItem: {
        type: item.type,
        id: item.id,
        fields: {
          text: item.text // TODO: generalize this code so other types would work
        }
      }
    };
    holo.send('items', 'addItem', data, callback);
  },

  updateItem: function updateItem (pageHash, itemHash, item, callback) {
    var data = {
      pageHash: pageHash,
      itemHash: itemHash,
      newItem: item
    };
    holo.send('items', 'updateItem', data, callback);
  },

  removeItem: function removeItem (pageHash, itemHash, message, callback) {
    var data = {
      pageHash: pageHash,
      itemHash: itemHash,
      message: message
    };
    holo.send('items', 'removeItem', data, callback);
  },

  changeItemSequence: function changeItemSequence (pageHash, sequence, callback) {
    var data = {
      pageHash: pageHash,
      sequence: sequence
    };
    holo.send('items', 'changeItemSequence', data, callback);
  },

  addItemEditor: function addItemEditor () {
    wiki.storyDisplay.push({
      type: "new-paragraph"
    });
    wiki.refreshStory();

  },

  renderStoryItem: function renderStoryItem (item, index) {
    var markup = "";
    if (item.type === "new-paragraph") {
      return "<div class='new-paragraph'><textarea data-nif-id='" + index + "'></textarea></div>";
    } else if (item.type === "paragraph") {
      return "<p id='" + this.id +"'>" + item.text + "</p>";
    }

    return markup;
  },

  refreshStory: function refreshStory () {
    var storyMarkup = "";

    storyMarkup = wiki.storyDisplay.map(wiki.renderStoryItem).join("");

    document.getElementById("wiki-page-story").innerHTML = storyMarkup;
  },

  init: function () {
    console.log('GO');

    wiki.createPage({
        "title": "Welcome Visitors"
    }, function (hash) {
      wiki.getPage(hash, function (page) {
        wiki.activePageHash = hash;
        wiki.displayPage(page);
      })
    });

    document.getElementById("add-story-item").
      addEventListener("click", function () {
        wiki.addItemEditor();
      });

    document.getElementById("wiki-page").
      addEventListener("focusout", function (event) {
        if (event.target.tagName === "TEXTAREA") {
          if (event.target.value === "") {
            var nifIndex = event.target.getAttribute('data-nif-id')
            wiki.storyDisplay.splice(nifIndex, 1)
          } else {
            // create the item
            var newItem = {
              type: "paragraph",
              id: Math.random().toString(),
              text: event.target.value
            }
            wiki.addItem(wiki.activePageHash, newItem, function() {})
            // replace the textarea with the created item
            var nifIndex = event.target.getAttribute('data-nif-id')
            wiki.storyDisplay[nifIndex] = newItem;
          }
          wiki.refreshStory();
        }
      });
  }

};

wiki.init();
