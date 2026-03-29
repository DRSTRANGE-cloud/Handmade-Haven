import React, { useState, useRef, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import logo from '../assets/images/logo.png'   // ← project logo

// ── animations ────────────────────────────────────────────
const slideUp = keyframes`
  from { opacity: 0; transform: translateY(24px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
`
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0);   }
`
const bounce = keyframes`
  0%,80%,100% { transform: translateY(0);    }
  40%          { transform: translateY(-6px); }
`
const pulse = keyframes`
  0%,100% { box-shadow: 0 4px 20px rgba(139,30,30,0.45); }
  50%      { box-shadow: 0 8px 32px rgba(139,30,30,0.7);  }
`

// project palette
const C = {
  primary:   '#8b1e1e',   // deep maroon — navbar colour
  primary2:  '#a52424',
  accent:    '#b85c38',   // terracotta accent
  light:     '#fdf6f0',
  border:    'rgba(139,30,30,0.15)',
  text:      '#3a0f0f',
  muted:     '#7a4030',
}

// ── quick actions ─────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: '📦 My Orders',       msg: 'Show me my recent orders'          },
  { label: '🚚 Track Order',     msg: 'How can I track my order?'         },
  { label: '💳 Payment Options', msg: 'What payment methods do you have?' },
  { label: '🔄 Returns',         msg: 'What is your return policy?'       },
  { label: '🛍️ Recommend',      msg: 'Can you recommend some products?'  },
  { label: '📞 Support',         msg: 'How do I contact support?'         },
]

// ── main component ─────────────────────────────────────────
const Chatbot = () => {
  const [open,     setOpen]     = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Namaste! 🙏 I'm your Handmade Haven assistant. How can I help you today?" }
  ])
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [history,  setHistory]  = useState([])
  const [unread,   setUnread]   = useState(0)
  const [requestFailed, setRequestFailed] = useState(false)
  const [lastFailedMessage, setLastFailedMessage] = useState('')

  const bottomRef = useRef(null)
  const inputRef  = useRef(null)
  const lastSentAtRef = useRef(0)
  const { userInfo } = useSelector(s => s.userLogin)
  const routerHistory = useHistory()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 300) }
  }, [open])

  const sendMessage = async (text) => {
    const msg = (text || input).trim()
    if (!msg) return
    if (loading) return
    if (Date.now() - lastSentAtRef.current < 700) return

    lastSentAtRef.current = Date.now()
    setInput('')
    setRequestFailed(false)
    setLastFailedMessage('')
    setMessages(prev => [...prev, { from: 'user', text: msg }])
    setLoading(true)

    if (!userInfo) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          from: 'bot',
          text: "Please sign in to use the full chat experience — including order tracking! 🔐"
        }])
        setLoading(false)
      }, 500)
      return
    }

    try {
      const { data } = await axios.post(
        '/api/chat',
        { message: msg, conversationHistory: history },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      )
      const reply = data?.reply || "I'm here to help! Try asking about orders, products, or payments."
      setMessages(prev => [...prev, { from: 'bot', text: reply }])
      setHistory(Array.isArray(data?.updatedHistory) ? data.updatedHistory : history)
      if (!open) setUnread(u => u + 1)
    } catch (err) {
      console.error('Chat error:', err)
      setRequestFailed(true)
      setLastFailedMessage(msg)
      setMessages(prev => [...prev, {
        from: 'bot',
        text: 'Server is busy. Please try again later.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const parseText = (text) => {
    const m = text.match(/\[NAVIGATE:(.*?)\]/)
    if (m) return { text: text.replace(/\[NAVIGATE:.*?\]/, '').trim(), path: m[1] }
    return { text, path: null }
  }

  return (
    <>
      {/* floating button */}
      <FloatBtn onClick={() => setOpen(o => !o)} aria-label="Chat with us">
        {open
          ? <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>✕</span>
          : <LogoImg src={logo} alt="Haven" />}
        {!open && unread > 0 && <Badge>{unread}</Badge>}
      </FloatBtn>

      {open && (
        <Panel>
          {/* header */}
          <Header>
            <HeaderLogo src={logo} alt="Handmade Haven" />
            <HeaderInfo>
              <HeaderName>Haven Assistant</HeaderName>
              <HeaderStatus>● Online — here to help</HeaderStatus>
            </HeaderInfo>
            <CloseBtn onClick={() => setOpen(false)}>✕</CloseBtn>
          </Header>

          {/* messages */}
          <Messages>
            {messages.map((m, i) => {
              const { text, path } = parseText(m.text)
              return (
                <BubbleRow key={i} user={m.from === 'user'}>
                  {m.from === 'bot' && (
                    <BotAvatar src={logo} alt="bot" />
                  )}
                  <BubbleWrap user={m.from === 'user'}>
                    <Bubble user={m.from === 'user'}>
                      {text.split('\n').map((line, j) => (
                        <React.Fragment key={j}>{line}<br /></React.Fragment>
                      ))}
                      {path && (
                        <NavBtn onClick={() => { routerHistory.push(path); setOpen(false) }}>
                          Go there →
                        </NavBtn>
                      )}
                    </Bubble>
                  </BubbleWrap>
                </BubbleRow>
              )
            })}

            {loading && (
              <BubbleRow>
                <BotAvatar src={logo} alt="bot" />
                <Bubble>
                  <TypingDots>
                    <Dot style={{ animationDelay: '0s'   }} />
                    <Dot style={{ animationDelay: '0.2s' }} />
                    <Dot style={{ animationDelay: '0.4s' }} />
                  </TypingDots>
                </Bubble>
              </BubbleRow>
            )}
            <div ref={bottomRef} />
          </Messages>

          {/* quick action chips */}
          <Chips>
            {QUICK_ACTIONS.map(a => (
              <Chip key={a.label} onClick={() => sendMessage(a.msg)} disabled={loading}>
                {a.label}
              </Chip>
            ))}
          </Chips>

          {requestFailed && lastFailedMessage && (
            <RetryBar>
              <RetryText>Last message did not fully go through.</RetryText>
              <RetryBtn onClick={() => sendMessage(lastFailedMessage)} disabled={loading}>
                Retry
              </RetryBtn>
            </RetryBar>
          )}

          {/* input row */}
          <InputRow>
            <ChatInput
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message…"
              disabled={loading}
            />
            <SendBtn onClick={() => sendMessage()} disabled={!input.trim() || loading}>
              ➤
            </SendBtn>
          </InputRow>
        </Panel>
      )}
    </>
  )
}

export default Chatbot

// ── styled components ──────────────────────────────────────
const FloatBtn = styled.button`
  position: fixed;
  bottom: 2rem; right: 2rem;
  width: 62px; height: 62px;
  border-radius: 50%; border: 3px solid rgba(255,255,255,0.3);
  background: linear-gradient(135deg, ${C.primary}, ${C.primary2});
  cursor: pointer; z-index: 9999;
  display: grid; place-items: center;
  animation: ${pulse} 2.8s ease-in-out infinite;
  transition: transform 0.2s;
  overflow: hidden;
  &:hover { transform: scale(1.1); }
