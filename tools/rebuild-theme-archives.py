#!/usr/bin/env python3
"""Rebuild the archived theme pages (themes/*.html) from the CURRENT index.html.

Each archive keeps its own theme (CSS block, body tag, banner and decorations)
but picks up everything else from the live home page, so the archives never
fall behind (footer, buttons, wording, layout).

Run from the repo root:  python3 tools/rebuild-theme-archives.py
Before changing the live theme, first archive the OLD theme:
  python3 tools/rebuild-theme-archives.py --new <name> --title "<Display name>"
(this reads the theme currently in index.html and writes themes/<name>.html).
"""
import re, sys, glob, os

def parts(html):
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
    s = re.sub(r'(href|src)="(about-james|services|faq|themes|web-designer-northwich|web-design-cheshire|privacy|cookies|free-website-terms|consent-config\.js|consent\.js|images/james\.jpg)([#"?])', r'\1="/\2\3', s)
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
