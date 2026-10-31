import os, re

FILES = [
    'src/features/dashboard/Dashboard.jsx',
    'src/features/portfolio/Portfolio.jsx',
    'src/features/markets/Markets.jsx',
    'src/features/stocks/StockDetail.jsx',
    'src/features/trade/Trade.jsx',
    'src/features/transactions/Transactions.jsx',
    'src/features/watchlist/Watchlist.jsx',
    'src/features/news/News.jsx',
    'src/features/insights/Insights.jsx',
    'src/features/learn/Learn.jsx',
    'src/features/settings/Settings.jsx',
    'src/pages/Home.jsx',
    'src/components/layout/AppLayout.jsx',
    'src/components/trading/QuickTradeModal.jsx',
    'src/components/layout/GlobalSearch.jsx',
    'src/components/layout/CommandPalette.jsx',
]

def clean(text):
    # Remove ALL non-ASCII characters except rupee sign and a safe whitelist
    result = []
    i = 0
    while i < len(text):
        c = text[i]
        cp = ord(c)
        # Pure ASCII - always keep
        if cp < 128:
            result.append(c)
        # Rupee sign - keep
        elif cp == 0x20B9:
            result.append(c)
        # Common safe latin extended
        elif cp in (0x00B7,):  # middle dot
            result.append('.')
        # Everything else - drop it
        else:
            pass
        i += 1
    return ''.join(result)

for path in FILES:
    if not os.path.exists(path):
        continue
    with open(path, 'r', encoding='utf-8', errors='replace') as f:
        text = f.read()
    orig = text

    # Step 1: Fix specific known broken sequences before nuclear clean
    # These appear as 'View all ->' link text broken into mojibake
    text = re.sub(r'View all [^\w<\s]{1,5}', 'View all ->', text)
    text = re.sub(r'See all [^\w<\s]{1,5}', 'See all ->', text)
    text = re.sub(r'Full analysis [^\w<\s]{1,5}', 'Full analysis ->', text)
    text = re.sub(r'View all transactions [^\w<\s]{1,5}', 'View all transactions ->', text)
    text = re.sub(r'Open full order ticket [^\w<\s]{1,5}', 'Open full order ticket ->', text)
    
    # Step 2: Fix greeting emoji - appears as broken chars after name
    text = re.sub(r'\{name\.split\(.*?\)\[0\]\}\s*[^\w\s{}<\'"]{1,6}', '{name.split(\' \')[0]}', text)
    text = re.sub(r"name\.split\(' '\)\[0\]\}\s+[^\w\s{}<\'\"]{1,8}", "name.split(' ')[0]}", text)

    # Step 3: Fix market status dots  
    text = re.sub(r"'[^\w\s']{1,4} Market Open'", "'Market Open'", text)
    text = re.sub(r"'[^\w\s']{1,4} Market Closed'", "'Market Closed'", text)
    text = re.sub(r"Market Open : 'Market Closed'", "Market Open' : 'Market Closed'", text)

    # Step 4: Fix middle dot separators
    text = re.sub(r"\{' [^\w\s]{1,4} '\}", "{ ' · ' }", text)
    text = re.sub(r"'\s*[^\w\s']{1,4}\s*'(?=\s*\})", "' · '", text)

    # Step 5: Fix ellipsis
    text = re.sub(r'[^\w\s<>{}\(\)\[\]\'";:,\.\!\?=\+\-\*\/\$\#\@\&\|\^~%]{3,}(?=\.\.\.)', '', text)
    text = text.replace('\u2026', '...')

    # Step 6: Fix arrow links in JSX text nodes
    text = re.sub(r'(\s)([\u0080-\uffff]+)(\s*</(?:Link|a|button|span))', 
                  lambda m: m.group(1) + '->' + m.group(3), text)

    # Step 7: Nuclear - remove any remaining non-ASCII non-rupee chars
    cleaned = []
    for ch in text:
        cp = ord(ch)
        if cp < 128 or cp == 0x20B9:
            cleaned.append(ch)
        # else: drop
    text = ''.join(cleaned)

    if text != orig:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(text)
        print('FIXED:', path)
    else:
        print('OK:   ', path)

print('Done')