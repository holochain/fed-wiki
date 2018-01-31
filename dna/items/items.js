'use strict';

var wikiName = "TheFederation"
// how should this get set

// https://developer.holochain.org/API_reference
// https://developer.holochain.org/Test_driven_development_features

function addItem (arg) {
  var pageHash = arg.pageHash;
  var newItem = arg.newItem;
  var itemHash = commit("item", newItem);
  // create link between pageHash and itemHash
  var pageLinkHash = commit("pageLinks", {
    Links: [
      {Base:pageHash, Link:itemHash, Tag:"page item"}
    ]
  });
  // add the itemId into the itemSequence for the page
  insertItemToSequence({
    pageHash: pageHash,
    itemId: newItem.id
  });
  return itemHash;
}

function updateItem (arg) {
  var newItem = arg.newItem;
  var hash = update("item", newItem, arg.hashKey);
  return hash;
}

// TODO: handle errors
function removeItem (arg) {
  var pageHash = arg.pageHash;
  var itemHash = arg.itemHash;
  // remove link between page and item
  commit("pageLinks", {
    Links: [
      {
        Base: arg.pageHash,
        Link: arg.itemHash,
        Tag: "page item",
        LinkAction: HC.LinkAction.Del
      }
    ]
  });
  var itemId = JSON.parse(get(itemHash)).id;
  // remove the itemId from the itemSequence
  removeItemFromSequence({
    pageHash: pageHash,
    itemId: itemId
  });
  // remove the entry
  var deletedHash = remove(itemHash, arg.message);
  return deletedHash;
}

function createItemSequence (arg) {
  var pageHash = arg.pageHash;
  var itemSequence = arg.itemSequence;
  var itemSequenceHash =  commit("itemSequence", itemSequence);
  var pageLinkHash = commit("pageLinks", {
    Links: [
      {Base:pageHash, Link:itemSequenceHash, Tag:"page sequence"}
    ]
  });
  return pageLinkHash;
}

function getItemSequence (arg) {
  var pageHash = arg.pageHash;
  var pageLinks = getLinks(pageHash, "page sequence", { Load: true });
  if (pageLinks.length > 0) {
    return pageLinks[0].Entry.sequence
  } else {
    return "Error there should be a sequence for a page!";
  }
}

// private
function newSequence (arg) {
  // TODO: handle errors
  var pageHash = arg.pageHash;
  var sequenceHash = arg.sequenceHash;
  var newSequence = arg.newSequence;
  // if exists, orphan existing hash by deleting link to it
  if (sequenceHash) {
    commit("pageLinks", {
      Links: [
        {
          Base: pageHash,
          Link: sequenceHash,
          Tag: "page sequence",
          LinkAction: HC.LinkAction.Del
        }
      ]
    });
  }
  // create the new sequence
  var newSequenceHash =  commit("itemSequence", {
    sequence: newSequence
  });
  // link from the page to the new sequence
  var pageLinkHash = commit("pageLinks", {
    Links: [
      {
        Base: pageHash,
        Link: newSequenceHash,
        Tag: "page sequence"
      }
    ]
  });
  return newSequenceHash;
}

// new itemId will be added to sequence
function insertItemToSequence (arg) {
  var itemId = arg.itemId;
  var pageHash = arg.pageHash;

  // get the link to the current sequence
  var sequenceLinks = getLinks(pageHash, "page sequence", { Load: true });
  var itemSequence, itemSequenceHash;
  // only proceed if a links entry exists
  // THIS COULD HAPPEN IN VALIDATE
  if (sequenceLinks.length > 0) {
    // get the hash for the existing sequence
    itemSequenceHash = sequenceLinks[0].Hash
    // get the existing sequence
    itemSequence = sequenceLinks[0].Entry.sequence
    // add new item
    itemSequence.push(itemId)
    var newSequenceHash = newSequence({
      pageHash: pageHash,
      sequenceHash: itemSequenceHash,
      newSequence: itemSequence
    });
    return newSequenceHash;
  } else {
    debug('Error');
    return "Error there should be a sequence for a page!";
  }
}

// sequence length should remain the same
// should throw error if length is different
// or if all the IDs don't match
// DO IN VALIDATE var sequenceLink = getLinks(pageHash, "page sequence", { Load: true });
function changeItemSequence (arg) {
  var pageHash = arg.pageHash;
  var sequence = arg.sequence;
  var sequenceLinks = getLinks(pageHash, "page sequence");
  var itemSequenceHash = sequenceLinks[0].Hash;
  var newSequenceHash = newSequence({
    pageHash: pageHash,
    sequenceHash: itemSequenceHash,
    newSequence: sequence
  });
  return newSequenceHash;
}

// TODO: validate that itemId exists in the sequence
function removeItemFromSequence (arg) {
  var pageHash = arg.pageHash;
  var itemId = arg.itemId;
  var sequenceLinks = getLinks(pageHash, "page sequence", { Load: true });
  var itemSequenceHash = sequenceLinks[0].Hash;
  var itemSequence = sequenceLinks[0].Entry.sequence;
  var itemIdIndex = itemSequence.indexOf(itemId);
  // remove the itemId from itemSequence
  itemSequence.splice(itemIdIndex, 1);
  var newSequenceHash = newSequence({
    pageHash: pageHash,
    sequenceHash: itemSequenceHash, // existing (for removal)
    newSequence: itemSequence
  });
  return newSequenceHash;
}

// VALIDATION FUNCTIONS
function validateCommit (entryName, entry, header, pkg, sources) {
  switch (entryName) {
    case "item":
      // validation code here
      return true;
    case "itemSequence":
      // validation code here
      return true;
    case "pageLinks":
      // validation code here
      return true;
    default:
      // invalid entry name!!
      return false;
  }
}

function validatePut (entryName, entry, header, pkg, sources) {
  switch (entryName) {
    case "item":
      // validation code here
      return true;
    case "itemSequence":
      // validation code here
      return true;
    case "pageLinks":
      // validation code here
      return true;
    default:
      // invalid entry name!!
      return false;
  }
}

function validateMod (entryName, entry, header, replaces, pkg, sources) {
  switch (entryName) {
    case "item":
      // validation code here
      return true;
    case "itemSequence":
      // validation code here
      return true;
    case "pageLinks":
      // validation code here
      return true;
    default:
      // invalid entry name
      return false;
  }
}

function validateDel (entryName, hash, pkg, sources) {
  switch (entryName) {
    case "item":
      // validation code here
      return true;
    case "itemSequence":
      // validation code here
      return true;
    case "pageLinks":
      // validation code here
      return true;
    default:
      // invalid entry name!!
      return false;
  }
}

function validateLink (entryName, baseHash, links, pkg, sources) {
  switch (entryName) {
    case "pageLinks":
      // validation code here
      return true;
    default:
      // invalid entry name
      return false;
  }
}

function validatePutPkg (entryName) {
  return null;
}

function validateModPkg (entryName) {
  return null;
}

function validateDelPkg (entryName) {
  return null;
}

function validateLinkPkg (entryName) {
  return null;
}

function genesis () {
  // any genesis code here
  return true;
}
