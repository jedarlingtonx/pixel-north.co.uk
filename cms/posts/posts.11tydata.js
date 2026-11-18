// Applies to every post in this folder. A draft gets no page at all.
module.exports = {
  layout: "post.njk",
  eleventyComputed: {
    permalink: (data) => (data.draft ? false : `/blog/${data.page.fileSlug}.html`),
    canonicalPath: (data) => `/blog/${data.page.fileSlug}`,
  },
};
