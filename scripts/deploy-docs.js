"use strict";

const ghpages = require("gh-pages");

const docsDir = "docs";
const options = {
  user: {
    name: "Macklin Underdown",
    email: "macklinu@users.noreply.github.com"
  }
};
const callback = err => {
  if (err) {
    console.error(err);
  } else {
    console.log("🚀 Docs deployed to GitHub Pages");
  }
};

ghpages.publish(docsDir, options, callback);
