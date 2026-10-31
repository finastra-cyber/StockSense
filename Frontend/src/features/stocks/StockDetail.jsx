import { useState, useEffect, useRef, useMemo } from 'react'

import { useParams, useNavigate, Link } from 'react-router-dom'

import { Star, ShoppingCart, TrendingUp, TrendingDown, Info } from 'lucide-react'

import { createChart, CrosshairMode } from 'lightweight-charts'

import { useDocTitle }     from '../../hooks/useDocTitle.js'

import { usePriceTicker }  from '../../hooks/usePriceTicker.js'

import { fetchStockDetail, fetchStockHistory } from '../../services/stockService.js'

import { fetchRecommendation } from '../../services/aiService.js'

import { fetchNews }       from '../../services/newsService.js'

import { useWatchlistStore } from '../../store/watchlistStore.js'

import { useTradeStore }   from '../../store/tradeStore.js'

import { computeAllIndicators } from '../../utils/indicators.js'

import { formatINR, formatPct, formatRelative } from '../../utils/formatters.js'

import { SIGNAL_COLORS }   from '../../utils/constants.js'

import Badge    from '../../components/ui/Badge.jsx'

import Skeleton, { SkeletonCard } from '../../components/ui/Skeleton.jsx'

import PriceChange from '../../components/ui/PriceChange.jsx'

import Tooltip  from '../../components/ui/Tooltip.jsx'

import ErrorState from '../../components/ui/ErrorState.jsx'

import Tabs     from '../../components/ui/Tabs.jsx'

import QuickTradeModal from '../../components/trading/QuickTradeModal.jsx'



const TF_OPTIONS = ['1D','1W','1M','3M','1Y','ALL']



function CandlestickChart({ candles, indicators, show }) {

  const containerRef = useRef(null)

  const chartRef     = useRef(null)

  const seriesRef    = useRef({})



  useEffect(() => {

    if (!containerRef.current || !candles.length) return



    const chart = createChart(containerRef.current, {

      layout: {

        background:  { color: 'transparent' },

        textColor:   '#94A3B8',

      },

      grid: {

        vertLines:   { color: 'rgba(255,255,255,0.04)' },

        horzLines:   { color: 'rgba(255,255,255,0.04)' },

      },

      crosshair:     { mode: CrosshairMode.Normal },

      rightPriceScale: { borderColor: 'rgba(255,255,255,0.08)' },

      timeScale:       { borderColor: 'rgba(255,255,255,0.08)', timeVisible: true },

      width:  containerRef.current.clientWidth,

      height: 340,

    })



    const candleSeries = chart.addCandlestickSeries({

      upColor:   '#10B981', downColor: '#F43F5E',

      borderUpColor: '#10B981', borderDownColor: '#F43F5E',

      wickUpColor:   '#10B981', wickDownColor:   '#F43F5E',

    })

    candleSeries.setData(candles)



    // Volume

    const volumeSeries = chart.addHistogramSeries({

      color: 'rgba(99,102,241,0.3)', priceFormat: { type: 'volume' },

      priceScaleId: '',

    })

    volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.85, bottom: 0 } })

    volumeSeries.setData(candles.map(c => ({ time: c.time, value: c.volume, color: c.close >= c.open ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)' })))



    seriesRef.current = { chart, candleSeries, volumeSeries }



    const ro = new ResizeObserver(() => {

      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth })

    })

    ro.observe(containerRef.current)

    chartRef.current = chart



    return () => { ro.disconnect(); chart.remove() }

  }, [candles])



  // Overlay indicator lines

  useEffect(() => {

    const { chart, candleSeries } = seriesRef.current || {}

    if (!chart || !candles.length) return

    // Clear old lines

    ;['sma20','sma50','ema12','ema26'].forEach(k => {

      if (seriesRef.current[k]) { try { chart.removeSeries(seriesRef.current[k]) } catch {} }

    })

    const ind = computeAllIndicators(candles)

    const closes = candles.map(c => c.close)



    function addLine(data, nullArr, color, key) {

      if (!show[key]) return

      const series = chart.addLineSeries({ color, lineWidth: 1.5, priceLineVisible: false, lastValueVisible: false })

      series.setData(data.map((v, i) => v !== null ? { time: candles[i].time, value: v } : null).filter(Boolean))

      seriesRef.current[key] = series

    }

    addLine(ind.sma20, ind.sma20, '#F59E0B', 'sma20')

    addLine(ind.sma50, ind.sma50, '#22D3EE', 'sma50')

    addLine(ind.ema12, ind.ema12, '#8B5CF6', 'ema12')

    addLine(ind.ema26, ind.ema26, '#F43F5E', 'ema26')

  }, [show, candles])



  return <div ref={containerRef} style={{ width: '100%', borderRadius: 'var(--r)' }} />

}



