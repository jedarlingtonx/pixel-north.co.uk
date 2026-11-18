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
    const blog = [entry(`${data.site.url}/blog`, posts.length ? iso(posts[0].date) : "")].concat(
      posts.map((post) => entry(`${data.site.url}/blog/${post.fileSlug}`, iso(post.date)))
    );
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${data.staticSitemap.concat(blog).join("\n")}\n</urlset>\n`;
  }
};
