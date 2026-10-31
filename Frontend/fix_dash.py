import re

path = 'src/features/dashboard/Dashboard.jsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

orig = text

# Fix 1: greeting line - remove broken char after name
text = re.sub(
    r"\{name\.split\(' '\)\[0\]\}\s*'[^']*'",
    "{name.split(' ')[0]}",
    text
)

# Fix 2: Market status dots - replace broken dash+space with bullet
text = text.replace("'- Market Open'", "'Market Open'")
text = text.replace("'-  Market Closed'", "'Market Closed'")
text = text.replace("'- Market Closed'", "'Market Closed'")

# Fix 3: View all links - replace 'View all  '' or 'View all ->' garbage
text = re.sub(r"View all\s+['\s->]+</Link>", "View all ->", text)
text = re.sub(r">View all\s*[^\w<]{0,5}</Link>", ">View all</Link>", text)
text = re.sub(r">See all\s*[^\w<]{0,5}</Link>", ">See all</Link>", text)

# Fix 4: separator dot between date and market status
text = re.sub(r"\{' [^\w\s']{0,5} '\}", "{ ' \u00b7 ' }", text)
text = re.sub(r"'\s*[^\w\s']{1,4}\s*'(?=\s*[\}\)])", "' \u00b7 '", text)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print('Dashboard fixed')
print('Greeting:', [l for l in text.split('\n') if 'split' in l and 'name' in l][0].strip())
print('Market:', [l for l in text.split('\n') if 'Market Open' in l][0].strip())