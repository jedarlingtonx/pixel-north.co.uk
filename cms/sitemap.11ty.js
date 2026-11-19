// Only built once the blog is switched on (cms/_data/site.js). Until then the hand-written
// sitemap.xml in the root of the repo is copied across as it is.
module.exports = class {
  data() {
    return {
      eleventyExcludeFromCollections: true,
      eleventyComputed: { permalink: (data) => (data.site.blogLive ? "/sitemap.xml" : false) },
    };
  }

  render(data) {
    const posts = data.collections.posts;
    const iso = (value) => new Date(value).toISOString().slice(0, 10);
    const entry = (loc, lastmod) => `  <url>\n    <loc>${loc}</loc>\n${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ""}  </url>`;
    // A section is listed only once it has something published.
    const section = (path, items) =>
      items.length
        ? [entry(`${data.site.url}/${path}`, iso(items[0].date))].concat(
            items.map((item) => entry(`${data.site.url}/${path}/${item.fileSlug}`, iso(item.date)))
          )
        : [];
    const extra = [].concat(
      section("blog", posts),
      section("projects", data.collections.projects),
      section("concepts", data.collections.concepts)
    );
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${data.staticSitemap.concat(extra).join("\n")}\n</urlset>\n`;
  }
};
