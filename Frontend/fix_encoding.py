#!/usr/bin/env python3
"""Fix mojibake (corrupted UTF-8 read as Latin-1) in JSX files."""
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
    "src/components/layout/AppLayout.jsx",
    "src/components/layout/AppLayout.css",
    "src/index.css",
    "src/pages/Home.jsx",
    "src/pages/Login.jsx",
    "src/pages/Register.jsx",
    "src/pages/Auth.css",
]

# Map mojibake sequences → correct replacement
FIXES = [
    # Emojis — replace with safe plain alternatives
    ("ðŸ'‹", ""),          # wave
    ("ðŸ¤–", ""),          # robot
    ("ðŸ"Š", ""),          # chart
    ("ðŸ"°", ""),          # newspaper
    ("ðŸ›¡", ""),          # shield
    ("ðŸ"", ""),           # memo
    ("ðŸ"ˆ", ""),          # chart up
    ("ðŸ"‰", ""),          # chart down
    ("âš¡", ""),            # lightning
    ("ðŸ"€", ""),          # arrows
    ("ðŸ•¯", ""),          # candle
    ("ðŸ§®", ""),          # abacus
    ("ðŸ'¹", ""),          # chart decreasing
    ("ðŸ†˜", ""),          # SOS
    ("âœ…", ""),            # check
    ("âŒ", ""),             # cross
    ("ðŸŽ‰", ""),          # party
    ("ðŸŽ"", ""),          # graduation
    ("ðŸ"–", ""),          # book
    ("ðŸ"", ""),           # search
    ("ðŸ"ˆ", ""),          # chart up (dupe)
    ("â€¦", "..."),         # ellipsis
    ("â€"", "-"),           # em dash
    ("â€™", "'"),           # right single quote
    ("â€˜", "'"),           # left single quote
    ("â€œ", '"'),           # left double quote
    ("â€\x9d", '"'),        # right double quote
    ("Â·", " · "),         # middle dot
    ("Â ", " "),            # non-breaking space
    ("Â", ""),              # lone Â
    ("â— ", "●"),           # filled circle
    ("â—‹", "○"),           # open circle
    ("â–²", "▲"),           # up triangle
    ("â–¼", "▼"),           # down triangle
    ("\xe2\x86\x92", "→"), # arrow right (bytes)
    ("â†'", "→"),           # arrow right mojibake
    ("â†\x90", "←"),       # arrow left
    ("âœ"", "✓"),           # checkmark
    ("âœ•", "✕"),           # x mark
    ("â"€", "-"),           # box drawing dash
    ("ðŸ€", ""),            # catch-all for remaining ð sequences
    # Fix specific text patterns
    (" Â· ", " · "),
    ("' Â·'", "' ·'"),
]

def fix_file(path):
    if not os.path.exists(path):
        print(f"  SKIP (not found): {path}")
        return
    
    with open(path, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()
    
    original = content
    for bad, good in FIXES:
        content = content.replace(bad, good)
    
    # Also fix any remaining multi-byte mojibake: sequences starting with ð followed by garbled chars
    content = re.sub(r'ð[^\s<>{}\(\)\[\]\'",;:\.!?]*', '', content)
    # Fix remaining Â sequences
    content = re.sub(r'Â[^\w]', ' ', content)
    # Fix â sequences that weren't caught
    content = re.sub(r'â[^\w\s<>{}\(\)\[\]\'",;:\.!?→←●○▲▼✓✕·-]{0,3}', '', content)
    
    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  FIXED: {path}")
    else:
        print(f"  OK:    {path}")

for f in FILES:
    fix_file(f)

print("\nDone.")
