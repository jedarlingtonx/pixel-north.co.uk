// Pixel North build.
//
// The site is hand-written HTML in the root of this repo. That does not change: every file
// there is copied into _site exactly as it is, except the things listed in .assetsignore
// (the same list Cloudflare used to apply when it served the root folder directly).
// Eleventy only adds three things on top, all built from the cms/ folder:
//   - the blog (/blog and /blog/<post>), written in the content manager
//   - the content manager itself (/admin)
//   - a sitemap that includes the blog, once the blog is switched on (cms/_data/site.js)
const fs = require("node:fs");
const path = require("node:path");

const ROOT = __dirname;

// Names in .assetsignore, matched against every path segment (gitignore-style, "*" allowed).
function ignoreMatchers() {
  return fs
    .readFileSync(path.join(ROOT, ".assetsignore"), "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const name = line.replace(/^\/+|\/+$/g, "");
      const body = name
        .split("*")
        .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
        .join("[^/]*");
      return new RegExp("^" + body + "$");
    });
}

module.exports = function (eleventyConfig) {
  // The content manager's own page and settings.
  eleventyConfig.addPassthroughCopy({ "cms/admin": "admin" });

  // Start every build from an empty _site, so nothing stale is ever uploaded.
  eleventyConfig.on("eleventy.before", ({ dir }) => {
    fs.rmSync(path.resolve(ROOT, dir.output), { recursive: true, force: true });
  });

  eleventyConfig.on("eleventy.after", ({ dir }) => {
    const out = path.resolve(ROOT, dir.output);
    const skip = ignoreMatchers();
    const ignored = (src) =>
      path
        .relative(ROOT, src)
        .split(path.sep)
        .some((segment) => skip.some((re) => re.test(segment)));

    // Copy the hand-written site across, one top-level entry at a time. Files Eleventy has
    // already written (for example a generated sitemap.xml) are never overwritten.
    for (const entry of fs.readdirSync(ROOT)) {
      const src = path.join(ROOT, entry);
      if (ignored(src)) continue;
      fs.cpSync(src, path.join(out, entry), {
        recursive: true,
        force: false,
        errorOnExist: false,
        filter: (file) => !ignored(file),
      });
    }

    // The content manager's code, without its source maps.
    fs.cpSync(path.join(ROOT, "node_modules/@sveltia/cms/dist"), path.join(out, "admin/cms"), {
      recursive: true,
      filter: (file) => !/\.(map|mjs)$/.test(file),
    });
  });

  // Posts are Markdown typed by an editor, so never run it through a template language,
  // and never allow raw HTML in it.
  eleventyConfig.amendLibrary("md", (md) => md.set({ html: false, linkify: true, typographer: true }));

  eleventyConfig.addCollection("posts", (api) =>
    api
      .getFilteredByGlob("cms/posts/*.md")
      .filter((item) => !item.data.draft)
      .sort((a, b) => b.date - a.date)
  );

  const londonDate = (value, options) => new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", ...options }).format(new Date(value));
  eleventyConfig.addFilter("readableDate", (value) => londonDate(value, { day: "numeric", month: "long", year: "numeric" }));
  eleventyConfig.addFilter("isoDate", (value) => new Date(value).toISOString().slice(0, 10));
  // JSON for structured data, with "<" escaped so a post can never close the script tag.
  eleventyConfig.addFilter("jsonld", (value) => JSON.stringify(value, null, 2).replace(/</g, "\\u003c"));

  return {
    dir: { input: "cms", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["md", "njk", "11ty.js"],
    markdownTemplateEngine: false,
    htmlTemplateEngine: false,
  };
};
