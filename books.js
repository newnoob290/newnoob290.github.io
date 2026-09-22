/* ------------------------------------------------------------------
   THE ONLY FILE YOU EDIT WHEN YOU ADD A BOOK.

   Add one entry to the list below and it appears in two places at once:
     1. the Major Project 1 hover menu, on every page of the site
     2. the shelf on project1.html

   accent: rust | ochre | plum | teal | slate   (pick an unused one)
------------------------------------------------------------------- */

window.ENC_BOOKS = [
  {
    href:   "kitchen.html",
    title:  "The Kitchen",
    blurb:  "Rhetoric in my family’s kitchen",
    desc:   "Rhetoric in my family’s kitchen: kairos in my mom’s cooking, and identification at the table.",
    accent: "rust"
  },
  {
    href:   "research.html",
    title:  "RWC Research Notes",
    blurb:  "Field research on site",
    desc:   "The observation stage: every research question answered on site, before any of it became an essay.",
    accent: "ochre"
  },
  {
    href:   "datalog.html",
    title:  "Data Collection Log",
    blurb:  "Kairos and identification",
    desc:   "Two question sets answered inside the RWC: kairos, and identification with the people on the floor.",
    accent: "plum"
  },
  {
    href:   "goals.html",
    title:  "My Goals",
    blurb:  "Non-grade goals for MP1",
    desc:   "What I personally hope to get out of this project, written before the drafting started.",
    accent: "teal"
  },
  {
    href:   "drafting.html",
    title:  "Drafting",
    blurb:  "Initial drafting, and citing sources",
    desc:   "The first claim and its evidence, then the same claim worked through with a quote from Downs.",
    accent: "slate"
  }
];

(function () {
  var books = window.ENC_BOOKS || [];

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* the hover menu under "Major Project 1" */
  var menu = document.querySelector("[data-books-menu]");
  if (menu) {
    var html = '<a href="project1.html">All of it<span>The shelf</span></a>';
    books.forEach(function (b) {
      html += '<a href="' + esc(b.href) + '">' + esc(b.title) +
              '<span>' + esc(b.blurb) + '</span></a>';
    });
    menu.innerHTML = html;
  }

  /* the shelf on project1.html */
  var shelf = document.querySelector("[data-books-shelf]");
  if (shelf) {
    shelf.innerHTML = books.map(function (b) {
      return '<a class="shelfbook" href="' + esc(b.href) + '" style="--accent:var(--' + esc(b.accent) + ')">' +
               '<span class="shelfcover">' +
                 '<span class="cover-title">' + esc(b.title) + '</span>' +
                 '<hr class="cover-rule">' +
                 '<span class="cover-sub">Michael Wong &middot; ENC 1101</span>' +
               '</span>' +
               '<span class="shelfkicker">Read on this site</span>' +
               '<span class="shelfdesc">' + esc(b.desc) + '</span>' +
               '<span class="shelfcta">Open the book &rarr;</span>' +
             '</a>';
    }).join("");
  }
})();
