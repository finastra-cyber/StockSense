import os, re, sys

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
    "src/pages/Login.jsx",
    "src/pages/Register.jsx",
]

for path in FILES:
    if not os.path.exists(path):
        print("SKIP:", path)
        continue
    with open(path, 'rb') as f:
        raw = f.read()
    # Try to re-decode as latin-1 then re-encode as utf-8 to detect double-encoding
    try:
        text = raw.decode('utf-8')
    except:
        text = raw.decode('latin-1')
    
    orig = text
    # Remove all emoji and special unicode chars that cause rendering issues
    # Replace with plain text equivalents
    replacements = [
        ('\U0001f44b', ''),   # wave emoji
        ('\U0001f916', ''),   # robot emoji  
        ('\U0001f4ca', ''),   # bar chart
        ('\U0001f4f0', ''),   # newspaper
        ('\u26a1', ''),       # lightning
        ('\U0001f4c8', ''),   # chart up
        ('\U0001f4c9', ''),   # chart down
        ('\U0001f6e1', ''),   # shield
        ('\U0001f4dd', ''),   # memo
        ('\U0001f4d6', ''),   # book
        ('\U0001f389', ''),   # party
        ('\U0001f393', ''),   # graduation cap
        ('\u2705', ''),       # green check
        ('\u274c', ''),       # red x
        ('\u2714', 'v'),      # checkmark
        ('\u2715', 'x'),      # x mark
        ('\u27a1', '->'),     # arrow right
        ('\u2b50', '*'),      # star
        ('\u26a0', '!'),      # warning
        ('\u2139', 'i'),      # info
        ('\U0001f4b9', ''),   # chart with yen
        ('\U0001f5c2', ''),   # card index dividers
        # Keep these as proper unicode
        ('\u2192', '->'),     # -> arrow
        ('\u2190', '<-'),     # <- arrow
        ('\u2022', '*'),      # bullet
        ('\u25b2', '^'),      # up triangle
        ('\u25bc', 'v'),      # down triangle
        ('\u25cf', 'o'),      # filled circle
        ('\u25cb', 'o'),      # open circle
        ('\u00b7', '.'),      # middle dot
        ('\u2014', '-'),      # em dash
        ('\u2026', '...'),    # ellipsis
        ('\u201c', '"'),      # left quote
        ('\u201d', '"'),      # right quote
        ('\u2018', "'"),      # left single
        ('\u2019', "'"),      # right single
    ]
    for old, new in replacements:
        text = text.replace(old, new)
    
    # Remove any remaining non-BMP chars (emoji range U+1F000+)
    text = re.sub(r'[\U00010000-\U0010ffff]', '', text)
    
    if text != orig:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(text)
        print("FIXED:", path)
    else:
        print("OK:   ", path)

print("Done")