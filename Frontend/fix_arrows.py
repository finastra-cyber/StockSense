import os, re

FILES = [
    'src/features/markets/Markets.jsx',
    'src/features/transactions/Transactions.jsx',
    'src/features/dashboard/Dashboard.jsx',
    'src/features/portfolio/Portfolio.jsx',
    'src/features/stocks/StockDetail.jsx',
    'src/features/trade/Trade.jsx',
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

for path in FILES:
    if not os.path.exists(path):
        continue
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    orig = text
    
    # Fix arrow text inside JSX content (between > and <)
    # Pattern: >-></  or  ><-< — these are broken arrow chars used as button text
    text = text.replace('><-</button>', '>&larr;</button>')
    text = text.replace('><-</span>', '>&larr;</span>')
    text = text.replace('><-</a>', '>&larr;</a>')
    text = text.replace('>-></button>', '>&rarr;</button>')
    text = text.replace('>-></span>', '>&rarr;</span>')
    text = text.replace('>-></a>', '>&rarr;</a>')
    # Also fix as JSX string literals
    text = text.replace("'<-'", "'←'")
    text = text.replace("'->'", "'→'")
    # Fix link text "View all ->"
    text = re.sub(r'>View all -><', '>View all &rarr;<', text)
    text = re.sub(r'>See all -><', '>See all &rarr;<', text)
    text = re.sub(r'>Full analysis -><', '>Full analysis &rarr;<', text)
    text = re.sub(r'>Open full order ticket -><', '>Open full order ticket &rarr;<', text)
    text = re.sub(r'>View all transactions -><', '>View all transactions &rarr;<', text)
    # Fix text arrow in strings
    text = re.sub(r"'View all ->'\s*", "'View all \u2192'", text)
    # Fix Pagination prev/next buttons
    text = re.sub(r'className="btn btn--sm"><-</button>', 'className="btn btn--sm">\u2190</button>', text)
    text = re.sub(r'className="btn btn--sm">-></button>', 'className="btn btn--sm">\u2192</button>', text)
    
    if text != orig:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(text)
        print('FIXED:', path)
    else:
        print('OK:   ', path)
print('Done')