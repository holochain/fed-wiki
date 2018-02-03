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
  var page = JSON.parse(get(hash));
  page.slug = slugForTitle(page.title);
  return page;
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
  var itemSequence = JSON.parse(call("items", "getItemSequence", {
    pageHash: page.hash
  }));
  var story = [];
  for (var i = 0; i < itemSequence.length; i++) {
    // get the basic entry object
    // here, we rely on the data forwarding behaviour
    // to get an item entry by its oldest hash, and receive the latest content
    var itemHash = itemSequence[i];
    var itemEntry = get(itemHash);
    itemEntry = JSON.parse(itemEntry);
    itemEntry.id = itemHash;
    // pull extra, type-specific fields up
    for (var field in itemEntry.fields) {
      if (itemEntry.fields.hasOwnProperty(field)) {
        itemEntry[field] = itemEntry.fields[field];
      }
    }
    delete itemEntry.fields;
    // add the properly item structured into the story array
    story.push(itemEntry);
  };
  return {
    title: page.title,
    story: story,
    journal: [] // TODO: add journal!
  };
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
