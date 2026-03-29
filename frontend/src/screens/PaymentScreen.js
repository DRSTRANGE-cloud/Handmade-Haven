import React, { useState } from 'react';
import { Form, Button, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../actions/cartActions';

const PaymentScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  if (!shippingAddress.address) {
    history.push('/shipping');
  }

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push('/placeorder');
  };

  return (
    <Container>
      <FormContainer>
        <CheckoutSteps step1 step2 step3 />
        <h1>Payment Method</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label as="legend">Select Method</Form.Label>
            <div className="payment-options">

  <label
    className={`payment-card ${paymentMethod === 'PayPal' ? 'active' : ''}`}
  >
    <input
      type="radio"
      name="paymentMethod"
      value="PayPal"
      checked={paymentMethod === 'PayPal'}
      onChange={(e) => setPaymentMethod(e.target.value)}
    />
    <span>💳 PayPal / Credit Card</span>
  </label>

  <label
    className={`payment-card ${paymentMethod === 'COD' ? 'active' : ''}`}
  >
    <input
      type="radio"
      name="paymentMethod"
      value="COD"
      checked={paymentMethod === 'COD'}
      onChange={(e) => setPaymentMethod(e.target.value)}
    />
    <span>🚚 Cash on Delivery</span>
  </label>

</div>
          </Form.Group>

          <Button type="submit" className="payment-btn">
            Continue
          </Button>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default PaymentScreen;
