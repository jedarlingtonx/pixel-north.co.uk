# Pixel North website

A single-page website for Pixel North: *Small business sites, sorted.*

The pages are plain HTML, CSS and a little JavaScript, written by hand in the root of this repo. Only the blog and the `/admin` content manager are built, by Eleventy, from the `cms/` folder (see "Blog and content manager" below). The only external request is Google Fonts (Outfit and DM Sans).

## Files

- `index.html`: the main page
- `privacy.html`, `cookies.html`: the privacy notice and cookie policy
- `404.html`: the branded "page not found" page
- `free-website-terms.html`: terms for the launch free-website prize draw (hidden from search engines)
- Forms: submissions are sent through Web3Forms. The (public) access key is `ACCESS_KEY` in the script at the bottom of `index.html` and `pnl4106-terms-conditions.html`.
- `consent.js`: the shared Pixel North cookie control (identical on every site, never edited per site). It loads Google Analytics only after consent.
- `consent-config.js`: this site's cookie control settings (GA4 measurement ID, cookie name, colours, fonts, how long a choice is remembered, audit log address)
- `chat-widget.js`: the "Ask Pixel" chat window engine (from the Kit's `chat-assistant`, never edited here), loaded by a script tag at the bottom of each page. Remove the `chat-widget.js` tag to switch the chat off.
- `chat-config.js`: the chat's wording, colours and fonts. Edit this to change how the chat looks or what it says on screen.
- `worker/pixel-north-worker.js`: the Worker. It routes the consent log, then the chat, then serves everything else as normal.
- `worker/chat-handler.js`: the chat's server engine (from the Kit, never edited here). Answers `/api/chat` using Cloudflare Workers AI.
- `worker/chat-site.js`: what Pixel knows: the page list it reads, the links it may give, the facts that are on no page, and the backup notes. **Edit this when a page, offer or policy changes.**
- `wrangler.jsonc`: Cloudflare settings (Worker name, build command, AI connection, 404 page, log settings). The name must match the Worker in the Cloudflare dashboard.
- `.assetsignore`: keeps the config, Worker code and build tooling out of the public website. The build reads this same list, so a new page in the root ships automatically.
- `package.json`, `package-lock.json`, `eleventy.config.js`, `cms/`: the build for the blog and the content manager
- `sitemap.xml`: lists the pages for search engines
- `images/james.jpg`: the portrait in the hero section
- `images/og-image.png`: the preview image shown when the site is shared (1200 x 630)

## Things to check now and then

1. **The chat model.** Cloudflare retires AI models from time to time. If Pixel starts saying "I can't answer right now", check the model names (`DEFAULT_MODELS`) at the top of `worker/chat-handler.js` against developers.cloudflare.com/workers-ai/models.
2. **The statistics.** The "Why your business needs a modern website" section quotes Ofcom, DataReportal and Squarespace/YouGov figures. Re-check them when you update the page.
3. **The privacy notice.** Keep it in step with any change to the form service, analytics, hosting or chat.

## Blog and content manager

The blog is written in a content manager at `/admin` (Sveltia CMS, free). Each save is a commit to GitHub, and Cloudflare rebuilds the site. Sign-in is through GitHub, using the shared `sveltia-cms-auth` Worker (the allowed sites are listed in its `ALLOWED_DOMAINS` setting in Cloudflare).

- **How the build works.** `npm run build` (run by Cloudflare through the `build` setting in `wrangler.jsonc`) assembles `_site`: it copies every hand-written file from the root exactly as it is (minus the names in `.assetsignore`), then adds the blog and `/admin`. Cloudflare serves `_site`. The hand-written pages are never rewritten.
- **Where things are.** Posts are Markdown files in `cms/posts/`. The page layouts are in `cms/_includes/` (`base.njk`, `post.njk`, and `page.css`, `header.njk` and `footer.njk`, which are copies of the inner-page style, menu and footer). The CMS settings are `cms/admin/config.yml`. Pictures uploaded in the CMS go to `images/blog/`.
- **Keep the copies in step.** If the menu, the footer or the shared page style changes on the hand-written pages, make the same change in `cms/_includes/header.njk`, `footer.njk` or `page.css`.
- **The blog is hidden until launch.** `blogLive` in `cms/_data/site.js` is `false`: blog pages ask search engines not to list them and are left out of the sitemap, and nothing links to them. To launch: set `blogLive` to `true`; add Blog to the menu and footer (every page, plus `cms/_includes/header.njk` and `footer.njk`); add the blog pages to the chat's page list in `worker/chat-site.js`; delete the sample post. When `blogLive` is true the build writes `sitemap.xml` from the root `sitemap.xml` plus the blog.
- **Where the CMS saves.** `branch` in `cms/admin/config.yml`: `staging` while testing, `main` when live.
- **Local build.** `npm install`, then `npm run build`.

## Deploy with Cloudflare

The site is a Cloudflare Worker with static assets, connected to this GitHub repository.

1. Push to `main`: `git add .`, `git commit -m "message"`, `git push`.
2. Cloudflare builds automatically (it runs `npm run build`, then `npx wrangler deploy`). Check progress under Workers & Pages, then Deployments.
3. Hard refresh the live site (Cmd+Shift+R) to see the change.

Do not add a folder called `functions`. Cloudflare reads that as a Pages project and the build fails.

## Brand reference

- Colours: North Violet `#5B21E6`, Pixel Pink `#FF3D8B`, Midnight Ink `#1A1033`, Lilac Mist `#F1EBFF`, White `#FFFFFF`
- Typefaces: Outfit (headings), DM Sans (body)
- The colours are CSS variables at the top of the `<style>` block, and the page always uses its light colour scheme, whatever the visitor's device setting.
