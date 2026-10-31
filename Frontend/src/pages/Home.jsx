import { useState, useRef } from "react"
import { Link } from "react-router-dom"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { TrendingUp, Brain, BarChart2, Newspaper, ShoppingCart, Briefcase, ChevronDown, ChevronUp, Menu, X } from "lucide-react"
import { useAuth } from "../context/AuthContext.jsx"
import { useThemeStore } from "../store/themeStore.js"
import TickerTape from "../components/TickerTape.jsx"

const FEATURES = [
  { icon: TrendingUp,   title: "Real-time Market Data",       body: "Track live prices, volume and 52-week ranges for 25+ Indian stocks and major indices." },
  { icon: BarChart2,    title: "Technical Indicators",        body: "SMA, EMA, RSI and MACD computed from OHLCV data using exact industry formulas." },
  { icon: Newspaper,    title: "FinBERT Sentiment Analysis",  body: "NLP model trained on financial news classifies headlines as positive, neutral, or negative." },
  { icon: Brain,        title: "AI Buy/Hold/Sell Signals",    body: "ML model combining technical indicators and sentiment outputs probability-weighted signals." },
  { icon: ShoppingCart, title: "Paper Trading Engine",        body: "Place BUY/SELL orders with virtual capital. Full order validation, zero real risk." },
  { icon: Briefcase,    title: "Portfolio Analytics",         body: "Holdings, P&L, equity curve, Sharpe ratio, max drawdown - real performance metrics." },
]

const STEPS = [
  { n: "01", title: "Sign up",         body: "Create a free account and receive virtual capital instantly." },
  { n: "02", title: "Analyze with AI", body: "Explore stocks, view technical indicators, and read AI educational signals." },
  { n: "03", title: "Paper trade",     body: "Place BUY/SELL orders, track your portfolio, learn from every decision." },
  { n: "04", title: "Track & improve", body: "Review your equity curve, transaction history, and portfolio metrics." },
]

const INDICATORS = [
  { name: "SMA",  color: "#F59E0B", desc: "Averages closing prices over n days to show trend direction. Price above = bullish." },
  { name: "EMA",  color: "#22D3EE", desc: "Like SMA but weights recent prices more. Reacts faster to changes. Used in MACD." },
  { name: "RSI",  color: "#8B5CF6", desc: "Momentum oscillator 0-100. Above 70 = overbought. Below 30 = oversold." },
  { name: "MACD", color: "#F43F5E", desc: "EMA(12)-EMA(26) with 9-day signal. Crossovers indicate momentum shifts." },
]

const FAQS = [
  { q: "Is this real money?",             a: "No. FinAstra uses virtual funds only. No real orders are placed and no real money moves." },
  { q: "Is this investment advice?",      a: "No. Every signal is strictly educational. This is a final-year academic project. Consult a SEBI-registered advisor for real decisions." },
  { q: "Where does the data come from?",  a: "In demo mode, prices are generated deterministically with a seeded random walk. When the backend is connected (VITE_USE_MOCKS=false), data flows from the FastAPI server." },
  { q: "What is FinBERT?",               a: "FinBERT is a BERT-based NLP model fine-tuned on financial text. It classifies news as positive, neutral or negative and scores from -1 to +1." },
  { q: "Will my portfolio be saved?",     a: "Yes. Your virtual portfolio, watchlist and transactions persist in localStorage across sessions on the same browser." },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 0", background: "none", border: "none", color: "var(--tx)", fontSize: ".9rem", fontWeight: 600, cursor: "pointer", textAlign: "left", gap: "1rem" }}
        aria-expanded={open}>
        {q}
        {open ? <ChevronUp size={15} style={{ color: "var(--tx-3)", flexShrink: 0 }} /> : <ChevronDown size={15} style={{ color: "var(--tx-3)", flexShrink: 0 }} />}
      </button>
      {open && <div style={{ paddingBottom: "1rem", fontSize: ".875rem", color: "var(--tx-2)", lineHeight: 1.7 }}>{a}</div>}
    </div>
  )
}

function Eyebrow({ children }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", fontSize: ".7rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--accent)", background: "var(--accent-bg)", border: "1px solid var(--accent-ring)", borderRadius: 20, padding: ".25rem .85rem", marginBottom: ".85rem" }}>
      {children}
    </div>
  )
}

function InView({ children, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay }}>
      {children}
    </motion.div>
  )
}


