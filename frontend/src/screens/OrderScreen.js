import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import styled, { keyframes } from 'styled-components'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getImageUrl } from '../utils/imageHelper'
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'

// ── animations ────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`
const fillBar = keyframes`
  from { width: 0%; }
  to   { width: var(--fill); }
`

// ── stepper config ─────────────────────────────────────────
const STEPS = [
  { label: 'Order Placed', icon: '🛒' },
  { label: 'Processing',   icon: '⚙️'  },
  { label: 'Shipped',      icon: '🚚'  },
  { label: 'Delivered',    icon: '✅'  },
]

const getStep = (isPaid, isDelivered) => {
  if (isDelivered) return 3
  if (isPaid)      return 2
  return 1
}

// ── tracking stepper component ─────────────────────────────
const OrderTrackerUI = ({ isPaid, isDelivered, paymentMethod }) => {
  const current = getStep(isPaid, isDelivered)
  const fillPct = `${(current / (STEPS.length - 1)) * 100}%`

  return (
    <TrackerCard>
      <TrackerTitle>📍 Order Tracking</TrackerTitle>
      <ProgressWrap>
        <ProgressBg />
        <ProgressFill style={{ '--fill': fillPct }} />
        <StepsRow>
          {STEPS.map((s, i) => (
            <StepItem key={i}>
              <StepIcon active={i <= current} done={i < current}>
                {i < current ? '✓' : s.icon}
              </StepIcon>
              <StepLabel active={i <= current}>{s.label}</StepLabel>
            </StepItem>
          ))}
        </StepsRow>
      </ProgressWrap>
      <StatusBadge paid={isPaid} delivered={isDelivered}>
        {isDelivered
          ? '✅ Delivered'
          : isPaid
          ? '🚚 On the way'
          : paymentMethod === 'COD'
          ? '🏠 COD — Pay on delivery'
          : '⏳ Awaiting payment'}
      </StatusBadge>
    </TrackerCard>
  )
}