export default function StockDetail() {

  const { symbol }  = useParams()

  const navigate    = useNavigate()

  const { add, remove, isWatched } = useWatchlistStore()

  const { holdings } = useTradeStore()



  const [stock,   setStock]   = useState(null)

  const [candles, setCandles] = useState([])

  const [signal,  setSignal]  = useState(null)

  const [news,    setNews]    = useState([])

  const [tf,      setTf]      = useState('3M')

  const [tab,     setTab]     = useState('overview')

  const [loading, setLoading] = useState(true)

  const [error,   setError]   = useState(null)

  const [qtOpen,  setQtOpen]  = useState(false)

  const [show,    setShow]    = useState({ sma20: true, sma50: true, ema12: false, ema26: false })



  useDocTitle(symbol?.toUpperCase())



  const { prices } = usePriceTicker([symbol?.toUpperCase()])

  const livePrice  = prices[symbol?.toUpperCase()]



  async function load() {

    setLoading(true); setError(null)

    try {

      const [s, h, sig, n] = await Promise.all([

        fetchStockDetail(symbol),

        fetchStockHistory(symbol, tf),

        fetchRecommendation(symbol),

        fetchNews(symbol),

      ])

      setStock(s); setCandles(h); setSignal(sig); setNews(n)

    } catch (e) { setError(e.message) }

    finally { setLoading(false) }

  }



  useEffect(() => { load() }, [symbol])

  useEffect(() => {

    fetchStockHistory(symbol, tf).then(setCandles).catch(() => {})

  }, [tf, symbol])



  const indicators = useMemo(() => {

    if (!candles.length) return {}

    const ind = computeAllIndicators(candles)

    const last = candles.length - 1

    return {

      sma20: ind.sma20[last], sma50: ind.sma50[last],

      ema12: ind.ema12[last], ema26: ind.ema26[last],

      rsi:   ind.rsi[last],

      macd:  ind.macd.macdLine[last], macdSignal: ind.macd.signalLine[last],

    }

  }, [candles])



  const holding = holdings[symbol?.toUpperCase()]

  const price   = livePrice ?? stock?.price ?? 0

  const sigColors = signal ? SIGNAL_COLORS[signal.signal] : null



  if (error) return (

    <div style={{ padding: '3rem' }}>

      <ErrorState message={error} onRetry={load} />

    </div>

  )



  return (

    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>



      {/*  Header  */}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>

        <div>

          {loading ? (

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

              <Skeleton height={28} width={120} />

              <Skeleton height={14} width={200} />

            </div>

          ) : (

            <>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--tx)', letterSpacing: '-.025em' }}>

                  {stock?.symbol}

                </h1>

                <span style={{ fontSize: '.75rem', color: 'var(--tx-3)', background: 'var(--card-hi)', border: '1px solid var(--border)', borderRadius: 6, padding: '.15rem .5rem' }}>

                  {stock?.exchange ?? 'NSE'}

                </span>

                <button

                  onClick={() => isWatched(symbol) ? remove(symbol) : add(symbol)}

                  aria-label={isWatched(symbol) ? 'Remove from watchlist' : 'Add to watchlist'}

                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: isWatched(symbol) ? 'var(--gold)' : 'var(--tx-3)', transition: 'color .15s', display: 'flex' }}

                >

                  <Star size={18} fill={isWatched(symbol) ? 'currentColor' : 'none'} />

                </button>

              </div>

              <div style={{ fontSize: '.85rem', color: 'var(--tx-2)', marginTop: 2 }}>{stock?.name}</div>

            </>

          )}

        </div>



        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>

          {loading ? (

            <Skeleton height={40} width={180} />

          ) : (

            <div style={{ textAlign: 'right' }}>

              <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--mono)', color: 'var(--tx)', letterSpacing: '-.02em' }}>

                {formatINR(price, 2)}

              </div>

              <PriceChange value={stock?.changePct} size="md" />

            </div>

          )}

          <div style={{ display: 'flex', gap: '.5rem' }}>

            <button className="btn btn--up" onClick={() => { setQtOpen(true) }} aria-label={`Buy ${symbol}`}>

              <ShoppingCart size={14} /> Buy

            </button>

            <button className="btn btn--danger" onClick={() => { setQtOpen(true) }} aria-label={`Sell ${symbol}`}>

              Sell

            </button>

          </div>

        </div>

      </div>



      {/*  Chart + Signal  */}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1rem', alignItems: 'start' }}>

        {/* Chart */}

        <div className="card" style={{ padding: '1rem' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.75rem', flexWrap: 'wrap', gap: '.5rem' }}>

            {/* Timeframe */}

            <div style={{ display: 'flex', gap: 3 }}>

              {TF_OPTIONS.map(t => (

                <button key={t} onClick={() => setTf(t)}

                  style={{

                    padding: '.25rem .55rem', border: 'none', borderRadius: 6, fontSize: '.72rem', fontWeight: 600,

                    background: tf === t ? 'var(--accent)' : 'var(--card-hi)',

                    color: tf === t ? '#fff' : 'var(--tx-3)', cursor: 'pointer',

                  }}

                >{t}</button>

              ))}

            </div>

            {/* Indicator toggles */}

            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>

              {[['sma20','SMA20','#F59E0B'],['sma50','SMA50','#22D3EE'],['ema12','EMA12','#8B5CF6'],['ema26','EMA26','#F43F5E']].map(([k,lbl,clr]) => (

                <button key={k} onClick={() => setShow(s => ({ ...s, [k]: !s[k] }))}

                  style={{

                    padding: '.2rem .5rem', border: `1px solid ${show[k] ? clr : 'var(--border)'}`,

                    borderRadius: 6, fontSize: '.65rem', fontWeight: 600,

                    background: show[k] ? clr + '22' : 'transparent',

                    color: show[k] ? clr : 'var(--tx-3)', cursor: 'pointer',

                  }}

                >{lbl}</button>

              ))}

            </div>

          </div>



          {loading ? <SkeletonCard height={340} /> : (

            candles.length ? <CandlestickChart candles={candles} indicators={indicators} show={show} /> : null

          )}

        </div>



        {/* Right panel */}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>



          {/* AI Signal */}

          {loading ? <SkeletonCard height={200} /> : signal && (

            <div className="card" style={{ borderColor: sigColors?.border }}>

              <div style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--tx-3)', marginBottom: '.65rem' }}>

                 AI Educational Signal

              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>

                <Badge label={signal.signal} preset={signal.signal} size="lg" />

                <div>

                  <div style={{ fontSize: '.72rem', color: 'var(--tx-3)' }}>Confidence</div>

                  <div style={{ fontFamily: 'var(--mono)', fontSize: '1.1rem', fontWeight: 700, color: sigColors?.color }}>

                    {Math.round(signal.confidence * 100)}%

                  </div>

                </div>

              </div>



              {/* Probability bars */}

              {[['BUY', signal.buy, '#10B981'],['HOLD', signal.hold, '#F59E0B'],['SELL', signal.sell, '#F43F5E']].map(([lbl, val, clr]) => (

                <div key={lbl} style={{ marginBottom: '.45rem' }}>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.68rem', color: 'var(--tx-3)', marginBottom: 3 }}>

                    <span>{lbl}</span>

                    <span style={{ fontFamily: 'var(--mono)' }}>{Math.round(val * 100)}%</span>

                  </div>

                  <div style={{ height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>

                    <div style={{ height: '100%', width: `${val * 100}%`, background: clr, borderRadius: 3, transition: 'width .4s' }} />

                  </div>

                </div>

              ))}



              <div style={{ marginTop: '.85rem', padding: '.65rem', background: 'var(--card-hi)', borderRadius: 'var(--r)', fontSize: '.75rem', color: 'var(--tx-2)', lineHeight: 1.5 }}>

                <strong style={{ color: 'var(--tx)', display: 'block', marginBottom: 4 }}>Why this signal?</strong>

                {signal.reasoning}

              </div>

              <div style={{ marginTop: '.65rem', fontSize: '.65rem', color: 'var(--tx-3)', padding: '.5rem', background: 'var(--down-bg)', borderRadius: 'var(--r)', lineHeight: 1.4 }}>

                ! Educational signal only. Not investment advice.

              </div>

            </div>

          )}



          {/* Key stats */}

          {loading ? <SkeletonCard height={180} /> : stock && (

            <div className="card">

              <div style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--tx-3)', marginBottom: '.65rem' }}>Key Stats</div>

              {[

                ['Open',      formatINR(stock.open)],

                ['High',      formatINR(stock.high)],

                ['Low',       formatINR(stock.low)],

                ['Prev Close',formatINR(stock.prevClose)],

                ['Volume',    (stock.volume / 1e6).toFixed(1) + 'M'],

                ['52W High',  formatINR(stock.week52High)],

                ['52W Low',   formatINR(stock.week52Low)],

              ].map(([k, v]) => (

                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '.38rem 0', borderBottom: '1px solid var(--border-lo)', fontSize: '.78rem' }}>

                  <span style={{ color: 'var(--tx-3)' }}>{k}</span>

                  <span style={{ fontFamily: 'var(--mono)', color: 'var(--tx)' }}>{v}</span>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>



      {/*  Indicators panel  */}

      <div className="card">

        <div style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--tx)', marginBottom: '1rem' }}>Technical Indicators</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>

          {loading ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} height={80} />) : [

            { key: 'SMA 20',   val: indicators.sma20,   color: '#F59E0B', note: indicators.sma20 < price ? 'Price above SMA - Bullish' : 'Price below SMA - Bearish' },

            { key: 'SMA 50',   val: indicators.sma50,   color: '#22D3EE', note: indicators.sma50 < price ? 'Price above SMA - Bullish' : 'Price below SMA - Bearish' },

            { key: 'RSI (14)', val: indicators.rsi,     color: indicators.rsi > 70 ? '#F43F5E' : indicators.rsi < 30 ? '#10B981' : '#F59E0B',

              note: indicators.rsi > 70 ? 'Overbought zone (>70)' : indicators.rsi < 30 ? 'Oversold zone (<30)' : 'Neutral zone (30-70)' },

            { key: 'MACD',     val: indicators.macd,    color: indicators.macd > 0 ? '#10B981' : '#F43F5E',

              note: indicators.macd > 0 ? 'Positive - Bullish momentum' : 'Negative - Bearish momentum' },

          ].map(ind => (

            <div key={ind.key} style={{ background: 'var(--card-hi)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '.85rem', display: 'flex', flexDirection: 'column', gap: 6 }}>

              <div style={{ fontSize: '.65rem', color: 'var(--tx-3)', fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase' }}>{ind.key}</div>

              <div style={{ fontFamily: 'var(--mono)', fontSize: '1.05rem', fontWeight: 700, color: ind.color }}>

                {ind.val != null ? ind.val.toFixed(2) : '  '}

              </div>

              <div style={{ fontSize: '.65rem', color: 'var(--tx-3)', lineHeight: 1.4 }}>{ind.note}</div>

            </div>

          ))}

        </div>

      </div>



      {/*  News  */}

      <div className="card">

        <div style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--tx)', marginBottom: '1rem' }}>

          Related News

          <span style={{ fontSize: '.72rem', color: 'var(--tx-3)', fontWeight: 400, marginLeft: 8 }}>Sentiment from FinBERT model . educational only</span>

        </div>

        {loading ? Array(3).fill(0).map((_, i) => <Skeleton key={i} height={56} style={{ borderRadius: 8, marginBottom: 8 }} />) : (

          news.length ? news.map(n => (

            <div key={n.id} style={{ display: 'flex', gap: 10, padding: '.7rem 0', borderBottom: '1px solid var(--border-lo)', alignItems: 'flex-start' }}>

              <Badge label={n.label} preset={n.label} size="sm" />

              <div style={{ flex: 1 }}>

                <div style={{ fontSize: '.82rem', color: 'var(--tx)', lineHeight: 1.4, marginBottom: 4 }}>{n.headline}</div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

                  <span style={{ fontSize: '.68rem', color: 'var(--tx-3)' }}>{n.source} . {formatRelative(n.publishedAt)}</span>

                  <div style={{ height: 6, width: 80, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>

                    <div style={{

                      height: '100%', borderRadius: 3,

                      width: `${Math.abs(n.score) * 100}%`,

                      background: n.score >= 0 ? 'var(--up)' : 'var(--down)',

                    }} />

                  </div>

                  <span style={{ fontSize: '.65rem', fontFamily: 'var(--mono)', color: n.score >= 0 ? 'var(--up)' : 'var(--down)' }}>

                    {n.score >= 0 ? '+' : ''}{n.score.toFixed(2)}

                  </span>

                </div>

              </div>

            </div>

          )) : (

            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--tx-3)', fontSize: '.85rem' }}>

              No news found for {symbol}

            </div>

          )

        )}

      </div>



      {/* Holding */}

      {holding && (

        <div className="card" style={{ background: 'var(--accent-bg)', borderColor: 'var(--accent-ring)' }}>

          <div style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--tx)', marginBottom: '.5rem' }}>Your Position</div>

          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>

            {[

              ['Quantity', `${holding.qty} shares`],

              ['Avg Buy Price', formatINR(holding.avgPrice)],

              ['Current Value', formatINR(holding.qty * price)],

              ['P&L', <span style={{ color: (price - holding.avgPrice) >= 0 ? 'var(--up)' : 'var(--down)', fontFamily: 'var(--mono)' }}>{formatINR((price - holding.avgPrice) * holding.qty)} ({formatPct(((price / holding.avgPrice) - 1) * 100)})</span>],

            ].map(([k, v]) => (

              <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                <span style={{ fontSize: '.62rem', color: 'var(--tx-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em' }}>{k}</span>

                <span style={{ fontFamily: 'var(--mono)', fontSize: '.9rem', color: 'var(--tx)', fontWeight: 600 }}>{v}</span>

              </div>

            ))}

          </div>

        </div>

      )}



      <QuickTradeModal open={qtOpen} onClose={() => setQtOpen(false)} />

    </div>

  )

}

