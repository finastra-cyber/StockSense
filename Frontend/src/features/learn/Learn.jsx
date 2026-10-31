import { useState } from 'react'

import { motion, AnimatePresence } from 'framer-motion'

import { useDocTitle } from '../../hooks/useDocTitle.js'

import { CheckCircle2, ChevronRight, X } from 'lucide-react'



const LESSONS = [

  {

    id: 'paper-trading',

    title: 'What is Paper Trading?',

    icon: '',

    tag: 'Basics',

    body: `Paper trading is the practice of simulating real trades without using actual money. You place virtual buy/sell orders at real market prices, track your portfolio performance, and learn from your decisions - all with zero financial risk.\n\nFinAstra gives you ₹10,00,000 in virtual capital. Every trade you make is recorded, and your portfolio updates in real-time, just like it would in a real brokerage account.`,

    formula: null,

    demo: 'portfolio',

    quiz: [

      { q: 'What is the main benefit of paper trading?', options: ['Higher returns', 'Zero financial risk', 'Faster execution', 'Lower taxes'], ans: 1 },

      { q: 'FinAstra gives you how much virtual capital?', options: ['₹1,00,000', '₹5,00,000', '₹10,00,000', '₹50,00,000'], ans: 2 },

      { q: 'Does paper trading use real money?', options: ['Yes, always', 'Sometimes', 'No, never', 'Depends on the broker'], ans: 2 },

    ],

  },

  {

    id: 'sma',

    title: 'Simple Moving Average (SMA)',

    icon: '',

    tag: 'Indicator',

    body: `The Simple Moving Average smooths out price data by creating a constantly updated average price over a specific period. It helps you see the overall trend direction by filtering out short-term noise.\n\nA 20-day SMA averages the closing prices of the last 20 trading days. When price is above the SMA, it's generally bullish. When below, bearish.\n\nA common strategy is the "Golden Cross" (SMA50 crosses above SMA200 - bullish) and "Death Cross" (SMA50 crosses below SMA200 - bearish).`,

    formula: 'SMA(n) = (P + P + ... + P) / n',

    demo: 'sma',

    quiz: [

      { q: 'What does SMA stand for?', options: ['Stock Market Average', 'Simple Moving Average', 'Smoothed Market Analyzer', 'Signal Momentum Amplitude'], ans: 1 },

      { q: 'A 20-day SMA averages how many days?', options: ['5', '10', '20', '50'], ans: 2 },

      { q: 'Price crossing above the SMA generally signals?', options: ['Bearish trend', 'Bullish trend', 'Neutral', 'High volatility'], ans: 1 },

    ],

  },

  {

    id: 'ema',

    title: 'Exponential Moving Average (EMA)',

    icon: '',

    tag: 'Indicator',

    body: `The Exponential Moving Average is similar to the SMA but gives more weight to recent prices, making it more responsive to new information. This makes it better at catching trend changes earlier.\n\nThe EMA uses a multiplier k = 2/(n+1), so recent prices have more impact. The EMA(12) and EMA(26) are commonly used as inputs for the MACD indicator.\n\nWhen EMA(12) crosses above EMA(26) it's called a bullish crossover. The reverse is bearish.`,

    formula: 'EMA(today) = Price  k + EMA(yesterday)  (1k)    where k = 2/(n+1)',

    demo: 'ema',

    quiz: [

      { q: 'How does EMA differ from SMA?', options: ['EMA uses more data', 'EMA weights recent prices more', 'EMA is slower', 'EMA uses high prices'], ans: 1 },

      { q: 'For a 12-day EMA, what is the multiplier k?', options: ['2/11', '2/12', '2/13', '2/14'], ans: 2 },

      { q: 'EMA(12) crossing above EMA(26) signals?', options: ['Sell', 'Bullish crossover', 'Bearish crossover', 'Volume spike'], ans: 1 },

    ],

  },

  {

    id: 'rsi',

    title: 'Relative Strength Index (RSI)',

    icon: '',

    tag: 'Indicator',

    body: `RSI is a momentum oscillator that measures the speed and magnitude of recent price changes. It ranges from 0 to 100.\n\n* RSI > 70: Overbought - price may be due for a pullback\n* RSI < 30: Oversold - price may bounce upward\n* RSI between 30-70: Neutral zone\n\nRSI uses Wilder's smoothing method. Average gains and losses over 14 periods are used to compute a Relative Strength ratio, which is then converted to the 0-100 scale.`,

    formula: 'RSI = 100  100/(1 + RS)    RS = Avg Gain / Avg Loss (14-period)',

    demo: 'rsi',

    quiz: [

      { q: 'RSI above 70 typically means?', options: ['Oversold', 'Overbought', 'Neutral', 'Trending'], ans: 1 },

      { q: 'The standard RSI period is?', options: ['7', '10', '14', '20'], ans: 2 },

      { q: 'RSI below 30 suggests?', options: ['Overbought', 'Strong trend', 'Oversold - potential bounce', 'High volume'], ans: 2 },

    ],

  },

  {

    id: 'macd',

    title: 'MACD - Moving Average Convergence/Divergence',

    icon: '',

    tag: 'Indicator',

    body: `MACD is a trend-following momentum indicator showing the relationship between two EMAs.\n\n* MACD Line = EMA(12)  EMA(26)\n* Signal Line = EMA(9) of MACD Line\n* Histogram = MACD Line  Signal Line\n\nKey signals:\n* MACD crosses above Signal -> Bullish (potential buy)\n* MACD crosses below Signal -> Bearish (potential sell)\n* Histogram growing positive -> Strengthening uptrend\n* Divergence (price vs MACD) -> Potential reversal`,

    formula: 'MACD = EMA(12)  EMA(26)    Signal = EMA(9) of MACD    Histogram = MACD  Signal',

    demo: 'macd',

    quiz: [

      { q: 'MACD is calculated as?', options: ['SMA(12)  SMA(26)', 'EMA(12)  EMA(26)', 'EMA(26)  EMA(12)', 'RSI(12)  RSI(26)'], ans: 1 },

      { q: 'What is the Signal Line?', options: ['EMA(12) of price', 'EMA(9) of MACD', 'SMA(9) of MACD', 'RSI(14)'], ans: 1 },

      { q: 'MACD crossing above the Signal Line suggests?', options: ['Sell signal', 'Bullish momentum', 'Bearish divergence', 'Overbought'], ans: 1 },

    ],

  },

  {

    id: 'candles',

    title: 'Reading Candlestick Charts',

    icon: '',

    tag: 'Basics',

    body: `Candlestick charts show four prices for each time period: Open, High, Low, Close (OHLC).\n\n* The "body" shows the range between open and close.\n* A green/white candle: close > open (price went up)\n* A red/black candle: close < open (price went down)\n* The "wicks" (shadows) show the high and low extremes\n\nCommon patterns:\n* Doji: open  close, shows indecision\n* Hammer: small body, long lower wick - potential reversal\n* Engulfing: body completely covers previous candle - strong signal`,

    formula: 'Body = |Close  Open|    Upper wick = High  max(Open,Close)    Lower wick = min(Open,Close)  Low',

    demo: 'candle',

    quiz: [

      { q: 'A green candlestick means?', options: ['Close < Open', 'High > Low', 'Close > Open', 'Volume increased'], ans: 2 },

      { q: 'The "wick" on a candle shows?', options: ['Average price', 'Volume', 'High/Low extremes', 'Opening gap'], ans: 2 },

      { q: 'A Doji candle suggests?', options: ['Strong uptrend', 'Market indecision', 'Guaranteed reversal', 'High volume'], ans: 1 },

    ],

  },

  {

    id: 'sentiment',

    title: 'What is Sentiment Analysis?',

    icon: '',

    tag: 'AI',

    body: `Sentiment analysis uses Natural Language Processing (NLP) to determine whether a piece of text expresses a positive, neutral, or negative opinion.\n\nFinAstra uses FinBERT - a BERT model fine-tuned on financial text - to classify news headlines. Each headline gets a score from 1 (very negative) to +1 (very positive).\n\nThis score becomes one feature in the AI model alongside technical indicators. The idea: negative news (earnings miss, regulatory action) often precedes price drops, while positive news (record profits, big deals) can precede rises.\n\nImportant: sentiment alone never triggers a trading signal. It's just one input.`,

    formula: 'Sentiment Score  [1, +1]    FinBERT: P(positive), P(neutral), P(negative) -> score = P(pos)  P(neg)',

    demo: 'sentiment',

    quiz: [

      { q: 'FinBERT is based on which model?', options: ['GPT-4', 'BERT', 'LSTM', 'Random Forest'], ans: 1 },

      { q: 'A FinBERT score of +0.8 means?', options: ['Strongly negative', 'Neutral', 'Strongly positive', 'No data'], ans: 2 },

      { q: 'In FinAstra, sentiment alone triggers a trade?', options: ['Yes, always', 'Only for BUY signals', 'No, it is one of several inputs', 'Only when RSI > 70'], ans: 2 },

    ],

  },

  {

    id: 'risk',

    title: 'Risk Management Basics',

    icon: '',

    tag: 'Basics',

    body: `Even with a perfect strategy, poor risk management can wipe out a portfolio. Key concepts:\n\n* Position sizing: Never put all capital in one trade. A common rule: risk no more than 1-2% of portfolio per trade.\n* Stop-loss: A predetermined price at which you exit a losing trade to limit losses.\n* Diversification: Spread across sectors and asset types to reduce correlated risk.\n* Sharpe Ratio: Return per unit of risk. Higher is better. Computed as: (Return  Risk-free rate) / Std Dev\n* Max Drawdown: Largest peak-to-trough drop. A lower drawdown means better capital preservation.\n\nPaper trading is the perfect place to test these strategies risk-free before using real money.`,

    formula: 'Sharpe Ratio = (Rp  Rf) / p    Max Drawdown = (Peak  Trough) / Peak  100%',

    demo: null,

    quiz: [

      { q: 'What is a stop-loss?', options: ['Maximum profit target', 'Pre-set exit to limit losses', 'A type of order for gains', 'The closing price'], ans: 1 },

      { q: 'A higher Sharpe Ratio means?', options: ['More risk', 'Lower returns', 'Better risk-adjusted return', 'Higher volatility'], ans: 2 },

      { q: 'Max Drawdown measures?', options: ['Average daily loss', 'Total loss in a year', 'Largest peak-to-trough decline', 'Number of losing trades'], ans: 2 },

    ],

  },

]



