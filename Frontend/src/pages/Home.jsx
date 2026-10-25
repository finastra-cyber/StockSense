import { Link } from 'react-router-dom'
import './Home.css'

const MODULES = [
  {
    tag: 'MODULE / 01',
    title: 'Technical indicators',
    body: 'SMA, EMA, RSI and MACD calculated on live and historical price data, so you can read a chart the way an analyst does.',
  },
  {
    tag: 'MODULE / 02',
    title: 'News sentiment',
    body: 'FinBERT reads financial headlines and scores them positive, negative or neutral — context price charts alone leave out.',
  },
  {
    tag: 'MODULE / 03',
    title: 'Paper trading',
    body: 'Trade with virtual funds, build a portfolio and track profit and loss with zero real-money risk while you learn.',
  },
  {
    tag: 'MODULE / 04',
    title: 'Portfolio analytics',
    body: 'Holdings, transaction history and performance reports in one dashboard, so every decision has a paper trail.',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Analyze',
    body: 'Pull live and historical data on any stock, and let the engine compute indicators and sentiment side by side.',
  },
  {
    n: '02',
    title: 'Decide',
    body: 'Read an educational Buy, Sell or Hold signal built from technicals and news sentiment combined.',
  },
  {
    n: '03',
    title: 'Practice',
    body: 'Act on it with virtual funds. Watch how the call plays out without a rupee of real money on the line.',
  },
]

function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero__copy">
          <span className="eyebrow">AI-powered stock market analysis</span>
          <h1>
            Learn the market
            <br />
            before you risk it.
          </h1>
          <p>
            StockSense pairs technical indicators and AI news sentiment into one
            educational signal, then lets you act on it with a virtual portfolio —
            no real money, no real consequences, real practice.
          </p>
          <div className="hero__actions">
            <Link to="/register" className="btn btn--primary">
              Start paper trading
            </Link>
            <Link to="/login" className="btn">
              I have an account
            </Link>
          </div>
        </div>

        <aside className="signal-card" aria-label="Example analysis panel">
          <div className="signal-card__head">
            <span className="signal-card__sym">RELI</span>
            <span className="signal-card__price">
              ₹2,946.10 <em className="is-up">▲ 1.24%</em>
            </span>
          </div>
          <dl className="signal-card__grid">
            <div>
              <dt>SMA(50)</dt>
              <dd>2,881.40</dd>
            </div>
            <div>
              <dt>EMA(21)</dt>
              <dd>2,918.75</dd>
            </div>
            <div>
              <dt>RSI(14)</dt>
              <dd>61.2</dd>
            </div>
            <div>
              <dt>MACD</dt>
              <dd className="is-up">+8.4</dd>
            </div>
          </dl>
          <div className="signal-card__sentiment">
            <span>News sentiment (FinBERT)</span>
            <div className="sentiment-bar">
              <span className="sentiment-bar__fill" style={{ width: '72%' }} />
            </div>
            <span className="sentiment-bar__label">Positive · 72</span>
          </div>
          <div className="signal-card__verdict">
            <span>Educational signal</span>
            <strong>BUY</strong>
          </div>
        </aside>
      </section>

      <section className="modules">
        <h2>What's under the hood</h2>
        <div className="modules__grid">
          {MODULES.map((m) => (
            <article className="module-card" key={m.title}>
              <span className="module-card__tag">{m.tag}</span>
              <h3>{m.title}</h3>
              <p>{m.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="steps">
        <h2>How it works</h2>
        <div className="steps__row">
          {STEPS.map((s, i) => (
            <div className="step" key={s.n}>
              <span className="step__n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              {i < STEPS.length - 1 && <span className="step__arrow">→</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="cta">
        <h2>Build your first virtual portfolio.</h2>
        <p>Free to start. No card, no real capital — just the market and your calls.</p>
        <Link to="/register" className="btn btn--primary">
          Create your account
        </Link>
      </section>

      <footer className="footer">
        <span>StockSense — a BE IT project, D. Y. Patil College of Engineering, Akurdi</span>
      </footer>
    </>
  )
}

export default Home
