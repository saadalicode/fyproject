// React Frontend: PaymentComponent.jsx
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51Raf7gQtXfSnezAmnCr4diWNjGNmedddOovoglIXBZVYxXkhEffmnHcxxOxk1mPkjJQow9J1NZuxoToT5b4udh8A00JueDiiIl'); //  Stripe publishable key

const PaymentComponent = ({ amount, serviceName }) => {
  const handleClick = async () => {
    const res = await fetch('http://127.0.0.1:8000/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        service_name: serviceName,
        success_url: 'http://localhost:3000/payment-success',
        cancel_url: 'http://localhost:3000/payment-cancel',
      }),
    });

    const data = await res.json();
    const stripe = await stripePromise;
    stripe.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <button onClick={handleClick} className="bg-blue-600 text-white px-4 py-2 rounded">
      Pay ${amount}
    </button>
  );
};

export default PaymentComponent;
