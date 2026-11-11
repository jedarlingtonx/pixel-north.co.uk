// Pixel North Worker. Routes, in order: the consent log (/api/consent...), the Ask Pixel chat
// (/api/chat), then everything else is served from the static site files (404.html included).
// The Workers AI binding named AI is declared in wrangler.jsonc.
//
// The chat is the Kit's chat-assistant module: chat-handler.js is the shared engine (never edited
// here) and chat-site.js holds this site's facts, page list and links (the file to edit).

import { handleConsent, pruneConsent } from "./consent-log.js";
import { handleChatRequest } from "./chat-handler.js";
import chatSite from "./chat-site.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const consent = await handleConsent(request, env, url);
    if (consent) return consent;
    const chat = await handleChatRequest(request, env, url, chatSite);
    if (chat) return chat;
    if (url.pathname.startsWith("/api/")) {
      return new Response(JSON.stringify({ error: "not_found" }), {
        status: 404,
        headers: { "content-type": "application/json" },
      });
    }
    return env.ASSETS.fetch(request);
  },
  // Daily Cron Trigger (wrangler.jsonc): delete consent records past their retention period.
  async scheduled(event, env, ctx) {
    ctx.waitUntil(pruneConsent(env));
  },
};
