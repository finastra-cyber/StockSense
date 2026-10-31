/**
 * Mock news articles with FinBERT-style sentiment labels/scores
 */

export const NEWS_ARTICLES = [
  {
    id: 1, symbol: 'RELIANCE', company: 'Reliance Industries',
    headline: 'Reliance Industries posts record Q3 profit, beats analyst estimates by 12%',
    source: 'Economic Times', publishedAt: Date.now() - 1 * 3600000,
    label: 'positive', score: 0.87,
    url: '#', summary: 'RIL reported consolidated net profit of ₹21,930 crore for Q3 FY26, beating the street estimate of ₹19,500 crore by a wide margin, driven by strong Jio and retail performance.',
  },
  {
    id: 2, symbol: 'TCS', company: 'TCS',
    headline: 'TCS wins $1.5 billion BSNL deal; largest IT contract in Indian history',
    source: 'Business Standard', publishedAt: Date.now() - 3 * 3600000,
    label: 'positive', score: 0.92,
    url: '#', summary: 'Tata Consultancy Services has secured a landmark ₹12,400 crore contract from BSNL to set up a 4G/5G network across India.',
  },
  {
    id: 3, symbol: 'INFY', company: 'Infosys',
    headline: 'Infosys cuts revenue guidance citing deal ramp-down delays in Europe',
    source: 'LiveMint', publishedAt: Date.now() - 5 * 3600000,
    label: 'negative', score: -0.74,
    url: '#', summary: 'Infosys revised its FY26 revenue growth guidance to 3.5-4.5% in constant currency, down from 4-7%, citing delayed ramp-ups in discretionary spending from European clients.',
  },
  {
    id: 4, symbol: 'HDFCBANK', company: 'HDFC Bank',
    headline: 'HDFC Bank loan growth moderates to 7.5% YoY in Q3 as credit tightens',
    source: 'Reuters India', publishedAt: Date.now() - 8 * 3600000,
    label: 'neutral', score: -0.12,
    url: '#', summary: 'HDFC Bank reported loan book growth of 7.5% year-on-year, lower than the 12% seen in prior quarters, reflecting RBI\'s tighter liquidity conditions.',
  },
  {
    id: 5, symbol: 'SBIN', company: 'SBI',
    headline: 'SBI approves ₹25,000 crore capital raise via QIP to boost tier-1 capital',
    source: 'NDTV Profit', publishedAt: Date.now() - 10 * 3600000,
    label: 'positive', score: 0.65,
    url: '#', summary: 'State Bank of India\'s board approved raising ₹25,000 crore via Qualified Institutional Placement, which analysts say will strengthen its capital adequacy ratio.',
  },
  {
    id: 6, symbol: 'TATAMOTORS', company: 'Tata Motors',
    headline: 'Tata Motors EV sales up 38% in November; Nexon EV crosses 1 lakh cumulative mark',
    source: 'Autocar India', publishedAt: Date.now() - 14 * 3600000,
    label: 'positive', score: 0.78,
    url: '#', summary: 'Tata Motors reported electric vehicle retail sales of 7,456 units in November, a 38% YoY jump, with the Nexon EV becoming the first Indian EV to cross 1 lakh cumulative sales.',
  },
  {
    id: 7, symbol: 'BHARTIARTL', company: 'Bharti Airtel',
    headline: 'Airtel to invest ₹3,200 crore in submarine cable network for global connectivity',
    source: 'Financial Express', publishedAt: Date.now() - 18 * 3600000,
    label: 'positive', score: 0.71,
    url: '#', summary: 'Bharti Airtel announced a ₹3,200 crore investment in a new submarine cable network connecting India to Europe and Southeast Asia to boost enterprise connectivity.',
  },
  {
    id: 8, symbol: 'ITC', company: 'ITC',
    headline: "ITC's cigarette volumes decline 2% amid tax hike concerns, FMCG offsets dip",
    source: 'Economic Times', publishedAt: Date.now() - 22 * 3600000,
    label: 'neutral', score: -0.18,
    url: '#', summary: 'ITC reported a 2% decline in cigarette volumes in Q3, but its FMCG business maintained double-digit growth, keeping the overall revenue trajectory stable.',
  },
  {
    id: 9, symbol: 'WIPRO', company: 'Wipro',
    headline: 'Wipro accelerates AI practice hiring; adds 5,000 GenAI specialists in Q3',
    source: 'Hindustan Times Tech', publishedAt: Date.now() - 26 * 3600000,
    label: 'positive', score: 0.59,
    url: '#', summary: 'Wipro has hired over 5,000 generative AI specialists in Q3 as part of its strategy to embed AI capabilities across all its service verticals.',
  },
  {
    id: 10, symbol: 'SUNPHARMA', company: 'Sun Pharma',
    headline: "Sun Pharma's specialty drugs revenue surges 22% in US market",
    source: 'Pharma Biz', publishedAt: Date.now() - 30 * 3600000,
    label: 'positive', score: 0.83,
    url: '#', summary: 'Sun Pharmaceutical Industries reported a 22% year-on-year growth in its US specialty drug revenue, driven by its dermatology and ophthalmology portfolio.',
  },
  {
    id: 11, symbol: 'LT', company: 'Larsen & Toubro',
    headline: 'L&T secures massive ₹18,000 crore infrastructure order in Middle East',
    source: 'Construction Week', publishedAt: Date.now() - 34 * 3600000,
    label: 'positive', score: 0.88,
    url: '#', summary: 'Larsen & Toubro announced a ₹18,000 crore order win for infrastructure development in Saudi Arabia, bolstering its international order book.',
  },
  {
    id: 12, symbol: 'AXISBANK', company: 'Axis Bank',
    headline: 'Axis Bank gross NPA ratio rises to 1.76% amid rising retail stress',
    source: 'Mint', publishedAt: Date.now() - 40 * 3600000,
    label: 'negative', score: -0.66,
    url: '#', summary: 'Axis Bank\'s gross non-performing asset ratio increased to 1.76% in Q3 from 1.54% in Q2, reflecting early stress in its unsecured retail loan book.',
  },
  {
    id: 13, symbol: 'MARUTI', company: 'Maruti Suzuki',
    headline: 'Maruti Suzuki retains #1 position with 43% market share in November',
    source: 'Society of Indian Automobile Manufacturers', publishedAt: Date.now() - 48 * 3600000,
    label: 'positive', score: 0.61,
    url: '#', summary: 'Maruti Suzuki India retained its dominant market position with 43.1% market share in November, selling 1,56,721 vehicles across its product lineup.',
  },
  {
    id: 14, symbol: 'BAJFINANCE', company: 'Bajaj Finance',
    headline: 'RBI lifts restrictions on Bajaj Finance after compliance review',
    source: 'CNBC TV18', publishedAt: Date.now() - 56 * 3600000,
    label: 'positive', score: 0.79,
    url: '#', summary: 'The Reserve Bank of India lifted the ban on Bajaj Finance\'s eCOM and Insta EMI Card lending products after the NBFC demonstrated compliance with digital lending guidelines.',
  },
  {
    id: 15, symbol: 'ONGC', company: 'ONGC',
    headline: 'ONGC crude output falls 4.2% as ageing wells drag production',
    source: 'Oil Price India', publishedAt: Date.now() - 64 * 3600000,
    label: 'negative', score: -0.55,
    url: '#', summary: 'Oil and Natural Gas Corporation reported a 4.2% decline in crude oil output for the April-November period due to natural decline in ageing fields.',
  },
  {
    id: 16, symbol: 'HCLTECH', company: 'HCL Technologies',
    headline: 'HCLTech to open 3 new delivery centers, adds 12,000 jobs by FY27',
    source: 'Times of India', publishedAt: Date.now() - 72 * 3600000,
    label: 'positive', score: 0.68,
    url: '#', summary: 'HCL Technologies announced plans to open three new delivery centres in Tier-2 cities and hire 12,000 employees by FY2027 to support growing demand.',
  },
]

/** Get news filtered by optional symbol */
export function getNews(symbol = null) {
  if (!symbol) return NEWS_ARTICLES
  return NEWS_ARTICLES.filter(n => n.symbol === symbol?.toUpperCase())
}

/** Get sentiment summary for a set of articles */
export function getSentimentSummary(articles) {
  const scores = articles.map(a => a.score)
  const mean = scores.length ? scores.reduce((s, v) => s + v, 0) / scores.length : 0
  const positive = articles.filter(a => a.label === 'positive').length
  const neutral  = articles.filter(a => a.label === 'neutral').length
  const negative = articles.filter(a => a.label === 'negative').length
  return { mean: +mean.toFixed(3), positive, neutral, negative, total: articles.length }
}
