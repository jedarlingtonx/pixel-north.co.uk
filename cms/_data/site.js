module.exports = {
  name: "Pixel North",
  url: "https://pixel-north.co.uk",
  ogImage: "/images/og-image.png",

  // THE BLOG LAUNCH SWITCH.
  // false: the blog works but stays hidden. Its pages ask search engines not to list them
  //        (noindex) and it is left out of the sitemap. Nothing on the site links to it.
  // true:  the blog pages can be listed by search engines and the sitemap includes them.
  // Switched on 19 Nov 2026 (menu link added). Projects and Concepts share this switch.
  // A section with nothing published yet stays noindex and out of the sitemap.
  blogLive: true,
};
