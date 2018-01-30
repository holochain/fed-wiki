'use strict';

var wikiName = "TheFederation"
// how should this get set

// https://developer.holochain.org/API_reference
function createPage (arg) {
  var pageObject = arg;
  pageObject["wikiName"] = "TheFederation";
  var hash = commit("page", pageObject);
  return hash;
}

function renamePage (arg) {
  var newPage = {title: arg.newEntry.title, wikiName: wikiName};
  var hash = update("page", newPage, arg.hashkey);
  return hash;
}

// https://developer.holochain.org/Test_driven_development_features
function getPage (hash) {
  var page = get(hash);
  return JSON.parse(page);
}

// VALIDATION FUNCTIONS
function validateCommit (entryName, entry, header, pkg, sources) {
  switch (entryName) {
    case "page":
      // validation code here
      return true;
    case "pageMeta":
      // validation code here
      return false;
    case "item":
      // validation code here
      return false;
    case "itemSequence":
      // validation code here
      return false;
    case "pageLinks":
      // validation code here
      return false;
    default:
      // invalid entry name!!
      return false;
  }
}

function validatePut (entryName, entry, header, pkg, sources) {
  switch (entryName) {
    case "page":
      // validation code here
      return true;
    case "pageMeta":
      // validation code here
      return false;
    case "item":
      // validation code here
      return false;
    case "itemSequence":
      // validation code here
      return false;
    case "pageLinks":
      // validation code here
      return false;
    default:
      // invalid entry name!!
      return false;
  }
}

function validateMod (entryName, entry, header, replaces, pkg, sources) {
  switch (entryName) {
    case "page":
      // validation code here
      return true;
    case "pageMeta":
      // validation code here
      return false;
    case "item":
      // validation code here
      return false;
    case "itemSequence":
      // validation code here
      return false;
    case "pageLinks":
      // validation code here
      return false;
    default:
      // invalid entry name
      return false;
  }
}

function validateDel (entryName, hash, pkg, sources) {
  switch (entryName) {
    case "page":
      // validation code here
      return false;
    case "pageMeta":
      // validation code here
      return false;
    case "item":
      // validation code here
      return false;
    case "itemSequence":
      // validation code here
      return false;
    case "pageLinks":
      // validation code here
      return false;
    default:
      // invalid entry name!!
      return false;
  }
}

function validateLink (linkEntryType, baseHash, links, pkg, sources) {
  switch (entryName) {
    case "pageLinks":
      // validation code here
      return false;
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
