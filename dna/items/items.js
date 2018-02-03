'use strict';

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
  insertItemToSequence({
    pageHash: pageHash,
    itemHash: itemHash
  });
  return itemHash;
}

function updateItem (arg) {
  return update('item', arg.newItem, arg.itemHash);
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
  removeItemFromSequence({
    pageHash: pageHash,
    itemHash: itemHash
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
  var sequenceEntry = privateGetItemSequence(pageHash);
  return sequenceEntry.sequence;
}

// new itemId will be added to sequence
function insertItemToSequence (arg) {
  var itemHash = arg.itemHash;
  var pageHash = arg.pageHash;
  var sequenceEntry = privateGetItemSequence(pageHash);
  var itemSequence = sequenceEntry.sequence;
  // add new item
  itemSequence.push(itemHash);
  // update
  var newSequenceHash = update('itemSequence', {
    sequence: itemSequence
  }, sequenceEntry.latestHash);
  return newSequenceHash;
}

// validate sequence length should remain the same
// should throw error if length is different
// or if all the IDs don't match
function changeItemSequence (arg) {
  var pageHash = arg.pageHash;
  var sequence = arg.sequence;
  var sequenceEntry = privateGetItemSequence(pageHash);
  var newSequenceHash = update("itemSequence", {
    sequence: sequence
  }, sequenceEntry.latestHash);
  return newSequenceHash;
}

// TODO: validate that itemHash exists in the sequence
function removeItemFromSequence (arg) {
  var pageHash = arg.pageHash;
  var itemHash = arg.itemHash;
  var sequenceEntry = privateGetItemSequence(pageHash);
  // get the current position of the item
  var itemSequence = sequenceEntry.sequence;
  var itemHashIndex = itemSequence.indexOf(itemHash);
  // remove the itemHash from itemSequence
  itemSequence.splice(itemHashIndex, 1);
  var newSequenceHash = update("itemSequence", {
    sequence: itemSequence
  }, sequenceEntry.latestHash);
  return newSequenceHash;
}

// PRIVATE
function privateGetItemSequence (pageHash) {
  var sequenceLinks = getLinks(pageHash, "page sequence")
  var sequenceHash = sequenceLinks[0].Hash;
  var sequenceEntry = JSON.parse(get(sequenceHash));
  sequenceEntry.originalHash = sequenceHash;
  // we do this because the content may differ from the hash we
  // retrieved, because of the follow updated content
  // behaviour of holochain
  sequenceEntry.latestHash = makeHash("itemSequence", {
    sequence: sequenceEntry.sequence
  });
  return sequenceEntry;
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
