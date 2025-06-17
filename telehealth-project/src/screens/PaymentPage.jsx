import { loadStripe }       from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

/* ---------- wrapper ---------- */
const stripePromise = loadStripe("pk_test_51Raf7gQtXfSnezAmnCr4diWNjGNmedddOovoglIXBZVYxXkhEffmnHcxxOxk1mPkjJQow9J1NZuxoToT5b4udh8A00JueDiiIl");   // <-- your pub key

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { doctor, patient, appointmentDate, amount } = location.state || {};

  if (!doctor || !patient) return <p>Missing info…</p>;

  const options = { appearance: { theme: "stripe" } };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm
        doctor={doctor}
        patient={patient}
        appointmentDate={appointmentDate}
        amount={amount}
        onSuccess={() => navigate("/appointments")}
      />
    </Elements>
  );
}

/* ---------- inner form ---------- */
function CheckoutForm({ doctor, patient, appointmentDate, amount, onSuccess }) {
  const stripe   = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState("");

  const pay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const amountInPaisa = Math.round(parseFloat(amount) * 100);  // Convert PKR to paisa
    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };

    const formattedAppointmentDate = formatDate(appointmentDate);

    console.log({
        amount: amountInPaisa,
        doctor_id: doctor.id,
        patient_id: patient.id,
        appointment_date: formattedAppointmentDate
    });

    try {
      /* 1. ask Laravel for a client_secret */
      const { data } = await axios.post(
        "http://127.0.0.1:8000/api/payments/create-intent",
        {
          amount: amountInPaisa,                        // paisa (PKR)
          doctor_id: doctor.id,
          patient_id: patient.id,
          appointment_date: formattedAppointmentDate,
        }
      );

      /* 2. confirm card */
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        { payment_method: { card: elements.getElement(CardElement) } }
      );

      if (error) throw error;

      /* 3. tell Laravel payment succeeded */
      await axios.post("http://127.0.0.1:8000/api/payments/confirm", {
        payment_intent_id: paymentIntent.id,
      });

      onSuccess();
    } catch (err) {
      console.error(err);
      setMsg(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={pay} className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Pay PKR {amount }</h2>

        <CardElement className="p-4 border rounded mb-4" />


      {msg && <p className="text-red-600 mb-3">{msg}</p>}

      <button
        disabled={!stripe || loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Processing…" : "Pay"}
      </button>
    </form>
  );
}
