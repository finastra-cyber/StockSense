import os, re

fixes = {
    'src/features/insights/Insights.jsx': [
        ('Sort: Confidence -></option>', 'Sort: Confidence &#8594;</option>'),
        ('Sort: Symbol A-Z</option>', 'Sort: Symbol A-Z</option>'),
    ],
    'src/features/learn/Learn.jsx': [
        ('Take the quiz ->', 'Take the quiz \u2192'),
    ],
    'src/features/trade/Trade.jsx': [
        ('View all transactions ->', 'View all transactions \u2192'),
    ],
    'src/features/dashboard/Dashboard.jsx': [
        ('>View all ->^', ''),  # handled differently
    ],
    'src/features/stocks/StockDetail.jsx': [
        ('Full analysis ->', 'Full analysis \u2192'),
    ],
    'src/features/watchlist/Watchlist.jsx': [
        ('Trade ->', 'Trade \u2192'),
    ],
}

# Generic fix: replace -> inside JSX text nodes with unicode arrow
arrow_files = [
    'src/features/insights/Insights.jsx',
    'src/features/learn/Learn.jsx',
    'src/features/trade/Trade.jsx',
    'src/features/dashboard/Dashboard.jsx',
    'src/features/stocks/StockDetail.jsx',
    'src/features/watchlist/Watchlist.jsx',
    'src/features/news/News.jsx',
    'src/features/portfolio/Portfolio.jsx',
    'src/features/markets/Markets.jsx',
    'src/features/transactions/Transactions.jsx',
    'src/features/settings/Settings.jsx',
    'src/components/layout/AppLayout.jsx',
    'src/components/trading/QuickTradeModal.jsx',
]

for path in arrow_files:
    if not os.path.exists(path):
        continue
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    orig = text
    
    # Replace -> inside JSX text (between > and <, or in string literals that end up as text)
    # Pattern: text content ending with -> before closing tag
    text = re.sub(r'(\s)(->)(\s*</)', lambda m: m.group(1) + '\u2192' + m.group(3), text)
    text = re.sub(r'(>\s*)(->\s*<)', lambda m: m.group(1).rstrip() + ' \u2192\n  ' + '<', text)
    # Direct replacements for common patterns
    text = text.replace(' ->\n', ' \u2192\n')
    text = text.replace('->&#8203;', '\u2192')
    # Fix option tags
    text = text.replace('Confidence -></option>', 'Confidence \u2193</option>')
    text = text.replace('Sort: Confidence ->', 'Sort: Confidence \u2193')
    
    if text != orig:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(text)
        print('FIXED:', path)
    else:
        print('OK:   ', path)
print('Done')