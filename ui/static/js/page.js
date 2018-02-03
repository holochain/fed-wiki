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

  getFedWikiJSON: function getPage (slug, callback) {
    holo.send('pages', 'getFedWikiJSON', {
      slug: slug
    }, callback);
  },

  getPageBySlug: function getPage (slug, callback) {
    holo.send('pages', 'getPageBySlug', slug, callback);
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

    switch (item.type) {
      case "edit-paragraph":
      case "new-paragraph":
        markup += "<div class='edit-paragraph' id='" + item.id +
          "' data-type='" + item.type +
          "'><textarea class='w-100' data-nif-id='" + index +
          "'>" + text + "</textarea></div>";
        break;
      default:
        markup += "<p draggable='true' ondragstart='wiki.drag(event)' " +
          " id='" + item.id +
          "' class='paragraph-item'>" + text + "</p>";
        break;
    }

    markup += "</div>";

    return markup;
  },

  refreshStory: function refreshStory () {
    var storyMarkup = "";
    storyMarkup = wiki.storyDisplay.map(wiki.renderStoryItem).join("");
    document.getElementById("wiki-page-story").innerHTML = storyMarkup;
  },

  quickNewParagraph: function quickNewParagraph(at) {
    // wiki.finishEditingStoryItem()
    var OldItemHash;
    wiki.storyDisplay.splice(at, 0, {
      type: "new-paragraph",
      text: "",
      id: Math.random().toString().split('.')[1],
    });
    wiki.refreshStory();
    // Focus in new paragraph textarea
    var fields = document.querySelectorAll('#wiki-page-story textarea');
    fields[0].focus();
  },

  getStoryItemIndex: function getStoryItemIndex (id) {
    var index;
    for (var i = 0; i < wiki.storyDisplay.length; i++) {
      if (wiki.storyDisplay[i].id === id) {
        index = i;
        continue;
      }
    }
    return index;
  },

  editStoryItem: function editStoryItem (id) {
    var itemIndex = wiki.getStoryItemIndex(id)
    var item = wiki.storyDisplay[itemIndex];
    wiki.storyDisplay[itemIndex] = {
      type: "edit-paragraph",
      text: item.text,
      id: id
    };
    wiki.refreshStory();
    document.querySelectorAll("[data-nif-id='" + itemIndex + "']")[0].focus();
  },

  finishEditingStoryItem: function finishEditingStoryItem (item) {
    var itemIndex = wiki.getStoryItemIndex(item.id);
    wiki.storyDisplay[itemIndex] = item;
    // TODO: update on holo.
    // wiki.updateItem(wiki.activePageHash, OldItemHash, newItem, function(hash) {
    // });
  },

  init: function () {
    // HACK!
    var pageSlug = window.location.search.split('=')[1]
    wiki.getFedWikiJSON(pageSlug, function (page) {
      wiki.displayPage(page);
    });
    wiki.getPageBySlug(pageSlug, function (page) {
      wiki.activePageHash = page.hash;
    });

    document.getElementById("add-story-item").
      addEventListener("click", function () {
        wiki.addItemEditor();
      });

    document.getElementById("wiki-page").
      addEventListener("focusout", function (event) {
        if (event.target.tagName === "TEXTAREA") {
          var textField = event.target;
          var nifIndex = textField.getAttribute('data-nif-id');
          var isEdit = (textField.parentNode.dataset['type'] === "edit-paragraph");
          if (textField.value === "") {
            wiki.storyDisplay.splice(nifIndex, 1)
          } else if (isEdit) {
            var newText = textField.value;
            wiki.finishEditingStoryItem({
              type: "paragraph",
              text: newText,
              id: textField.parentNode.id
            });
          } else {
            // create the item
            var newItem = {
              type: "paragraph",
              id: Math.random().toString().split('.')[1],
              text: textField.value
            }
            wiki.addItem(wiki.activePageHash, newItem, function(hash) {
              newItem.hash = hash;
            })
            // replace the textarea with the created item
            var nifIndex = textField.getAttribute('data-nif-id')
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
                wiki.finishEditingStoryItem({
                  type: "paragraph",
                  text: event.target.value,
                  id: event.target.parentNode.id
                });
                var location = 1 + wiki.getStoryItemIndex(event.target.parentNode.id);
                wiki.quickNewParagraph(location);
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