export default function Home() {
  const { isAuthenticated } = useAuth()
  const { theme, toggle: toggleTheme } = useThemeStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const W = { maxWidth: 1160, margin: "0 auto", padding: "0 1.5rem", width: "100%" }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <TickerTape />

      {/* Navbar */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(11,16,32,.9)", backdropFilter: "blur(14px)", borderBottom: "1px solid var(--border-lo)" }}>
        <div style={{ ...W, height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: "1.05rem", color: "var(--tx)", textDecoration: "none" }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: ".85rem" }}></span>
            Fin<span style={{ color: "#6366F1" }}>Astra</span>
          </Link>
          <nav style={{ display: "flex", gap: ".15rem" }} aria-label="Main navigation">
            {[["#features","Features"],["#how","How it works"],["#indicators","Indicators"],["#faq","FAQ"]].map(([href,lbl]) => (
              <a key={href} href={href} style={{ fontSize: ".85rem", color: "var(--tx-2)", padding: ".4rem .8rem", borderRadius: "var(--r)", textDecoration: "none", transition: "color .15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--tx)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--tx-2)"}>{lbl}</a>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <button onClick={toggleTheme} aria-label="Toggle theme" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--tx-2)", padding: 6, fontSize: "1rem" }}>
              {theme === "dark" ? "" : ""}
            </button>
            {isAuthenticated
              ? <Link to="/app/dashboard" className="btn btn--primary btn--sm">Go to Dashboard</Link>
              : <>
                  <Link to="/login"  className="btn btn--ghost btn--sm">Log in</Link>
                  <Link to="/signup" className="btn btn--primary btn--sm">Get started</Link>
                </>}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ ...W, padding: "5.5rem 1.5rem 4.5rem", display: "grid", gridTemplateColumns: "1fr 420px", gap: "4rem", alignItems: "center" }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }}>
          <Eyebrow> Final Year Engineering Project . D.Y. Patil College of Engineering, Akurdi</Eyebrow>
          <h1 style={{ fontSize: "clamp(2.5rem,5vw,3.8rem)", fontWeight: 800, lineHeight: 1.06, letterSpacing: "-.035em", color: "var(--tx)", marginBottom: "1.25rem" }}>
            Learn to invest.{" "}
            <span style={{ background: "linear-gradient(130deg,#818CF8,#6366F1 40%,#8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Risk nothing.
            </span>
          </h1>
          <p style={{ fontSize: "1.05rem", color: "var(--tx-2)", lineHeight: 1.7, maxWidth: "46ch", marginBottom: "2rem" }}>
            FinAstra pairs SMA, EMA, RSI, MACD with AI-driven FinBERT news sentiment into one educational signal - then lets you act on it with ₹10,00,000 in virtual funds.
          </p>
          <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
            <Link to={isAuthenticated ? "/app/dashboard" : "/signup"} className="btn btn--primary" style={{ padding: ".7rem 1.6rem", fontSize: ".98rem" }}>
              {isAuthenticated ? "Open Dashboard" : "Start paper trading"}
            </Link>
            <a href="#how" className="btn" style={{ padding: ".7rem 1.6rem", fontSize: ".98rem" }}>How it works</a>
          </div>
          <p style={{ fontSize: ".72rem", color: "var(--tx-3)" }}>! Educational only . Not financial advice . No real orders placed . No real money at risk</p>
        </motion.div>

        {/* Preview card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "1.5rem", boxShadow: "0 40px 80px -20px rgba(0,0,0,.6)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#6366F1,#8B5CF6,#22D3EE)" }} />
            <div style={{ fontSize: ".6rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--gold)", background: "var(--gold-bg)", border: "1px solid rgba(245,158,11,.22)", borderRadius: 4, padding: ".18rem .5rem", display: "inline-block", marginBottom: ".9rem" }}>ILLUSTRATIVE PREVIEW</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--tx)" }}>RELIANCE</div>
                <div style={{ fontSize: ".7rem", color: "var(--tx-3)" }}>Reliance Industries Ltd . NSE</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "var(--mono)", fontWeight: 700, color: "var(--tx)" }}>₹2,946.10</div>
                <span style={{ fontSize: ".72rem", fontFamily: "var(--mono)", fontWeight: 600, color: "var(--up)", background: "var(--up-bg)", border: "1px solid rgba(16,185,129,.25)", borderRadius: 6, padding: ".18rem .45rem" }}>^ +1.24%</span>
              </div>
            </div>
            <svg viewBox="0 0 220 72" preserveAspectRatio="none" style={{ width: "100%", height: 68, display: "block", marginBottom: "1rem" }} aria-hidden="true">
              <defs><linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366F1" stopOpacity=".3" /><stop offset="100%" stopColor="#6366F1" stopOpacity="0" /></linearGradient></defs>
              <path d="M0,68 C25,62 40,50 60,44 S90,28 110,22 S148,12 168,10 S200,5 220,3 L220,72 L0,72Z" fill="url(#hg)" />
              <path d="M0,68 C25,62 40,50 60,44 S90,28 110,22 S148,12 168,10 S200,5 220,3" fill="none" stroke="#6366F1" strokeWidth="2" />
            </svg>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".4rem", marginBottom: ".9rem" }}>
              {[["SMA(50)","2,881",""],["EMA(21)","2,919",""],["RSI(14)","61.2","var(--up)"],["MACD","+8.4","var(--up)"]].map(([k,v,c]) => (
                <div key={k} style={{ background: "var(--card-hi)", border: "1px solid var(--border-lo)", borderRadius: 6, padding: ".5rem .65rem" }}>
                  <div style={{ fontSize: ".6rem", color: "var(--tx-3)" }}>{k}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: ".85rem", fontWeight: 700, color: c || "var(--tx)" }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", background: "var(--card-hi)", border: "1px solid rgba(16,185,129,.25)", borderRadius: 8, padding: ".7rem 1rem", alignItems: "center" }}>
              <span style={{ fontSize: ".72rem", color: "var(--tx-3)" }}>AI educational signal</span>
              <strong style={{ fontFamily: "var(--mono)", color: "var(--up)", fontSize: ".95rem" }}>BUY . 82%</strong>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats band */}
      <div style={{ borderTop: "1px solid var(--border-lo)", borderBottom: "1px solid var(--border-lo)", background: "var(--surface)" }}>
        <div style={{ ...W, display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {[["₹10L","Virtual capital to start"],["4","Technical indicators"],["3","Sentiment classes"],["Zero","Real money at risk"]].map(([v,l],i) => (
            <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "1.75rem 1rem", borderRight: i < 3 ? "1px solid var(--border-lo)" : "none" }}>
              <strong style={{ fontSize: "1.8rem", fontWeight: 800, fontFamily: "var(--mono)", color: "var(--tx)", letterSpacing: "-.02em" }}>{v}</strong>
              <span style={{ fontSize: ".78rem", color: "var(--tx-2)" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section id="features" style={{ ...W, padding: "5.5rem 1.5rem" }}>
        <InView><div style={{ textAlign: "center", marginBottom: "2.5rem" }}><Eyebrow>Platform Modules</Eyebrow><h2 style={{ fontSize: "clamp(1.6rem,3.5vw,2.3rem)", fontWeight: 700, letterSpacing: "-.025em", color: "var(--tx)" }}>Everything you need - risk free.</h2></div></InView>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <InView key={f.title} delay={i * 0.06}>
                <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "1.5rem", height: "100%", transition: "transform .2s, border-color .2s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--accent-bg)", border: "1px solid var(--accent-ring)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", marginBottom: ".85rem" }}><Icon size={18} /></div>
                  <h3 style={{ fontSize: ".95rem", fontWeight: 700, color: "var(--tx)", marginBottom: ".45rem" }}>{f.title}</h3>
                  <p style={{ fontSize: ".82rem", color: "var(--tx-2)", lineHeight: 1.65 }}>{f.body}</p>
                </div>
              </InView>
            )
          })}
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ background: "var(--surface)", borderTop: "1px solid var(--border-lo)", borderBottom: "1px solid var(--border-lo)" }}>
        <div style={{ ...W, padding: "5rem 1.5rem" }}>
          <InView><div style={{ textAlign: "center", marginBottom: "2.5rem" }}><Eyebrow>Workflow</Eyebrow><h2 style={{ fontSize: "clamp(1.6rem,3.5vw,2.3rem)", fontWeight: 700, letterSpacing: "-.025em", color: "var(--tx)" }}>How it works</h2></div></InView>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }}>
            {STEPS.map((s, i) => (
              <InView key={s.n} delay={i * 0.08}>
                <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "1.5rem" }}>
                  <div style={{ display: "inline-flex", fontSize: ".65rem", fontWeight: 700, letterSpacing: ".07em", color: "var(--accent)", background: "var(--accent-bg)", border: "1px solid var(--accent-ring)", borderRadius: 20, padding: ".2rem .65rem", marginBottom: ".65rem" }}>{s.n}</div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--tx)", marginBottom: ".45rem" }}>{s.title}</h3>
                  <p style={{ fontSize: ".82rem", color: "var(--tx-2)", lineHeight: 1.65 }}>{s.body}</p>
                </div>
              </InView>
            ))}
          </div>
        </div>
      </section>

      {/* Indicators */}
      <section id="indicators" style={{ ...W, padding: "5.5rem 1.5rem" }}>
        <InView><div style={{ textAlign: "center", marginBottom: "2.5rem" }}><Eyebrow>Technical Analysis</Eyebrow><h2 style={{ fontSize: "clamp(1.6rem,3.5vw,2.3rem)", fontWeight: 700, letterSpacing: "-.025em", color: "var(--tx)" }}>Indicators explained simply</h2></div></InView>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1rem" }}>
          {INDICATORS.map((ind, i) => (
            <InView key={ind.name} delay={i * 0.07}>
              <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "1.5rem", display: "flex", gap: "1rem" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: ind.color + "22", border: `1px solid ${ind.color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "var(--mono)", fontWeight: 800, fontSize: ".78rem", color: ind.color }}>{ind.name}</span>
                </div>
                <p style={{ fontSize: ".83rem", color: "var(--tx-2)", lineHeight: 1.65, margin: 0 }}>{ind.desc}</p>
              </div>
            </InView>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ background: "var(--surface)", borderTop: "1px solid var(--border-lo)", borderBottom: "1px solid var(--border-lo)" }}>
        <div style={{ ...W, padding: "5rem 1.5rem", maxWidth: 760 }}>
          <InView><div style={{ textAlign: "center", marginBottom: "2.5rem" }}><Eyebrow>FAQ</Eyebrow><h2 style={{ fontSize: "clamp(1.5rem,3vw,2.1rem)", fontWeight: 700, letterSpacing: "-.025em", color: "var(--tx)" }}>Common questions</h2></div></InView>
          {FAQS.map(f => <FAQItem key={f.q} q={f.q} a={f.a} />)}
        </div>
      </section>

      {/* CTA */}
      <section style={{ ...W, padding: "6rem 1.5rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <InView>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", color: "#fff" }}></div>
            <h2 style={{ fontSize: "clamp(1.7rem,3.5vw,2.4rem)", fontWeight: 800, letterSpacing: "-.03em", color: "var(--tx)" }}>Build your first virtual portfolio today.</h2>
            <p style={{ fontSize: "1rem", color: "var(--tx-2)", maxWidth: "44ch", lineHeight: 1.7 }}>No credit card. No real capital. Just the market and your analysis.</p>
            <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", justifyContent: "center" }}>
              <Link to={isAuthenticated ? "/app/dashboard" : "/signup"} className="btn btn--primary" style={{ padding: ".7rem 1.6rem", fontSize: ".98rem" }}>
                {isAuthenticated ? "Open Dashboard" : "Create free account"}
              </Link>
              <Link to="/login" className="btn" style={{ padding: ".7rem 1.6rem", fontSize: ".98rem" }}>Log in</Link>
            </div>
          </div>
        </InView>
      </section>

      {/* Footer */}
      <footer style={{ background: "var(--surface)", borderTop: "1px solid var(--border-lo)", padding: "2rem 1.5rem" }}>
        <div style={{ ...W, display: "flex", flexDirection: "column", alignItems: "center", gap: ".6rem", textAlign: "center" }}>
          <div style={{ fontWeight: 800, fontSize: ".95rem", color: "var(--tx)" }}>Fin<span style={{ color: "#6366F1" }}>Astra</span></div>
          <div style={{ fontSize: ".73rem", color: "var(--tx-3)" }}>AI-Powered Stock Market Analysis &amp; Paper Trading Platform</div>
          <div style={{ fontSize: ".73rem", color: "var(--tx-3)" }}>B.E. IT Project . D. Y. Patil College of Engineering, Akurdi, Pune . 2026-27</div>
          <div style={{ fontSize: ".7rem", color: "var(--tx-3)", maxWidth: "72ch", lineHeight: 1.6, padding: ".6rem .9rem", background: "rgba(244,63,94,.06)", border: "1px solid rgba(244,63,94,.12)", borderRadius: 8, marginTop: ".25rem" }}>
            ! FinAstra is an educational tool. All data, signals and analysis are illustrative. Not investment advice. No real orders are placed. No accuracy or profit claims are made.
          </div>
        </div>
      </footer>
    </div>
  )
}

