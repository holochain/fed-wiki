var wiki = {
  activePageHash: null,
  visiblePages: [],
  storyDisplay: [],
  savedStoryItems: [],

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
      newItem: {
        type: item.type,
        fields: {
          text: item.text // TODO: generalize this code so other types would work
        }
      }
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
      type: "edit-paragraph",
      id: Math.random().toString().split('.')[1],
    });
    wiki.refreshStory();
    document.querySelector('textarea').focus();
  },

  moveItem: function moveItem (from, to) {
    if (from !== to) {
      var movedItem = wiki.storyDisplay[from];
      wiki.storyDisplay.splice(from, 1);
      wiki.storyDisplay.splice(to, 0, movedItem);
      wiki.refreshStory();
      // TODO: change sequence in holo
      var newSequence = wiki.storyDisplay.map(x => x.id);
      wiki.changeItemSequence(wiki.activePageHash,
        newSequence,
        function () {});
    }
  },

  drag: function drag (event) {
    event.dataTransfer.setData("text", event.target.id);
  },

  allowDrop: function allowDrop (event) {
    event.preventDefault();
    // console.log(event);
  },

  renderStoryItem: function renderStoryItem (item, index) {
    var markup = "<div class='story-item'>";
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
      id: id,
      latestHash: item.latestHash
    };
    wiki.refreshStory();
    document.querySelectorAll("[data-nif-id='" + itemIndex + "']")[0].focus();
  },

  finishEditingStoryItem: function finishEditingStoryItem (item) {
    var itemIndex = wiki.getStoryItemIndex(item.id);
    wiki.storyDisplay[itemIndex] = item;

    if (wiki.savedStoryItems.indexOf(item.id) > -1) {
      wiki.updateItem(wiki.activePageHash, item.latestHash, item,
        function(newHash) {
          item.latestHash = newHash;
      });
    } else {
      // add newItem
      wiki.addItem(wiki.activePageHash, item, function (hash){
        item.id = hash;
        item.latestHash = hash;
      });
      wiki.savedStoryItems.push(item.id);
    }
  },

  handleDragDrop: function handleDragDrop(event) {
    // reorder story events ui
    if (event.type === "dragover") {
      event.preventDefault();
      // console('dragging');
    }

    if (event.target.classList &&
        event.dataTransfer.getData("text") &&
        event.target.classList.contains("paragraph-item")) {
      switch (event.type) {
        case "dragover":
          // Visual effect
          var destinationId = event.target.id;
          var newItemPosition = wiki.getStoryItemIndex(destinationId);
          document.querySelectorAll('.paragraph-item')[newItemPosition].
            classList.add('bg-pink')
          break;
        case "dragleave":
          event.target.classList.remove('bg-pink');
          break;
        case "drop":
          event.preventDefault();
          event.target.classList.remove('bg-pink');
          // event.target.classList.remove('bg-pink');
          var movedItemId = event.dataTransfer.getData("text");
          var destinationId = event.target.id;
          var draggedItemPosition = wiki.getStoryItemIndex(movedItemId);
          var newItemPosition = wiki.getStoryItemIndex(destinationId);
          wiki.moveItem(draggedItemPosition, newItemPosition);
          break;
        default:
          break;
      }
    }
  },

  init: function () {
    // HACK!
    var pageSlug = window.location.search.split('=')[1]
    wiki.getFedWikiJSON(pageSlug, function (page) {
      wiki.displayPage(page);
      page.story.forEach(x => {
        wiki.savedStoryItems.push(x.id);
      })
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
            console.log('fin')
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
        });

      document.getElementById("wiki-page-story").
        addEventListener("dragover",
          function (event) { wiki.handleDragDrop(event); });

      document.getElementById("wiki-page-story").
        addEventListener("dragleave",
          function (event) { wiki.handleDragDrop(event); });

      document.getElementById("wiki-page-story").
        addEventListener("drop",
          function (event) { wiki.handleDragDrop(event); });
  }

};

wiki.init();