`
const LogoImg = styled.img`
  width: 44px; height: 44px;
  border-radius: 50%; object-fit: cover;
`
const Badge = styled.span`
  position: absolute; top: -3px; right: -3px;
  background: #e53e3e; color: #fff;
  font-size: 0.62rem; font-weight: 800;
  width: 18px; height: 18px;
  border-radius: 50%; display: grid; place-items: center;
  border: 2px solid #fff;
`
const Panel = styled.div`
  position: fixed;
  bottom: 6.5rem; right: 2rem;
  width: min(385px, calc(100vw - 2rem));
  height: min(570px, calc(100vh - 8rem));
  background: rgba(253,246,240,0.96);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid ${C.border};
  border-radius: 24px;
  box-shadow: 0 24px 64px rgba(139,30,30,0.18);
  display: flex; flex-direction: column;
  overflow: hidden; z-index: 9998;
  animation: ${slideUp} 0.3s cubic-bezier(0.34,1.56,0.64,1);
`
const Header = styled.div`
  background: linear-gradient(135deg, ${C.primary}, ${C.primary2});
  padding: 0.9rem 1.2rem;
  display: flex; align-items: center; gap: 0.75rem;
  flex-shrink: 0;
`
const HeaderLogo = styled.img`
  width: 42px; height: 42px; border-radius: 50%;
  object-fit: cover; border: 2px solid rgba(255,255,255,0.3);
  flex-shrink: 0;
