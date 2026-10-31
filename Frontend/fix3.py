import os, re

FILES = [
    "src/features/dashboard/Dashboard.jsx",
    "src/features/portfolio/Portfolio.jsx",
    "src/features/markets/Markets.jsx",
    "src/features/stocks/StockDetail.jsx",
    "src/features/trade/Trade.jsx",
    "src/features/transactions/Transactions.jsx",
    "src/features/watchlist/Watchlist.jsx",
    "src/features/news/News.jsx",
    "src/features/insights/Insights.jsx",
    "src/features/learn/Learn.jsx",
    "src/features/settings/Settings.jsx",
    "src/pages/Home.jsx",
    "src/components/layout/AppLayout.jsx",
]

# Mojibake strings and their replacements (Latin-1 misread UTF-8)
MOJIBAKE = {
    '\xc3\xb0\xc5\xb8\xe2\x80\x99\xe2\x80\x8b': '',  # wave emoji bytes
    'ðŸ\x91\x8b': '',   # wave
    'ðŸ\xa4\x96': '',   # robot
    'ðŸ"Š': '',          # chart
    'ðŸ"°': '',          # newspaper
    'ðŸ\x97\xa1': '',   # shield
    'ðŸ"': '',           # note
    'ðŸ"ˆ': '',          # chart up
    'ðŸ"\x89': '',      # chart down
    'ðŸ\x8e‰': '',     # party
    'ðŸ\x8e"': '',     # grad cap
    '\xe2\x80\x8b': '', # zero width space
    'â€¦': '...',
    'â€"': '-',
    'â€™': "'",
    'â€˜': "'",
    'â€œ': '"',
    'â€': '"',
    'Â·': '.',
    'Â ': ' ',
    'Â': '',
    'â—\x8f': 'o',
    'â- ': 'o',
    'â-\x8b': 'o',
    'â–²': '^',
    'â–¼': 'v',
    'â†\x91': '->',
    'â†\x90': '<-',
    'â†\x98': '->',
    'âœ\x93': 'v',
    'âœ\x95': 'x',
    'â\x9c\x93': 'v',
    'â\x9c\x95': 'x',
    'â"€': '-',
}

for path in FILES:
    if not os.path.exists(path):
        continue
    with open(path, 'r', encoding='utf-8', errors='replace') as f:
        text = f.read()
    orig = text
    for bad, good in MOJIBAKE.items():
        text = text.replace(bad, good)
    # Nuclear option: remove all chars > U+007F that aren't common punctuation/currency
    # Keep: ₹ (U+20B9), → (U+2192), · (U+00B7), " ' etc
    def clean_char(c):
        cp = ord(c)
        if cp <= 0x007F: return c  # ASCII
        if cp == 0x20B9: return c  # Rupee sign
        if cp in (0x2192, 0x2190, 0x2191, 0x2193): return '->'  # arrows
        if cp == 0x00B7: return '.'  # middle dot
        if cp in (0x2018, 0x2019): return "'"  # smart quotes
        if cp in (0x201C, 0x201D): return '"'  # smart dquotes
        if cp == 0x2026: return '...'  # ellipsis
        if cp == 0x2014: return '-'  # em dash
        if cp == 0x2013: return '-'  # en dash
        if 0x0900 <= cp <= 0x097F: return c  # Devanagari (keep)
        if 0x2000 <= cp <= 0x206F: return ' '  # general punctuation -> space
        if cp > 0x00FF: return ''  # remove everything else non-ASCII-extended
        return c  # Latin extended - keep
    text = ''.join(clean_char(c) for c in text)
    if text != orig:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(text)
        print('FIXED:', path)
    else:
        print('OK:   ', path)
print('Done')