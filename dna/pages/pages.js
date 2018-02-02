'use strict';

// https://developer.holochain.org/API_reference
// https://developer.holochain.org/Test_driven_development_features

function slugForTitle (title) {
  return title.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/&/g, '-and-')         // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-');        // Replace multiple - with single -
}

function createPage (arg) {
  var pageObject = arg;
  var pageHash = commit("page", pageObject);
  // instantiate an itemSequence for the page
  call("items", "createItemSequence", {
    pageHash: pageHash,
    // instantiate it with an empty sequence
    itemSequence: {sequence: []}
  });

  // create a slug for the page, based on the title
  var slug = slugForTitle(arg.title);
  var metaHash = commit("pageMeta", {
    slug: slug
  });
  // hang the page entry off the slug, so it's findable by slug
  commit("slugLinks", {
    Links: [
      {
        Base: metaHash,
        Link: pageHash,
        Tag: "page for slug"
      }
    ]
  });

  // link all pages to the DNA hash so they can be retrieved all at once
  commit("wikiPageLinks", {
    Links: [
      {
        Base: App.DNA.Hash,
        Link: metaHash,
        Tag: "wiki page"
      }
    ]
  });
  return pageHash;
}

function getPages () {
  var pages = getLinks(App.DNA.Hash, "wiki page", { Load: true });
  var result = [];
  for (var i = 0; i < pages.length; i++) {
    result.push(pages[i].Entry.slug);
  }
  // a list of slugs
  return result;
}

function getPage (hash) {
  var page = get(hash);
  return JSON.parse(page);
}

// Util function isErr
// helper function to determine if value returned from holochain function is an error
function isErr(result) {
    return ((typeof result === 'object') && result.name == "HolochainError");
}

function getPageBySlug (slug) {
  var metaHash = makeHash("pageMeta", {
    slug: slug
  });
  var linksToPage = getLinks(metaHash, "page for slug", { Load: true });
  if (isErr(linksToPage)) {
    return null;
  }
  return {
    hash: linksToPage[0].Hash,
    title: linksToPage[0].Entry.title
  };
}

function getFedWikiJSON (params) {
  var page = getPageBySlug(params.slug);

  if (!page) {
    return null;
  }

  var pageLinks = getLinks(page.hash, "page item", { Load: true });

  // define a top level object for our response
  var response = {
    title: page.title
  };
  // we will populate this story array with items
  var story = [];

  for (var i = 0; i < pageLinks.length; i++) {
    // get the basic entry object
    var item = pageLinks[i].Entry;
    // create a new item which will be put into the story
    var newItem = {
      type: item.type,
      id: item.id
    };
    // pull extra, type-specific fields up
    for (var field in item.fields) {
      if (item.fields.hasOwnProperty(field)) {
        newItem[field] = item.fields[field]
      }
    }
    // add the properly item structured into the story array
    story.push(newItem);
  };

  var itemSequence = call("items", "getItemSequence", {
    pageHash: page.hash
  });

  // sort story array by itemSequence
  story = story.sort(function(a,b){
    return itemSequence.indexOf(a.id) - itemSequence.indexOf(b.id);
  });

  // set the story array as a property on the response
  response.story = story;
  return response;
}

function getSitemapEntry (slug) {
  // get page by slug
  var page = getPageBySlug(slug);
  if (!page) {
    return null;
  }

  // get items, get sequence, retrieve first item, and use text as synopsis
  // TODO: how to do date?
  return {
    slug: slug,
    title: page.title,
    date: 1512129313492, // TODO: unhardcode!
    synopsis: "Hello!" // TODO: unhardcode!
  };
}

function getSitemap () {
  var slugs = getPages();
  var result = [];
  for (var i = 0; i < slugs.length; i++) {
    result.push(getSitemapEntry(slugs[i]));
  }
  return result;
}

// VALIDATION FUNCTIONS
function validateCommit (entryName, entry, header, pkg, sources) {
  switch (entryName) {
    case "page":
      // validation code here
      return true;
    case "pageMeta":
      // validation code here
      return true;
    case "wikiPageLinks":
      // validation code here
      return true;
    case "slugLinks":
      // validation code here
      return true;
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
      return true;
    case "wikiPageLinks":
      // validation code here
      return true;
    case "slugLinks":
      // validation code here
      return true;
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
      return true;
    case "wikiPageLinks":
      // validation code here
      return true;
    case "slugLinks":
      // validation code here
      return true;
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
      return true;
    case "wikiPageLinks":
      // validation code here
      return true;
    case "slugLinks":
      // validation code here
      return true;
    default:
      // invalid entry name!!
      return false;
  }
}

function validateLink (entryName, baseHash, links, pkg, sources) {
  switch (entryName) {
    case "wikiPageLinks":
      // validation code here
      return true;
    case "slugLinks":
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
