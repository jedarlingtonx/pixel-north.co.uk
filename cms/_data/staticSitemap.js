// The hand-written sitemap.xml in the root of the repo stays the one people edit. When the blog is
// switched on, the build reads its <url> entries from there and adds the blog's.
const fs = require("node:fs");
const path = require("node:path");

module.exports = () => {
  const xml = fs.readFileSync(path.join(__dirname, "..", "..", "sitemap.xml"), "utf8");
  return xml.match(/ {2}<url>[\s\S]*?<\/url>/g) || [];
};