//  RSI Interactive demo 

function RSIDemo() {

  const [rsi, setRsi] = useState(55)

  const zone   = rsi > 70 ? { label: 'Overbought', color: '#F43F5E' } : rsi < 30 ? { label: 'Oversold', color: '#10B981' } : { label: 'Neutral', color: '#F59E0B' }

  return (

    <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        <span style={{ fontSize: '.8rem', color: 'var(--tx-2)' }}>Drag to simulate RSI value</span>

        <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: zone.color, fontSize: '1rem' }}>RSI: {rsi}</span>

      </div>

      <input type="range" min={0} max={100} value={rsi} onChange={e => setRsi(+e.target.value)}

        style={{ width: '100%', accentColor: zone.color }} />

      <div style={{

        height: 4, borderRadius: 2, background: 'linear-gradient(90deg,#10B981 30%,#F59E0B 30%,#F59E0B 70%,#F43F5E 70%)',

        position: 'relative', overflow: 'visible',

      }}>

        <div style={{ position: 'absolute', left: `${rsi}%`, top: -4, width: 12, height: 12, borderRadius: '50%', background: zone.color, border: '2px solid #fff', transform: 'translateX(-50%)' }} />

      </div>

      <div style={{

        background: zone.color + '22', border: `1px solid ${zone.color}44`,

        borderRadius: 'var(--r)', padding: '.65rem 1rem', textAlign: 'center',

        fontSize: '.85rem', fontWeight: 700, color: zone.color,

      }}>

        {zone.label} {rsi > 70 ? '- Consider selling or waiting for pullback' : rsi < 30 ? '- Consider buying, potential bounce ahead' : '- No strong signal, wait for clearer direction'}

      </div>

    </div>

  )

}



