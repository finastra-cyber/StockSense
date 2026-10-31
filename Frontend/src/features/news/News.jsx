import { useState, useMemo } from 'react'

import { useDocTitle }    from '../../hooks/useDocTitle.js'

import { NEWS_ARTICLES, getSentimentSummary } from '../../mocks/news.js'

import { STOCKS }         from '../../mocks/stocks.js'

import { formatRelative } from '../../utils/formatters.js'

import Badge     from '../../components/ui/Badge.jsx'

import EmptyState from '../../components/ui/EmptyState.jsx'



const COMPANIES = ['All', ...Array.from(new Set(NEWS_ARTICLES.map(n => n.company))).sort()]



export default function News() {

  useDocTitle('News & Sentiment')

  const [company,   setCompany]   = useState('All')

  const [sentiment, setSentiment] = useState('All')



  const filtered = useMemo(() => {

    let list = NEWS_ARTICLES

    if (company   !== 'All') list = list.filter(n => n.company === company)

    if (sentiment !== 'All') list = list.filter(n => n.label === sentiment.toLowerCase())

    return list

  }, [company, sentiment])



  const summary = getSentimentSummary(filtered)

  const gaugeAngle = ((summary.mean + 1) / 2) * 180 // map -1..1 to 0..180deg



  return (

    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      <div className="page-header">

        <div>

          <h1 className="page-header__title">News & Sentiment</h1>

          <p className="page-header__sub">FinBERT-powered sentiment analysis of financial headlines</p>

        </div>

      </div>



      {/* Sentiment summary */}

      <div className="card">

        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'center' }}>

          {/* Gauge */}

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem' }}>

            <svg viewBox="0 0 200 110" style={{ width: 200, height: 110 }}>

              {/* Background arc */}

              <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="var(--border)" strokeWidth="12" strokeLinecap="round" />

              {/* Colored arc */}

              <path

                d="M 20 100 A 80 80 0 0 1 180 100"

                fill="none"

                stroke={summary.mean > 0.2 ? 'var(--up)' : summary.mean < -0.2 ? 'var(--down)' : 'var(--gold)'}

                strokeWidth="12" strokeLinecap="round"

                strokeDasharray={`${(summary.mean + 1) / 2 * 251.2} 251.2`}

                style={{ transition: 'stroke-dasharray .5s' }}

              />

              {/* Needle */}

              <line

                x1="100" y1="100"

                x2={100 + 65 * Math.cos(Math.PI - gaugeAngle * Math.PI / 180)}

                y2={100 - 65 * Math.sin(Math.PI - gaugeAngle * Math.PI / 180)}

                stroke="var(--tx)" strokeWidth="2" strokeLinecap="round"

              />

              <circle cx="100" cy="100" r="5" fill="var(--tx)" />

              <text x="100" y="130" textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--tx)" fontFamily="var(--mono)">

                {summary.mean >= 0 ? '+' : ''}{summary.mean.toFixed(2)}

              </text>

              <text x="25" y="115" fontSize="9" fill="var(--down)" fontWeight="600">Negative</text>

              <text x="155" y="115" fontSize="9" fill="var(--up)" fontWeight="600">Positive</text>

            </svg>

            <div style={{ fontSize: '.72rem', color: 'var(--tx-3)', textAlign: 'center' }}>Mean Sentiment Score</div>

          </div>



          {/* Counts */}

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>

            {[

              { label: 'Positive', count: summary.positive, color: 'var(--up)',   bg: 'var(--up-bg)'   },

              { label: 'Neutral',  count: summary.neutral,  color: 'var(--gold)', bg: 'var(--gold-bg)' },

              { label: 'Negative', count: summary.negative, color: 'var(--down)', bg: 'var(--down-bg)' },

            ].map(s => (

              <div key={s.label} style={{

                background: s.bg, border: `1px solid ${s.color}33`,

                borderRadius: 'var(--r-md)', padding: '1rem 1.5rem', minWidth: 100,

                display: 'flex', flexDirection: 'column', gap: 4,

              }}>

                <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--mono)', color: s.color }}>{s.count}</div>

                <div style={{ fontSize: '.72rem', color: s.color, fontWeight: 600 }}>{s.label}</div>

              </div>

            ))}

            <div style={{ fontSize: '.72rem', color: 'var(--tx-3)', alignSelf: 'flex-end', maxWidth: 260, lineHeight: 1.5 }}>

              Sentiment is one input to the AI model and never triggers a trade on its own. Scores range from 1 (most negative) to +1 (most positive).

            </div>

          </div>

        </div>

      </div>



      {/* Filters */}

      <div style={{ display: 'flex', gap: '.65rem', flexWrap: 'wrap', alignItems: 'center' }}>

        <select

          value={company} onChange={e => setCompany(e.target.value)}

          style={{ background: 'var(--card-hi)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '.4rem .75rem', color: 'var(--tx)', fontSize: '.82rem', cursor: 'pointer' }}

          aria-label="Filter by company"

        >

          {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}

        </select>

        <div style={{ display: 'flex', gap: 4 }}>

          {['All','Positive','Neutral','Negative'].map(s => (

            <button key={s} onClick={() => setSentiment(s)}

              style={{

                padding: '.28rem .7rem', border: 'none', borderRadius: 20, fontSize: '.75rem', fontWeight: 600, cursor: 'pointer',

                background: sentiment === s ? (s === 'Positive' ? 'var(--up-bg)' : s === 'Negative' ? 'var(--down-bg)' : s === 'Neutral' ? 'var(--gold-bg)' : 'var(--accent-bg)') : 'var(--card-hi)',

                color: sentiment === s ? (s === 'Positive' ? 'var(--up)' : s === 'Negative' ? 'var(--down)' : s === 'Neutral' ? 'var(--gold)' : 'var(--accent)') : 'var(--tx-3)',

              }}

            >{s}</button>

          ))}

        </div>

        <span style={{ fontSize: '.75rem', color: 'var(--tx-3)', marginLeft: 'auto' }}>{filtered.length} articles</span>

      </div>



      {/* Article cards */}

      {filtered.length === 0 ? (

        <EmptyState icon="" title="No articles match" description="Try adjusting your filters." />

      ) : (

        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>

          {filtered.map(n => (

            <div key={n.id} className="card card--hover" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>

              <div style={{ flexShrink: 0, paddingTop: 2 }}>

                <Badge label={n.label} preset={n.label} size="sm" />

              </div>

              <div style={{ flex: 1, minWidth: 0 }}>

                <div style={{ fontSize: '.88rem', fontWeight: 600, color: 'var(--tx)', lineHeight: 1.4, marginBottom: '.4rem' }}>{n.headline}</div>

                <div style={{ fontSize: '.78rem', color: 'var(--tx-2)', lineHeight: 1.5, marginBottom: '.5rem' }}>{n.summary}</div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>

                  <span style={{ fontSize: '.68rem', color: 'var(--tx-3)' }}>{n.source} . {formatRelative(n.publishedAt)}</span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

                    <span style={{ fontSize: '.65rem', color: 'var(--tx-3)' }}>Score:</span>

                    <div style={{ height: 6, width: 100, background: 'var(--border)', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>

                      <div style={{

                        position: 'absolute', top: 0, height: '100%',

                        left: n.score < 0 ? `${50 + n.score * 50}%` : '50%',

                        width: `${Math.abs(n.score) * 50}%`,

                        background: n.score >= 0 ? 'var(--up)' : 'var(--down)',

                        borderRadius: 3,

                      }} />

                      <div style={{ position: 'absolute', top: 0, left: '50%', width: 1, height: '100%', background: 'var(--tx-3)' }} />

                    </div>

                    <span style={{ fontSize: '.65rem', fontFamily: 'var(--mono)', color: n.score >= 0 ? 'var(--up)' : 'var(--down)' }}>

                      {n.score >= 0 ? '+' : ''}{n.score.toFixed(2)}

                    </span>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  )

}

