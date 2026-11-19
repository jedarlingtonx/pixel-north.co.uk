// Applies to every entry in this folder. A draft gets no page at all.
module.exports = {
  layout: "concept.njk",
  eleventyComputed: {
    permalink: (data) => (data.draft ? false : `/concepts/${data.page.fileSlug}.html`),
    canonicalPath: (data) => `/concepts/${data.page.fileSlug}`,
  },
};