//  Quiz 

function Quiz({ questions }) {

  const [answers, setAnswers] = useState({})

  const [submitted, setSubmit] = useState(false)

  const score = submitted ? questions.filter((q, i) => answers[i] === q.ans).length : 0



  return (

    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {questions.map((q, qi) => (

        <div key={qi}>

          <div style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--tx)', marginBottom: '.5rem' }}>{qi + 1}. {q.q}</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

            {q.options.map((opt, oi) => {

              const chosen  = answers[qi] === oi

              const correct = submitted && oi === q.ans

              const wrong   = submitted && chosen && oi !== q.ans

              return (

                <button key={oi}

                  onClick={() => !submitted && setAnswers(a => ({ ...a, [qi]: oi }))}

                  style={{

                    padding: '.5rem .85rem', border: '1px solid', borderRadius: 'var(--r)', textAlign: 'left', cursor: submitted ? 'default' : 'pointer',

                    fontSize: '.82rem', background: correct ? 'var(--up-bg)' : wrong ? 'var(--down-bg)' : chosen ? 'var(--accent-bg)' : 'var(--card-hi)',

                    color: correct ? 'var(--up)' : wrong ? 'var(--down)' : chosen ? 'var(--accent)' : 'var(--tx-2)',

                    borderColor: correct ? 'rgba(16,185,129,.3)' : wrong ? 'rgba(244,63,94,.3)' : chosen ? 'var(--accent-ring)' : 'var(--border)',

                    transition: 'all .15s',

                  }}

                >{opt} {correct ? '' : wrong ? '' : ''}</button>

              )

            })}

          </div>

        </div>

      ))}

      {!submitted ? (

        <button className="btn btn--primary btn--sm" onClick={() => setSubmit(true)} disabled={Object.keys(answers).length < questions.length} style={{ alignSelf: 'flex-start' }}>Submit</button>

      ) : (

        <div style={{ background: score === questions.length ? 'var(--up-bg)' : 'var(--gold-bg)', border: `1px solid ${score === questions.length ? 'rgba(16,185,129,.3)' : 'rgba(245,158,11,.3)'}`, borderRadius: 'var(--r)', padding: '.75rem 1rem', fontSize: '.85rem', fontWeight: 700, color: score === questions.length ? 'var(--up)' : 'var(--gold)' }}>

          {score === questions.length ? ' Perfect score!' : `${score}/${questions.length} correct - review the lesson and try again`}

        </div>

      )}

    </div>

  )

}



