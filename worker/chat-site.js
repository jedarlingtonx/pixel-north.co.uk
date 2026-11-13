// Pixel North: settings for the Pixel chat assistant (the Worker half).
// This is the ONLY chat file in worker/ that is edited per site. chat-handler.js is the shared
// engine from the Kit (chat-assistant) and is never edited here. See the Kit README for every setting.
//
// Keep Pixel informed: whenever a page, offer, form or policy is added or changed on this site,
// ask "does Pixel need to know about this?"
//   New public page         -> add it to `pages`.
//   New link Pixel may give -> add it to `links`.
//   A fact on no page       -> add a line to `coreFacts`.
//   Privacy or cookies change -> update the summary in `fallbackKnowledge` too (the live pages are
//                              read first; the summary is only the backup).
// A link with `when` (matched against the visitor's question) and `label` is added to a reply that forgot it.
// Then ask Pixel a test question on the staging preview before merging.

export default {
  assistant: "Pixel",
  business: "Pixel North",
  owner: "James",
  contactEmail: "james@pixel-north.co.uk",

  // Prices are never published. A written quotation follows an initial consultation.
  pricing: "none",
  extraRules: [
    "A written quotation follows an initial consultation with James. The only timescale you may mention is \"live in as little as a week\".",
    "The contact form is reached from the \"Get a quote\" button, so you can mention that button as well as the form.",
  ],

  // The only links Pixel may give. The privacy and cookie pages (/privacy, /cookies) and the
  // email address are added automatically. A link with `when` (a pattern tested against the
  // visitor's question) and `label` is also added to the reply if the model forgot it.
  links: [
    { url: "/faq", about: "frequently asked questions", when: "\\bfaqs?\\b|frequently asked", label: "FAQs" },
    { url: "/web-design-cheshire", about: "web design across Cheshire and the UK", when: "cheshire|uk.wide|outside (of )?northwich", label: "web design across Cheshire" },
    { url: "/web-designer-northwich", about: "web design in Northwich, based in Winnington", when: "northwich|winnington", label: "web design in Northwich" },
    { url: "/about-james", about: "about James, the designer", when: "about james|who is james|who are you|who runs|who.s behind", label: "About James" },
    { url: "/services", about: "what Pixel North offers, in detail", when: "\\bservices?\\b|what (do you|can you) (offer|do)", label: "services" },
    { url: "/themes", about: "seasonal themes", when: "theme|seasonal|halloween|bonfire|remembrance|autumn|christmas", label: "seasonal themes" },
    { url: "/assessment", about: "free two-minute assessment: do you need a website, a refresh or a new one", when: "assessment|quiz|not sure (if )?i need|do i (even )?need a (new )?website|need a (new )?website\\?", label: "free assessment" },
    { url: "/pixel-ai", about: "Pixel AI, the website chat assistant that Pixel North can set up on clients\u2019 sites", when: "pixel ai|chat ?bot|chat assistant|ai assistant|assistant like (this|you)", label: "Pixel AI" },
    { url: "/free-website-terms", about: "free website competition terms", when: "free website|competition|prize|giveaway|raffle", label: "competition terms" },
    { url: "/pnl4106-terms-conditions#claim", about: "50% off offer terms, and the form to claim the extension to a promo code", when: "promo|extend|extension|50%|half price|flyer", label: "claim form" },
    { url: "/marketing-unsubscribe", about: "unsubscribe from marketing emails", when: "unsubscribe|stop (the )?(marketing )?emails", label: "unsubscribe page" },
    { url: "/#contact", about: "contact form", when: "contact form|get in touch|how (do|can) i contact|get a quote|book a (call|consultation)", label: "contact form" },
    { url: "/#services", about: "services" },
    { url: "/#quotes", about: "how quotes work", when: "how (do )?quotes? work|quotation process", label: "how quotes work" },
  ],

  // The live pages Pixel reads, so its answers always match the site. Optional pages are skipped
  // if they go missing. `max` is how many characters of the page are used: keep it above the
  // page's own length (privacy.html was cut short at the 7000 default once it grew past it).
  pages: [
    { label: "HOME PAGE", paths: ["/", "/index.html"], required: true },
    { label: "PRIVACY NOTICE (page: /privacy)", paths: ["/privacy", "/privacy.html"], required: true, max: 9000 },
    { label: "COOKIE POLICY (page: /cookies)", paths: ["/cookies", "/cookies.html"], required: true, max: 6000 },
    { label: "FAQ PAGE (page: /faq)", paths: ["/faq", "/faq.html"], max: 6000 },
    { label: "SERVICES PAGE (page: /services)", paths: ["/services", "/services.html"], max: 6000 },
    { label: "ABOUT JAMES PAGE (page: /about-james)", paths: ["/about-james", "/about-james.html"], max: 6000 },
    { label: "WEB DESIGN IN NORTHWICH PAGE (page: /web-designer-northwich)", paths: ["/web-designer-northwich", "/web-designer-northwich.html"], max: 6000 },
    { label: "WEB DESIGN ACROSS CHESHIRE PAGE (page: /web-design-cheshire)", paths: ["/web-design-cheshire", "/web-design-cheshire.html"], max: 6000 },
    { label: "PIXEL AI PAGE (page: /pixel-ai)", paths: ["/pixel-ai", "/pixel-ai.html"], max: 6000 },
    { label: "ASSESSMENT PAGE (page: /assessment)", paths: ["/assessment", "/assessment.html"], max: 5000 },
    { label: "SEASONAL THEMES PAGE (page: /themes)", paths: ["/themes", "/themes.html"], max: 5000 },
    // The 50% off offer terms, including how to extend a promo code.
    { label: "50% OFF OFFER TERMS AND CLAIM FORM (page: /pnl4106-terms-conditions)", paths: ["/pnl4106-terms-conditions", "/pnl4106-terms-conditions.html"], max: 9000 },
    { label: "FREE WEBSITE COMPETITION TERMS (page: /free-website-terms)", paths: ["/free-website-terms", "/free-website-terms.html"], max: 9500 },
  ],

  // Facts that are not written on any page, or that matter most. Always included.
  coreFacts: `
- Pixel North is a one-person web design business run by James, a freelance web designer in Northwich, Cheshire. James meets clients in person across Cheshire, and works with small businesses anywhere in the UK. Tagline: "Small business sites, sorted". Email: james@pixel-north.co.uk. Phone: 07846 012932. Pixel North is run by Pixel North Limited (company number 16490976), registered in England and Wales.
- Pixel AI is the website assistant (the chat you are talking in) that Pixel North can set up on clients' websites, answering visitors' questions from the client's own pages. Clients' sites need to be hosted on Cloudflare. No prices are published; a written quotation follows an initial consultation. See /pixel-ai.
- Seasonal and event-based themes can keep a website feeling current. The Pixel North home page carries a small seasonal theme at times of year (see /themes for the themes made so far and which one is live).
- The assessment (/assessment) is a free two-minute set of quick questions that gives a straight answer. There are four possible results: "Your socials are enough for now", "Your website is doing its job", "Your website needs a refresh", or "You need a new website". It is built to turn people away when that is the honest answer, and it is a rule of thumb, not a verdict. Nothing is sent anywhere unless the visitor clicks "Tell me about your business", which copies their answers into the contact form.
- Promo codes: the 50% off offer is open for 3 months from the date the code was issued (the date on the flyer). It can be extended to 6 months in total by completing the "Claim the extension to your promo code" form at the bottom of the offer terms page. If someone asks how to extend a promo code, tell them that and link to the form.
- Marketing emails: people can unsubscribe at any time using the unsubscribe page.
- The contact form asks for first and last name, email, business name, an optional current website address, what you need (a brand new website, a refresh of your current site, or not sure yet) and a short message.`,

  // Hand-written backup notes, used only if the required live pages cannot be read.
  // Last checked against the live site on 11 Nov 2026 (privacy notice and cookie policy dated 10 Nov 2026).
  fallbackKnowledge: `
ABOUT PIXEL NORTH
Pixel North is a one-person web design business run by James, a freelance web designer based in Northwich, Cheshire. James meets clients in person across Cheshire, and works with small businesses anywhere in the UK. Tagline: "Small business sites, sorted". Website: pixel-north.co.uk. Email: james@pixel-north.co.uk. Phone: 07846 012932. Pixel North is run by Pixel North Limited, registered in England and Wales.
James helps small businesses build an online presence, creating greater customer reach, visibility and trust.

WHY A MODERN WEBSITE MATTERS (sources are named)
- 59% of UK internet users research products and brands online before they buy (DataReportal, Digital 2025: United Kingdom).
- UK adults spend an average of 4.5 hours a day online (Ofcom, Online Nation 2025).
- 82% of UK adults use Google Search, which handles around 3 billion searches a month in the UK (Ofcom, Online Nation 2025).
- 79% of Brits agree a business with a well-designed website is more credible than one with only a social media page (Squarespace and YouGov survey, 2022).
A website that's sorted means you're easy to find, easy to trust, and easy to contact.

A WEBSITE, MINUS THE FAFF
- Quick: live in as little as a week.
- Personal: one designer, no hand-offs. You deal with the person doing the work.
- Clear: plain English, and a clear written quotation after an initial consultation.
- Sorted: launch, handover and support are covered.

SERVICES (James tailors a package to fit each business)
- Website design and build: a custom, mobile-friendly site that looks sharp and says clearly what you do, from first sketch to launch.
- Website refresh: a tired or confusing site, tidied up, with a fresher design and simpler structure.
- Content and copy support: help shaping pages, from structure to plain-English wording.
- Search and analytics setup: search foundations, Google Business profile, and simple analytics.
- Enquiry forms and bookings: contact forms and enquiry or booking tools that send customers straight to James.
- Care and support: hosting, backups, updates and small edits, so the site stays safe and up to date after launch.
- Seasonal and event-based themes can keep a website feeling current (see /themes for the themes made so far and which one is live).
- Pixel AI: a website chat assistant like this one, set up on a client's own site (see /pixel-ai).

HOW QUOTES WORK
1. An initial consultation: a talk about your business, goals and what you need from a website. James is also happy to meet in person, and coffee is on him.
2. A clear quotation: a written quotation covering what's included, the timeline, and the cost.
3. Start when you're ready: no pressure. If it looks right, work begins. If not, you've lost nothing.

NOT SURE YOU NEED A WEBSITE?
The free two-minute assessment at /assessment gives a straight answer: your socials are enough, your website is doing its job, it needs a refresh, or you need a new one. It turns people away when that is the honest answer.

PRIVACY AND COOKIES (summary of the privacy notice at /privacy and cookie policy at /cookies, both dated 10 November 2026)
- The site is run by Pixel North Limited (company number 16490976). Contact: james@pixel-north.co.uk or 07846 012932.
- The pages themselves don't store personal data. Google Analytics cookies are used only if the visitor accepts them. Rejecting is as easy as accepting, and the site works the same either way. The visitor can change their choice any time via "Cookie settings" in the footer.
- Cookies: pn_consent (this site, essential, remembers the choice and holds a random ID, 12 months); cf_clearance (set by Cloudflare, the host, only for security, to tell real visitors from bots; essential, up to 12 months, may not be set for every visitor, not used for analytics or advertising, and can't be switched off from the cookie settings); _ga and _ga_<container ID> (Google Analytics, up to 13 months, only with consent).
- Each choice is also saved in a short consent record (a random ID, the date and time, the choice, the policy version and the page, with no name, email or IP address), kept for 12 months and then deleted, to show what the visitor agreed to.
- Not a cookie: the assessment's answers are kept briefly in the browser's temporary (session) storage so they can be copied into the contact form, and cleared once the form page has used them. The services page and home page also note in session storage that the assessment pop-up or the customer review card has been seen, so they are not shown again in the same visit. That disappears when the tab is closed.
- Contact form details (name, email, business name, current website if given, what's needed, and the message) go through Web3Forms, which emails them to James and keeps a copy in his account for 30 days, then deletes it. They are used only to reply to the enquiry and prepare a quotation. James keeps enquiries from people who don't become clients for up to 12 months, then deletes them. Details are never sold. Marketing emails are only sent if the visitor ticks the marketing box, and they can unsubscribe any time.
- If someone phones, James may note their name, number and reason for calling, and treats it like a form enquiry. Customer reviews shown on the site appear with the customer's agreement.
- The chat assistant is automated. Typed questions are sent to Cloudflare's AI service to write a reply. Visitors should not put personal or sensitive details in the chat. James does not keep a record of what is typed, and the chat does not use cookies. Cloudflare may log technical information such as IP addresses.
- Other companies involved: Google Fonts, Google Analytics (only with consent), Cloudflare (hosting, consent records, and the AI service for the chat), Web3Forms (form service, run from India) and email providers. Some, such as Google and Cloudflare, may process data outside the UK.
- Analytics data is kept for up to 14 months.
- Rights: visitors can ask to see, correct, delete or restrict their data by emailing James. They can complain to the Information Commissioner's Office (ico.org.uk).

CONTACTING JAMES
Use the "Tell me about your business" form on the website (Get a quote button), email james@pixel-north.co.uk, or phone 07846 012932. The form asks for name, email, business name, optional current website address, what you need (a brand new website, a refresh of your current site, or not sure yet) and a short message. Details are used only to reply to the enquiry. See the privacy notice at /privacy and cookie policy at /cookies.`,
};
