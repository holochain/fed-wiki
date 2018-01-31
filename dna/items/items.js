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
  return itemHash;
}

function updateItem (arg) {
  var newItem = arg.newItem;
  var hash = update("item", newItem, arg.hashKey);
  return hash;
}

function removeItem (arg) {
  var deletedHash = remove(arg.hashKey, arg.message);
  return deletedHash;
}

// VALIDATION FUNCTIONS
function validateCommit (entryName, entry, header, pkg, sources) {
  switch (entryName) {
    case "item":
      // validation code here
      return true;
    case "itemSequence":
      // validation code here
      return false;
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
      return false;
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
      return false;
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
      return false;
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
