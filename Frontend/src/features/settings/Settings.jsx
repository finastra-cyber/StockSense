import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import toast from 'react-hot-toast'

import { useDocTitle }   from '../../hooks/useDocTitle.js'

import { useAuth }       from '../../context/AuthContext.jsx'

import { useTradeStore } from '../../store/tradeStore.js'

import { useThemeStore } from '../../store/themeStore.js'

import { getInitials, formatINR } from '../../utils/formatters.js'

import { STARTING_CASH } from '../../utils/constants.js'

import Tabs          from '../../components/ui/Tabs.jsx'

import Toggle        from '../../components/ui/Toggle.jsx'

import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx'



export default function Settings() {

  useDocTitle('Settings')

  const navigate = useNavigate()

  const { user, logout } = useAuth()

  const { resetAccount, cash, transactions } = useTradeStore()

  const { theme, toggle: toggleTheme, setTheme } = useThemeStore()



  const [tab,       setTab]       = useState('profile')

  const [confirmReset, setConfirmReset] = useState(false)

  const [resetting, setResetting] = useState(false)

  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })

  const [pwError, setPwError] = useState('')

  const [pwOk,    setPwOk]    = useState(false)

  const [compact, setCompact] = useState(() => localStorage.getItem('fin_compact') === '1')



  const name  = user?.username || user?.name || 'Trader'

  const email = user?.email || 'user@example.com'



  async function handleReset() {

    setResetting(true)

    await new Promise(r => setTimeout(r, 700))

    resetAccount()

    setResetting(false)

    setConfirmReset(false)

    toast.success('Virtual account reset to ₹10,00,000')

  }



  function handlePwSubmit(e) {

    e.preventDefault()

    setPwError('')

    if (!pwForm.current)             { setPwError('Enter your current password.'); return }

    if (pwForm.next.length < 8)      { setPwError('New password must be at least 8 characters.'); return }

    if (pwForm.next !== pwForm.confirm) { setPwError('Passwords do not match.'); return }

    // Mock - no real endpoint

    setPwOk(true)

    toast.success('Password updated')

  }



  function handleLogout() {

    logout()

    navigate('/')

    toast('Logged out', { icon: '' })

  }



  function toggleCompact(val) {

    setCompact(val)

    localStorage.setItem('fin_compact', val ? '1' : '0')

    toast(val ? 'Compact mode on' : 'Compact mode off', { icon: '' })

  }



  const TABS_LIST = [

    { value: 'profile',    label: 'Profile' },

    { value: 'appearance', label: 'Appearance' },

    { value: 'account',    label: 'Virtual Account' },

    { value: 'security',   label: 'Security' },

    { value: 'about',      label: 'About' },

  ]



  return (

    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 680 }}>

      <div className="page-header">

        <div>

          <h1 className="page-header__title">Settings</h1>

          <p className="page-header__sub">Manage your account and preferences</p>

        </div>

      </div>



      <Tabs tabs={TABS_LIST} active={tab} onChange={setTab} />



      {/* Profile */}

      {tab === 'profile' && (

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

            <div style={{

              width: 56, height: 56, borderRadius: '50%',

              background: 'linear-gradient(135deg, var(--accent), var(--violet))',

              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',

              fontSize: '1.25rem', fontWeight: 700,

            }}>{getInitials(name)}</div>

            <div>

              <div style={{ fontWeight: 700, color: 'var(--tx)', fontSize: '1rem' }}>{name}</div>

              <div style={{ fontSize: '.78rem', color: 'var(--tx-3)' }}>{email}</div>

            </div>

          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>

            <div className="field">

              <label>Name</label>

              <input defaultValue={name} readOnly style={{ opacity: .7, cursor: 'not-allowed' }} title="Name cannot be changed in mock mode" />

            </div>

            <div className="field">

              <label>Email</label>

              <input defaultValue={email} readOnly style={{ opacity: .7, cursor: 'not-allowed' }} title="Email cannot be changed in mock mode" />

            </div>

          </div>

          <div style={{ fontSize: '.72rem', color: 'var(--tx-3)', background: 'var(--card-hi)', borderRadius: 'var(--r)', padding: '.6rem .85rem' }}>

            i Profile edits will be enabled when the backend is connected (VITE_USE_MOCKS=false).

          </div>

        </div>

      )}



      {/* Appearance */}

      {tab === 'appearance' && (

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          <div>

            <div style={{ fontWeight: 700, color: 'var(--tx)', marginBottom: '.35rem' }}>Color Theme</div>

            <div style={{ display: 'flex', gap: '.75rem', marginTop: '.5rem' }}>

              {[['dark',' Dark'],['light',' Light']].map(([t, lbl]) => (

                <button key={t} onClick={() => setTheme(t)}

                  style={{

                    padding: '.6rem 1.1rem', borderRadius: 'var(--r)', border: '1px solid',

                    borderColor: theme === t ? 'var(--accent)' : 'var(--border)',

                    background: theme === t ? 'var(--accent-bg)' : 'var(--card-hi)',

                    color: theme === t ? 'var(--accent)' : 'var(--tx-2)',

                    fontWeight: theme === t ? 700 : 500, fontSize: '.85rem', cursor: 'pointer',

                  }}

                >{lbl}</button>

              ))}

            </div>

          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            <div>

              <div style={{ fontWeight: 600, color: 'var(--tx)', fontSize: '.9rem' }}>Compact Mode</div>

              <div style={{ fontSize: '.75rem', color: 'var(--tx-3)' }}>Reduce spacing for a denser layout</div>

            </div>

            <Toggle checked={compact} onChange={toggleCompact} label="" />

          </div>

        </div>

      )}



      {/* Virtual Account */}

      {tab === 'account' && (

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          <div className="card">

            <div style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--tx)', marginBottom: '1rem' }}>Virtual Account Summary</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>

              {[

                { label: 'Starting Capital',   value: formatINR(STARTING_CASH) },

                { label: 'Current Cash',        value: formatINR(cash) },

                { label: 'Total Trades',        value: transactions.length },

                { label: 'Cash Remaining',      value: `${((cash / STARTING_CASH) * 100).toFixed(1)}%` },

              ].map(s => (

                <div key={s.label} style={{ background: 'var(--card-hi)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '.85rem' }}>

                  <div style={{ fontSize: '.62rem', color: 'var(--tx-3)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700, marginBottom: 4 }}>{s.label}</div>

                  <div style={{ fontFamily: 'var(--mono)', fontSize: '1rem', fontWeight: 700, color: 'var(--tx)' }}>{s.value}</div>

                </div>

              ))}

            </div>

          </div>

          <div className="card" style={{ borderColor: 'rgba(244,63,94,.2)' }}>

            <div style={{ fontWeight: 700, color: 'var(--tx)', marginBottom: '.35rem' }}>Reset Virtual Account</div>

            <div style={{ fontSize: '.82rem', color: 'var(--tx-2)', lineHeight: 1.5, marginBottom: '1rem' }}>

              This will reset your cash balance to <strong style={{ color: 'var(--up)' }}>{formatINR(STARTING_CASH)}</strong> and clear all holdings and transactions. This cannot be undone.

            </div>

            <button className="btn btn--danger btn--sm" onClick={() => setConfirmReset(true)}>

              Reset Account

            </button>

          </div>

        </div>

      )}



      {/* Security */}

      {tab === 'security' && (

        <div className="card">

          <div style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--tx)', marginBottom: '1rem' }}>Change Password</div>

          {pwOk ? (

            <div style={{ background: 'var(--up-bg)', border: '1px solid rgba(16,185,129,.3)', borderRadius: 'var(--r)', padding: '.75rem 1rem', color: 'var(--up)', fontSize: '.85rem' }}>

               Password changed successfully (mock mode)

            </div>

          ) : (

            <form onSubmit={handlePwSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {pwError && <div className="banner banner--error">{pwError}</div>}

              <div className="field">

                <label htmlFor="curr-pw">Current password</label>

                <input id="curr-pw" type="password" value={pwForm.current} onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} placeholder="********" />

              </div>

              <div className="field">

                <label htmlFor="new-pw">New password</label>

                <input id="new-pw" type="password" value={pwForm.next} onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))} placeholder="At least 8 characters" />

              </div>

              <div className="field">

                <label htmlFor="conf-pw">Confirm new password</label>

                <input id="conf-pw" type="password" value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} placeholder="Re-enter new password" />

              </div>

              <button type="submit" className="btn btn--primary btn--sm" style={{ alignSelf: 'flex-start' }}>Update password</button>

            </form>

          )}

          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-lo)' }}>

            <div style={{ fontWeight: 700, color: 'var(--tx)', marginBottom: '.35rem' }}>Sign Out</div>

            <div style={{ fontSize: '.82rem', color: 'var(--tx-2)', marginBottom: '.75rem' }}>Sign out of FinAstra on this device.</div>

            <button className="btn btn--danger btn--sm" onClick={handleLogout}>Sign out</button>

          </div>

        </div>

      )}



      {/* About */}

      {tab === 'about' && (

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          <div className="card">

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>

              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,var(--accent),var(--violet))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#fff' }}></div>

              <div>

                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--tx)' }}>FinAstra</div>

                <div style={{ fontSize: '.72rem', color: 'var(--tx-3)' }}>v1.0.0 . AI-Powered Stock Analysis & Paper Trading</div>

              </div>

            </div>

            {[

              { label: 'Project',     value: 'Final Year B.E. IT Engineering Project' },

              { label: 'College',     value: 'D. Y. Patil College of Engineering, Akurdi, Pune' },

              { label: 'Academic Year', value: '2026-27' },

              { label: 'Stack',       value: 'React 18 + FastAPI + MySQL + FinBERT + Scikit-learn' },

            ].map(r => (

              <div key={r.label} style={{ display: 'flex', gap: '1rem', padding: '.5rem 0', borderBottom: '1px solid var(--border-lo)', fontSize: '.82rem' }}>

                <span style={{ color: 'var(--tx-3)', width: 140, flexShrink: 0 }}>{r.label}</span>

                <span style={{ color: 'var(--tx-2)' }}>{r.value}</span>

              </div>

            ))}

          </div>

          <div className="card" style={{ background: 'var(--down-bg)', borderColor: 'rgba(244,63,94,.2)' }}>

            <div style={{ fontWeight: 700, color: 'var(--down)', marginBottom: '.5rem' }}>! Important Disclaimer</div>

            <div style={{ fontSize: '.82rem', color: 'var(--tx-2)', lineHeight: 1.65 }}>

              FinAstra is an <strong>educational tool</strong> built for academic learning purposes only. It does not provide investment, financial, or trading advice. All signals, indicators, and analysis shown are illustrative and may not reflect actual market conditions. <strong>No real orders are ever placed.</strong> Virtual funds are simulated and have no monetary value. Past performance of any signal or strategy shown does not guarantee future results. Always consult a SEBI-registered investment advisor before making real financial decisions. The developers, college, and affiliated institutions accept no responsibility for any financial decisions made based on this platform.

            </div>

          </div>

        </div>

      )}



      {/* Confirm reset dialog */}

      <ConfirmDialog

        open={confirmReset}

        onClose={() => setConfirmReset(false)}

        onConfirm={handleReset}

        title="Reset Virtual Account?"

        message={`This will erase all ${transactions.length} trade(s) and holdings, and restore your cash to ${formatINR(STARTING_CASH)}. This action cannot be undone.`}

        confirmLabel="Yes, reset account"

        confirmVariant="danger"

        loading={resetting}

      />

    </div>

  )

}

