#!/usr/bin/env python3
"""Rebuild the archived theme pages (themes/*.html) from the CURRENT index.html.

Each archive keeps its own theme (CSS block, body tag, banner and decorations)
but picks up everything else from the live home page, so the archives never
fall behind (footer, buttons, wording, layout).

IMPORTANT: in index.html, theme CSS is everything from `.season-strip{display:none}` down to </style>.
Keep all other CSS ABOVE that line, or archives will not pick it up.

Run from the repo root:  python3 tools/rebuild-theme-archives.py
Before changing the live theme, first archive the OLD theme:
  python3 tools/rebuild-theme-archives.py --new <name> --title "<Display name>"
(this reads the theme currently in index.html and writes themes/<name>.html).
"""
import re, sys, glob, os

BAR_CSS = '<style id="arch-bar-css">.arch-bar{background:#FF3D8B;color:#1A1033;font:500 15px/1.4 "DM Sans",system-ui,sans-serif;text-align:center;padding:10px 16px;position:relative;z-index:5}.arch-bar a{color:#1A1033;font-weight:700;white-space:nowrap}.arch-bar a:hover{text-decoration:none}.arch-bar .crumbs{margin:0 0 4px;font-size:14px}.arch-bar .crumbs ol{list-style:none;display:flex;flex-wrap:wrap;gap:4px 8px;margin:0;padding:0;align-items:center;justify-content:center}.arch-bar .crumbs li{display:flex;align-items:center;gap:8px}.arch-bar .crumbs li,.arch-bar .crumbs a,.arch-bar .crumbs [aria-current]{color:#1A1033}.arch-bar .crumbs li+li::before{content:"\\203A"}.arch-bar .crumbs [aria-current]{font-weight:700}</style>\n'

def strip_bar(html):
    html = re.sub(r'<style id="arch-bar-css">.*?</style>\n', '', html, flags=re.S)
    return re.sub(r'<div class="arch-bar".*?</div>\n', '', html, flags=re.S)

def parts(html):
    html = strip_bar(html)
    css = re.search(r'\.season-strip\{display:none\}.*?(?=\n</style>)', html, re.S).group(0)
    body = re.search(r'<body data-season="[^"]*">\n<!--.*?-->\n<div class="season-strip".*?</div>\n', html, re.S).group(0)
    decos = re.findall(r'<div class="season-deco" aria-hidden="true">.*?</div>', html, re.S)
    assert len(decos) == 6, len(decos)
    return css, body, decos

def archive_comment(html):
    m = re.search(r'<!-- ARCHIVED THEME.*?-->\n', html)
    return m.group(0) if m else ''

def build(index, theme_src, title, comment):
    css, body, decos = parts(theme_src)
    ncss, nbody, ndecos = parts(index)
    s = index
    s = s.replace(ncss, css, 1).replace(nbody, body, 1)
    for old, new in zip(ndecos, decos):
        s = s.replace(old, new, 1)
    s = re.sub(r'<title>.*?</title>', f'<title>{title} theme (archive) | Pixel North</title>\n<meta name="robots" content="noindex, follow">', s, 1, flags=re.S)
    s = re.sub(r'<link rel="canonical"[^>]*>\n', '', s)
    s = re.sub(r'<meta (property="og:|name="twitter:)[^>]*>\n', '', s)
    s = re.sub(r'<meta name="robots" content="index[^>]*>\n', '', s)
    s = re.sub(r'<script type="application/ld\+json">.*?</script>\n', '', s, flags=re.S)
    s = re.sub(r'(href|src)="(about-james|services|faq|themes|pixel-ai|web-designer-northwich|web-design-cheshire|privacy|cookies|free-website-terms|consent-config\.js|consent\.js|images/james\.jpg)([#"?])', r'\1="/\2\3', s)
    s = s.replace('</style>\n', '</style>\n' + BAR_CSS, 1)
    bar = f'<div class="arch-bar" role="note"><div class="crumbs" role="navigation" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/services">Services</a></li><li><a href="/themes">Themes</a></li><li><span aria-current="page">{title}</span></li></ol></div>You\u2019re previewing the {title} theme. <a href="/themes#what">Exit preview</a></div>\n'
    s = s.replace('<div class="season-strip"', bar + '<div class="season-strip"', 1)
    s = s.replace('</head>\n', '</head>\n' + comment, 1)
    return s

def main():
    index = open('index.html').read()
    args = sys.argv[1:]
    if '--new' in args:
        name = args[args.index('--new') + 1]
        title = args[args.index('--title') + 1]
        cm = f'<!-- ARCHIVED THEME: the {title} 2026 home page, kept as a copy for the Pixel North themes portfolio. Not indexed. The live home page is /index.html. -->\n'
        open(f'themes/{name}.html', 'w').write(build(index, index, title, cm))
        print('wrote', name); return
    for p in sorted(glob.glob('themes/*.html')):
        old = open(p).read()
        title = re.search(r'<title>(.*?) theme \(archive\)', old).group(1)
        open(p, 'w').write(build(index, old, title, archive_comment(old)))
        print('rebuilt', p)

main()