// ── main screen ────────────────────────────────────────────
const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id
  const [sdkReady, setSdkReady] = useState(false)
  const dispatch = useDispatch()

  const { order, loading, error } = useSelector(s => s.orderDetails)
  const { loading: loadingPay,     success: successPay }     = useSelector(s => s.orderPay)
  const { loading: loadingDeliver, success: successDeliver } = useSelector(s => s.orderDeliver)
  const { userInfo } = useSelector(s => s.userLogin)

  if (!loading && order) {
    const addDecimals = n => (Math.round(n * 100) / 100).toFixed(2)
    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    )
  }

  useEffect(() => {
    if (!userInfo) { history.push('/login'); return }

    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal')
      const script = document.createElement('script')
      script.type  = 'text/javascript'
      script.src   = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () => setSdkReady(true)
      document.body.appendChild(script)
    }

    if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid && order.paymentMethod !== 'COD') {
      if (!window.paypal) addPayPalScript()
      else setSdkReady(true)
    }
    // eslint-disable-next-line
  }, [dispatch, orderId, successPay, successDeliver, order])

  const successPaymentHandler = result => dispatch(payOrder(orderId, result))
  const deliverHandler        = ()     => dispatch(deliverOrder(order))

  if (loading) return <Loader />
  if (error)   return <Message variant="danger">{error}</Message>

  return (
    <PageWrap>
      <PageTitle>Order <OrderId>#{order._id.slice(-8).toUpperCase()}</OrderId></PageTitle>

      <OrderTrackerUI
        isPaid={order.isPaid}
        isDelivered={order.isDelivered}
        paymentMethod={order.paymentMethod}
      />

      <Row>
        <Col md={8}>
          {/* shipping */}
          <InfoCard>
            <SectionTitle>🚚 Shipping Details</SectionTitle>
            <InfoGrid>
              <InfoItem><Label>Name</Label>    <Value>{order.user.name}</Value></InfoItem>
              <InfoItem>
                <Label>Email</Label>
                <Value><a href={`mailto:${order.user.email}`}>{order.user.email}</a></Value>
              </InfoItem>
              <InfoItem>
                <Label>Address</Label>
                <Value>
                  {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                  {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </Value>
              </InfoItem>
            </InfoGrid>
            {order.isDelivered
              ? <StatusPill success>✅ Delivered on {new Date(order.deliveredAt).toLocaleDateString('en-IN')}</StatusPill>
              : <StatusPill>❌ Not yet delivered</StatusPill>}
          </InfoCard>

          {/* payment */}
          <InfoCard>
            <SectionTitle>💳 Payment</SectionTitle>
            <InfoGrid>
              <InfoItem>
                <Label>Method</Label>
                <Value>{order.paymentMethod === 'COD' ? '🏠 Cash on Delivery' : '💳 PayPal'}</Value>
              </InfoItem>
            </InfoGrid>
            {order.isPaid
              ? <StatusPill success>✅ Paid on {new Date(order.paidAt).toLocaleDateString('en-IN')}</StatusPill>
              : order.paymentMethod === 'COD'
              ? <StatusPill warning>🏠 Pay on delivery</StatusPill>
              : <StatusPill>❌ Not paid</StatusPill>}
          </InfoCard>

          {/* order items */}
          <InfoCard>
            <SectionTitle>📦 Order Items</SectionTitle>
            {order.orderItems.length === 0
              ? <Message>Order is empty</Message>
              : order.orderItems.map((item, i) => (
                <ItemRow key={i}>
                  <ItemImg src={getImageUrl(item.image)} alt={item.name} />
                  <ItemName>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </ItemName>
                  <ItemPrice>{item.qty} × ₹{item.price} = ₹{item.qty * item.price}</ItemPrice>
                </ItemRow>
              ))}
          </InfoCard>
        </Col>

        <Col md={4}>
          <SummaryCard>
            <SectionTitle>🧾 Order Summary</SectionTitle>
            <SummaryRow><span>Items</span>    <span>₹{order.itemsPrice}</span></SummaryRow>
            <SummaryRow><span>Shipping</span> <span>₹{order.shippingPrice}</span></SummaryRow>
            <SummaryRow total><span>Total</span><span>₹{order.totalPrice}</span></SummaryRow>

            {/* paypal */}
            {!order.isPaid && order.paymentMethod !== 'COD' && (
              <div style={{ marginTop: '1rem' }}>
                {loadingPay && <Loader />}
                {!sdkReady
                  ? <Loader />
                  : userInfo._id === order.user._id
                  ? <PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler} />
                  : <ActionBtn disabled>Pay with PayPal</ActionBtn>}
              </div>
            )}

            {/* COD notice */}
            {order.paymentMethod === 'COD' && !order.isPaid && (
              <CODNotice>
                🏠 <strong>Cash on Delivery</strong><br />
                Pay ₹{order.totalPrice} when your order arrives.
              </CODNotice>
            )}

            {/* admin deliver button */}
            {loadingDeliver && <Loader />}
            {userInfo && (userInfo.isAdmin || userInfo.isAdminSeller) &&
              (order.isPaid || order.paymentMethod === 'COD') &&
              !order.isDelivered && (
              <ActionBtn onClick={deliverHandler} style={{ marginTop: '1rem' }}>
                ✅ Mark As Delivered
              </ActionBtn>
            )}
          </SummaryCard>
        </Col>
      </Row>
    </PageWrap>
  )
}

export default OrderScreen

// ── styled components ──────────────────────────────────────
const PageWrap = styled.div`
  max-width: 1100px; margin: 0 auto; padding: 2rem 1rem;
  animation: ${fadeUp} 0.5s ease;
`
const PageTitle = styled.h1`
  font-size: 1.6rem; font-weight: 800; color: #4a1c12;
  margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 0.04em;
`
const OrderId = styled.span`color: #b85c38;`

