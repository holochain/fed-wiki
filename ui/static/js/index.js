var wiki = {

  createPage: function createPage (page, callback) {
    holo.send('pages', 'createPage', page, callback);
  },

  getPage: function getPage (pageHash, callback) {
    holo.send('pages', 'getPage', pageHash, callback);
  },

  getPages: function getPages (callback) {
    holo.send('pages', 'getSitemap', "", callback);
  },

  displayPages: function displayPages (pages) {
    console.log(pages);
    var html = pages.map(wiki.renderPageLi).join("");
    document.getElementById("pages").innerHTML = html;
  },

  renderPageLi: function renderPageLi (page) {
    return "<li><a class='link dim blue' href='/page.html?slug=" + page.slug + "'>" + page.title + "</a></li>";
  },

  quickNewPage: function quickNewParagraph(title) {
    var newPage = {
      title: title
    };
    // createPage and redirect
    wiki.createPage(newPage, function (hash) {
      wiki.getPage(hash, function (page) {
        window.location = "/page.html?slug=" + page.slug
      })
    });
  },

  init: function () {

    document.getElementById("create-page").
      addEventListener("keydown", function (event) {
        if (event.target.tagName === "INPUT") {
          if (event.key === "Enter") {
            event.preventDefault();
            if (event.target.value !== "") {
              wiki.quickNewPage(event.target.value);
            }
          }
        }
      });
    wiki.getPages(wiki.displayPages);
  }
};

wiki.init();
