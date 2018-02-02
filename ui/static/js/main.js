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
      type: "edit-paragraph"
    });
    wiki.refreshStory();
    document.querySelector('textarea').focus();
  },

  moveItem: function moveItem (from, to) {
    // TODO: fix ordering
    var movedItem = wiki.storyDisplay[from];
    var destinationIndex = (from > to) ? to - 1 : to;
    wiki.storyDisplay.splice(from, 1);
    wiki.storyDisplay.splice(destinationIndex, 0, movedItem);
    wiki.refreshStory();
  },

  drag: function drag (event) {
    event.dataTransfer.setData("text", event.target.id);
  },

  allowDrop: function allowDrop (event) {
    event.preventDefault();
  },

  drop: function drop (event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    console.log(data)
  },

  renderStoryItem: function renderStoryItem (item, index) {
    var markup = "<div ondrop='wiki.drop(event)' ondragover='wiki.allowDrop(event)'>";
    var text = item.text || "";
    if (item.type === "edit-paragraph") {
      markup += "<div class='edit-paragraph'><textarea class='w-100' data-nif-id='" + index + "'>" + text + "</textarea></div>";
    } else if (item.type === "paragraph") {
      markup += "<p draggable='true' ondragstart='wiki.drag(event)' id='" + item.id +"' class='paragraph-item'>" + text + "</p>";
    }

    markup += "</div>";

    return markup;
  },

  refreshStory: function refreshStory () {
    var storyMarkup = "";
    storyMarkup = wiki.storyDisplay.map(wiki.renderStoryItem).join("");
    document.getElementById("wiki-page-story").innerHTML = storyMarkup;
  },

  quickNewParagraph: function quickNewParagraph(previousId, newText) {
    var newItem = {
      id: Math.random().toString(),
      type: "paragraph",
      text: newText,
    }
    wiki.storyDisplay[previousId] = newItem;
    wiki.storyDisplay.splice(previousId + 1, 0, {
      type: "edit-paragraph"
    });
    wiki.addItem(wiki.activePageHash, newItem, function(hash) {
      newItem.hash = hash;
    });
    wiki.refreshStory();
    // Focus in new paragraph textarea
    var fields = document.querySelectorAll('#wiki-page-story textarea');
    fields[0].focus();
  },

  editStoryItem: function editStoryItem (id) {
    var itemIndex, item;
    for (var i = 0; i < wiki.storyDisplay.length; i++) {
      if (wiki.storyDisplay[i].id === id) {
        itemIndex = i;
        item = wiki.storyDisplay[i];
        continue;
      }
    }
    wiki.storyDisplay[itemIndex] = {
      type: "edit-paragraph",
      text: item.text
    };
    wiki.refreshStory();
  },

  init: function () {
    wiki.createPage({
        "title": "Welcome Developers!"
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
            wiki.addItem(wiki.activePageHash, newItem, function(hash) {
              newItem.hash = hash;
            })
            // replace the textarea with the created item
            var nifIndex = event.target.getAttribute('data-nif-id')
            wiki.storyDisplay[nifIndex] = newItem;
          }
          wiki.refreshStory();
        }
      });

      document.getElementById("wiki-page").
        addEventListener("keydown", function (event) {
          if (event.target.tagName === "TEXTAREA") {
            if (event.key === "Enter") {
              event.preventDefault();
              if (event.target.value !== "") {
                var id = event.target.getAttribute('data-nif-id');
                wiki.quickNewParagraph(id, event.target.value);
              } else {
                event.target.blur();
                // TODO: if this was a paragraph, delete it.
              }
            }
          }
        });

      document.getElementById("wiki-page").
        addEventListener("dblclick", function (event) {
          if (event.target.className === "paragraph-item") {
            wiki.editStoryItem(event.target.getAttribute("id"));
          }
        })
  }

};

wiki.init();
