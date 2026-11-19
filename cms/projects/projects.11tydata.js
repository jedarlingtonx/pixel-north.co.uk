// Applies to every entry in this folder. A draft gets no page at all.
module.exports = {
  layout: "project.njk",
  eleventyComputed: {
    permalink: (data) => (data.draft ? false : `/projects/${data.page.fileSlug}.html`),
    canonicalPath: (data) => `/projects/${data.page.fileSlug}`,
  },
};