`
const HeaderInfo  = styled.div`flex: 1;`
const HeaderName  = styled.div`color:#fff; font-weight:700; font-size:0.95rem;`
const HeaderStatus = styled.div`color:rgba(255,255,255,0.8); font-size:0.72rem; margin-top:2px;`
const CloseBtn = styled.button`
  background: rgba(255,255,255,0.18); border: none;
  color: #fff; width: 28px; height: 28px; border-radius: 50%;
  cursor: pointer; font-size: 0.82rem;
  display: grid; place-items: center;
  &:hover { background: rgba(255,255,255,0.32); }
`
const Messages = styled.div`
  flex: 1; overflow-y: auto; padding: 1rem;
  display: flex; flex-direction: column; gap: 0.7rem;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(139,30,30,0.15); border-radius: 2px; }
`
const BubbleRow = styled.div`
  display: flex; align-items: flex-end; gap: 0.5rem;
  flex-direction: ${p => p.user ? 'row-reverse' : 'row'};
  animation: ${fadeIn} 0.3s ease;
`
const BubbleWrap = styled.div`
  display: flex; flex-direction: column;
  align-items: ${p => p.user ? 'flex-end' : 'flex-start'};
  max-width: 78%;
`
const BotAvatar = styled.img`
  width: 30px; height: 30px; border-radius: 50%;
  object-fit: cover; flex-shrink: 0;
  border: 1.5px solid ${C.border};
`
const Bubble = styled.div`
  background: ${p => p.user
    ? `linear-gradient(135deg, ${C.primary}, ${C.primary2})`
    : 'rgba(255,255,255,0.92)'};
  color: ${p => p.user ? '#fff' : C.text};
  padding: 0.65rem 0.95rem;
  border-radius: ${p => p.user ? '18px 18px 4px 18px' : '18px 18px 18px 4px'};
  font-size: 0.88rem; line-height: 1.65;
  box-shadow: 0 2px 10px rgba(139,30,30,0.1);
  border: ${p => p.user ? 'none' : `1px solid ${C.border}`};
  word-break: break-word;
`
const NavBtn = styled.button`
  display: inline-block; margin-top: 0.5rem;
  background: rgba(255,255,255,0.22); color: inherit;
  border: 1px solid rgba(255,255,255,0.4);
  padding: 0.25rem 0.7rem; border-radius: 2rem;
  font-size: 0.78rem; cursor: pointer;
  &:hover { background: rgba(255,255,255,0.38); }
`
const TypingDots = styled.div`display:flex; gap:4px; padding:2px 0;`
const Dot = styled.span`
  width: 7px; height: 7px; background: ${C.primary};
  border-radius: 50%; display: inline-block;
  animation: ${bounce} 1.2s ease infinite;
`
const Chips = styled.div`
  display: flex; flex-wrap: wrap; gap: 0.4rem;
  padding: 0.55rem 0.9rem;
  border-top: 1px solid ${C.border};
  flex-shrink: 0;
`
const Chip = styled.button`
  background: rgba(139,30,30,0.07);
  color: ${C.primary}; border: 1px solid rgba(139,30,30,0.2);
  padding: 0.28rem 0.65rem; border-radius: 2rem;
  font-size: 0.74rem; font-weight: 600; cursor: pointer;
  transition: all 0.2s;
  &:hover { background: ${C.primary}; color: #fff; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`
const RetryBar = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;
  padding: 0.65rem 1rem;
  border-top: 1px solid ${C.border};
  background: rgba(255,255,255,0.7);
`
const RetryText = styled.span`
  font-size: 0.76rem; color: ${C.muted};
`
const RetryBtn = styled.button`
  background: transparent;
  color: ${C.primary};
  border: 1px solid rgba(139,30,30,0.24);
  border-radius: 999px;
  padding: 0.3rem 0.8rem;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`
const InputRow = styled.div`
  display: flex; gap: 0.5rem;
  padding: 0.7rem 1rem;
  border-top: 1px solid ${C.border};
  flex-shrink: 0;
`
const ChatInput = styled.input`
  flex: 1;
  background: rgba(255,255,255,0.85);
  border: 1.5px solid rgba(139,30,30,0.2);
  border-radius: 12px;
  padding: 0.55rem 0.9rem;
  font-size: 0.88rem; color: ${C.text};
  outline: none; transition: border-color 0.2s;
  &:focus { border-color: ${C.primary}; }
  &::placeholder { color: #c9a090; }
`
const SendBtn = styled.button`
  background: linear-gradient(135deg, ${C.primary}, ${C.primary2});
  color: #fff; border: none;
  width: 40px; height: 40px; border-radius: 12px;
  font-size: 1rem; cursor: pointer;
  display: grid; place-items: center;
  transition: opacity 0.2s, transform 0.2s;
  &:disabled { opacity: 0.4; cursor: not-allowed; }
  &:not(:disabled):hover { transform: scale(1.08); }
`