const TrackerCard = styled.div`
  background: rgba(255,255,255,0.85); backdrop-filter: blur(12px);
  border: 1px solid rgba(184,92,56,0.12); border-radius: 20px;
  padding: 1.5rem; margin-bottom: 2rem;
  box-shadow: 0 4px 24px rgba(139,60,50,0.07);
`
const TrackerTitle = styled.h3`
  font-size: 1rem; font-weight: 700; color: #4a1c12; margin-bottom: 1.2rem;
`
const ProgressWrap = styled.div`position: relative; padding: 0 1rem;`
const ProgressBg   = styled.div`
  position: absolute; top: 20px;
  left: calc(1rem + 20px); right: calc(1rem + 20px);
  height: 3px; background: #f0e0d8; border-radius: 2px;
`
const ProgressFill = styled.div`
  position: absolute; top: 20px; left: calc(-1rem + 20px);
  height: 3px; border-radius: 2px;
  background: linear-gradient(90deg, #b85c38, #e8926a);
  animation: ${fillBar} 0.8s ease forwards;
`
const StepsRow  = styled.div`display: flex; justify-content: space-between; padding-bottom: 0.5rem;`
const StepItem  = styled.div`display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1;`
const StepIcon  = styled.div`
  width: 40px; height: 40px; border-radius: 50%;
  display: grid; place-items: center; font-size: 1rem; font-weight: 700;
  background: ${p => p.done ? 'linear-gradient(135deg,#b85c38,#c4714a)' : p.active ? '#fde8de' : '#f5ede9'};
  color:      ${p => p.done ? '#fff' : p.active ? '#b85c38' : '#c9a090'};
  border: 2.5px solid ${p => p.active ? '#b85c38' : '#e8d5cc'};
  transition: all 0.3s; position: relative; z-index: 1;
`
const StepLabel = styled.div`
  font-size: 0.68rem; font-weight: 600; text-align: center;
  color: ${p => p.active ? '#b85c38' : '#c9a090'};
`
const StatusBadge = styled.div`
  margin-top: 1rem; text-align: center; font-size: 0.85rem; font-weight: 700;
  color:      ${p => p.delivered ? '#2d7a4f' : p.paid ? '#b85c38' : '#7a4030'};
  background: ${p => p.delivered ? '#e8f5ee'  : p.paid ? '#fde8de' : '#fdf0eb'};
  padding: 0.5rem 1rem; border-radius: 2rem; display: inline-block;
`
const InfoCard = styled.div`
  background: rgba(255,255,255,0.85); backdrop-filter: blur(8px);
  border: 1px solid rgba(184,92,56,0.1); border-radius: 16px;
  padding: 1.4rem; margin-bottom: 1.2rem;
  box-shadow: 0 4px 16px rgba(139,60,50,0.05);
`
const SummaryCard  = styled(InfoCard)`position: sticky; top: 1rem;`
const SectionTitle = styled.h3`
  font-size: 0.95rem; font-weight: 700; color: #4a1c12;
  margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.06em;
`
const InfoGrid  = styled.div`display: flex; flex-direction: column; gap: 0.5rem;`
const InfoItem  = styled.div`display: flex; gap: 0.5rem; flex-wrap: wrap;`
const Label     = styled.span`font-weight: 700; color: #7a4030; min-width: 70px; font-size: 0.87rem;`
const Value     = styled.span`color: #4a1c12; font-size: 0.87rem; a { color: #b85c38; }`
const StatusPill = styled.div`
  margin-top: 0.75rem; display: inline-block;
  padding: 0.3rem 0.9rem; border-radius: 2rem; font-size: 0.8rem; font-weight: 700;
  background: ${p => p.success ? '#e8f5ee' : p.warning ? '#fff8e6' : '#fde8de'};
  color:      ${p => p.success ? '#2d7a4f' : p.warning ? '#9a6b00' : '#b85c38'};
`
const ItemRow   = styled.div`
  display: flex; align-items: center; gap: 1rem;
  padding: 0.6rem 0; border-bottom: 1px solid rgba(184,92,56,0.08);
  &:last-child { border-bottom: none; }
`
const ItemImg   = styled.img`
  width: 52px; height: 52px; object-fit: cover;
  border-radius: 10px; border: 1px solid rgba(184,92,56,0.12);
`
const ItemName  = styled.div`
  flex: 1; font-size: 0.87rem;
  a { color: #4a1c12; font-weight: 600; &:hover { color: #b85c38; } }
`
const ItemPrice = styled.div`font-size: 0.87rem; font-weight: 700; color: #b85c38; white-space: nowrap;`
const SummaryRow = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.5rem 0;
  border-bottom: ${p => p.total ? 'none' : '1px solid rgba(184,92,56,0.08)'};
  font-weight: ${p => p.total ? 800 : 400};
  font-size:   ${p => p.total ? '1.05rem' : '0.9rem'};
  color:       ${p => p.total ? '#b85c38' : '#4a1c12'};
  ${p => p.total && 'margin-top: 0.5rem;'}
`
const ActionBtn = styled.button`
  width: 100%; padding: 0.8rem;
  background: linear-gradient(135deg, #b85c38, #c4714a);
  color: #fff; border: none; border-radius: 12px;
  font-weight: 700; font-size: 0.95rem; cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
  &:hover:not(:disabled) { transform: translateY(-2px); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`
const CODNotice = styled.div`
  margin-top: 1rem; padding: 1rem;
  background: linear-gradient(135deg, #fff8f0, #fdeee4);
  border: 1px solid rgba(184,92,56,0.2); border-radius: 12px;
  font-size: 0.87rem; color: #7a4030; line-height: 1.6; text-align: center;
`