//  Lesson modal 

function LessonModal({ lesson, onClose, onComplete }) {

  const [tab, setTab] = useState('learn')

  return (

    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '5vh', padding: '3vh 1rem' }}>

      <motion.div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(4px)' }} onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />

      <motion.div

        initial={{ opacity: 0, y: 16, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }}

        style={{ position: 'relative', zIndex: 1, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', width: '100%', maxWidth: 660, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}

      >

        {/* Header */}

        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-lo)', display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>

          <span style={{ fontSize: '1.5rem' }}>{lesson.icon}</span>

          <div style={{ flex: 1 }}>

            <div style={{ fontWeight: 700, color: 'var(--tx)', fontSize: '1rem' }}>{lesson.title}</div>

            <div style={{ fontSize: '.7rem', color: 'var(--tx-3)' }}>{lesson.tag}</div>

          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--tx-3)', cursor: 'pointer', padding: 4, display: 'flex', borderRadius: 6 }} aria-label="Close lesson">

            <X size={18} />

          </button>

        </div>



        {/* Tabs */}

        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-lo)', flexShrink: 0 }}>

          {[['learn',' Learn'],['quiz',' Quiz']].map(([t, lbl]) => (

            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '.65rem', border: 'none', background: 'transparent', color: tab === t ? 'var(--accent)' : 'var(--tx-3)', fontWeight: tab === t ? 700 : 500, fontSize: '.85rem', cursor: 'pointer', borderBottom: `2px solid ${tab === t ? 'var(--accent)' : 'transparent'}` }}>{lbl}</button>

          ))}

        </div>



        {/* Content */}

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {tab === 'learn' ? (

            <>

              <div style={{ fontSize: '.875rem', color: 'var(--tx-2)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>{lesson.body}</div>

              {lesson.formula && (

                <div style={{ background: 'var(--card-hi)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '.85rem 1.1rem', fontFamily: 'var(--mono)', fontSize: '.82rem', color: '#a5b4fc', lineHeight: 1.7 }}>

                  {lesson.formula}

                </div>

              )}

              {lesson.demo === 'rsi' && (

                <div style={{ background: 'var(--card-hi)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '1rem' }}>

                  <div style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--tx)', marginBottom: '.75rem' }}>Interactive Demo</div>

                  <RSIDemo />

                </div>

              )}

              <button className="btn btn--primary btn--sm" onClick={() => { onComplete(lesson.id); setTab('quiz') }} style={{ alignSelf: 'flex-start' }}>

                Take the quiz

              </button>

            </>

          ) : (

            <Quiz questions={lesson.quiz} />

          )}

        </div>

      </motion.div>

    </div>

  )

}



export default function Learn() {

  useDocTitle('Learn Hub')

  const [completed, setCompleted] = useState(() => {

    try { return JSON.parse(localStorage.getItem('fin_lessons') || '[]') } catch { return [] }

  })

  const [active, setActive] = useState(null)

  const [filter, setFilter] = useState('All')



  function markComplete(id) {

    if (completed.includes(id)) return

    const next = [...completed, id]

    setCompleted(next)

    localStorage.setItem('fin_lessons', JSON.stringify(next))

  }



  const tags = ['All', 'Basics', 'Indicator', 'AI']

  const filtered = filter === 'All' ? LESSONS : LESSONS.filter(l => l.tag === filter)



  return (

    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      <div className="page-header">

        <div>

          <h1 className="page-header__title">Learn Hub</h1>

          <p className="page-header__sub">Master the concepts behind FinAstra's analysis tools</p>

        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>

          <div style={{ height: 6, width: 120, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>

            <div style={{ height: '100%', background: 'var(--accent)', borderRadius: 3, width: `${(completed.length / LESSONS.length) * 100}%`, transition: 'width .3s' }} />

          </div>

          <span style={{ fontSize: '.75rem', color: 'var(--tx-3)' }}>{completed.length}/{LESSONS.length}</span>

        </div>

      </div>



      {/* Filters */}

      <div style={{ display: 'flex', gap: 4 }}>

        {tags.map(t => (

          <button key={t} onClick={() => setFilter(t)}

            style={{

              padding: '.28rem .75rem', border: 'none', borderRadius: 20, fontSize: '.75rem', fontWeight: 600, cursor: 'pointer',

              background: filter === t ? 'var(--accent)' : 'var(--card-hi)',

              color: filter === t ? '#fff' : 'var(--tx-3)',

              transition: 'all .14s',

            }}

          >{t}</button>

        ))}

      </div>



      {/* Lesson cards */}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>

        {filtered.map((lesson, i) => {

          const done = completed.includes(lesson.id)

          return (

            <motion.div

              key={lesson.id}

              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}

              transition={{ delay: i * 0.04 }}

              onClick={() => setActive(lesson)}

              style={{

                background: 'var(--card)', border: `1px solid ${done ? 'rgba(16,185,129,.3)' : 'var(--border)'}`,

                borderRadius: 'var(--r-lg)', padding: '1.25rem', cursor: 'pointer',

                display: 'flex', flexDirection: 'column', gap: '.75rem',

                transition: 'border-color .18s, transform .18s, box-shadow .18s',

              }}

              whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,.2)' }}

            >

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>

                <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>{lesson.icon}</span>

                {done && <CheckCircle2 size={16} style={{ color: 'var(--up)', flexShrink: 0 }} aria-label="Completed" />}

              </div>

              <div>

                <div style={{ fontWeight: 700, color: 'var(--tx)', fontSize: '.9rem', marginBottom: 3 }}>{lesson.title}</div>

                <div style={{ fontSize: '.7rem', color: 'var(--tx-3)' }}>{lesson.tag}</div>

              </div>

              <div style={{ fontSize: '.78rem', color: 'var(--tx-2)', lineHeight: 1.5 }}>

                {lesson.body.slice(0, 80)}...

              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>

                <span style={{ fontSize: '.72rem', color: done ? 'var(--up)' : 'var(--accent)' }}>

                  {done ? ' Completed' : 'Start lesson'}

                </span>

                <ChevronRight size={14} style={{ color: 'var(--tx-3)' }} aria-hidden="true" />

              </div>

            </motion.div>

          )

        })}

      </div>



      {/* Lesson modal */}

      <AnimatePresence>

        {active && (

          <LessonModal lesson={active} onClose={() => setActive(null)} onComplete={markComplete} />

        )}

      </AnimatePresence>

    </div>

  )

}

