module.exports = {
  name: "Pixel North",
  url: "https://pixel-north.co.uk",
  ogImage: "/images/og-image.png",

  // THE BLOG LAUNCH SWITCH.
  // false: the blog works but stays hidden. Its pages ask search engines not to list them
  //        (noindex) and it is left out of the sitemap. Nothing on the site links to it.
  // true:  the blog pages can be listed by search engines and the sitemap includes them.
  // Before switching it on, add the Blog link to the menu and footer, and add the blog pages to
  // the chat's page list (worker/chat-site.js). See README.md.
  blogLive: false,
};
