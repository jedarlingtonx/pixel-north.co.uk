// Pixel North: settings for the Pixel chat assistant (the front-end half).
// This is the ONLY front-end chat file edited for this site; chat-widget.js is the shared engine
// from the Kit (chat-assistant) and is never edited here. Must load before chat-widget.js.
window.CHAT_ASSISTANT = {
  name: "Pixel",
  buttonLabel: "Ask Pixel",
  subtitle: "Pixel North’s AI assistant, not James",
  welcome: "Hi, I’m Pixel, the Pixel North website assistant. Ask me about the services, how quotes work, or how to get in touch.",
  placeholder: "Type your question",
  disclaimer: "AI answers can be wrong, and quotations only come from James. Please don’t share personal details here.",
  privacyUrl: "/privacy",
  privacyLabel: "Privacy",
  errorText: "Sorry, the AI models I use aren’t available right now. Please try again in a moment, or contact James directly using the [contact form](/#contact).",

  allowedEmails: ["james@pixel-north.co.uk"],

  colors: {
    brand: "#5B21E6",
    accent: "#FF3D8B",
    ink: "#1A1033",
    panel: "#F1EBFF",
    accentHover: "#FF5A9F",
    inputBorder: "#CFC0F5",
    line: "#E3D9FA",
    muted: "#4A3F6B",
    dots: "#8B5CF6"
  },
  fonts: {
    body: "'DM Sans', system-ui, sans-serif",
    heading: "'Outfit', system-ui, sans-serif"
  },

  sparkle: true
};
