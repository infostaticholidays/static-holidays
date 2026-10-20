
import { Link } from "react-router-dom";

export default function CancellationPolicy() {
  return (
    <div className="cp-page">
      <style>{`
        .cp-page {
          --green: #286442;
          --dark-green: #1d472f;
          --pale-green: #edf4ed;
          color: #26352b;
          font-family: Inter, system-ui, sans-serif;
          line-height: 1.7;
          background: #fff;
          min-height: 100vh;
        }
        .cp-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 18px 6%;
          border-bottom: 1px solid #e4ebe5;
        }
        .cp-brand {
          color: var(--dark-green);
          text-decoration: none;
          font-size: 1.35rem;
          font-weight: 800;
        }
        .cp-nav a:not(.cp-brand) {
          color: var(--dark-green);
          text-decoration: none;
          font-weight: 600;
        }
        .cp-hero {
          background: var(--pale-green);
          text-align: center;
          padding: 58px 20px;
        }
        .cp-hero h1 {
          color: var(--dark-green);
          font-size: clamp(2rem, 5vw, 3rem);
          line-height: 1.2;
          margin: 0 0 14px;
        }
        .cp-hero p {
          max-width: 680px;
          margin: 0 auto;
        }
        .cp-content {
          max-width: 850px;
          margin: 0 auto;
          padding: 42px 22px 65px;
        }
        .cp-content h2 {
          color: var(--dark-green);
          font-size: 1.35rem;
          margin-top: 34px;
          margin-bottom: 10px;
        }
        .cp-content a {
          color: var(--green);
          font-weight: 600;
        }
        .cp-note {
          background: var(--pale-green);
          border-left: 4px solid var(--green);
          border-radius: 6px;
          padding: 16px 20px;
          margin: 24px 0;
        }
        .cp-footer {
          background: var(--dark-green);
          color: #fff;
          padding: 30px 6%;
          text-align: center;
        }
        .cp-footer p { margin: 6px 0; }
        .cp-footer a {
          color: #fff;
          text-decoration: none;
          margin: 0 8px;
        }
        @media (max-width: 600px) {
          .cp-nav { padding: 16px 5%; flex-wrap: wrap; }
          .cp-content { padding: 30px 20px 45px; }
          .cp-footer a {
            display: inline-block;
            margin: 5px 8px;
          }
        }
      `}</style>

      <header className="cp-nav">
        <Link to="/" className="cp-brand">
          Static Holidays
        </Link>
        <nav>
          <Link to="/properties">Explore stays</Link>
        </nav>
      </header>

      <section className="cp-hero">
        <h1>Cancellation Policy</h1>
        <p>
          Clear information about booking cancellations,
          deposits, missed payments and property owner
          cancellations.
        </p>
      </section>

      <main className="cp-content">
        <p>
          This policy explains how cancellations relating to
          bookings advertised through Static Holidays are
          handled. Please read it alongside the cancellation
          conditions shown for your individual booking.
        </p>

        <div className="cp-note">
          <strong>Important:</strong> Static Holidays is a
          third-party platform connecting guests with independent
          holiday property owners. We do not own or provide the
          accommodation and do not ourselves authorise, issue or
          process refunds. Refund requests must be directed to
          the party responsible under the booking and payment
          arrangements.
        </div>

        <h2>1. Our role as a third-party platform</h2>
        <p>
          Static Holidays provides an online platform through
          which guests can discover holiday accommodation offered
          by independent property owners.
        </p>
        <p>
          Unless expressly stated otherwise in your booking
          documents, the accommodation is provided by the
          relevant property owner, who is responsible for the
          property, its house rules and the accommodation
          agreement.
        </p>
        <p>
          Static Holidays does not itself decide whether a
          property owner must issue a refund and does not issue
          refunds on the owner's behalf. We may assist with
          communication where appropriate, but we cannot
          guarantee the outcome of a cancellation or refund
          request.
        </p>
        <p>
          Nothing in this policy excludes any responsibility
          or legal obligation that applies to Static Holidays
          itself.
        </p>

        <h2>2. Cancellation terms for individual bookings</h2>
        <p>
          Each property or booking may have its own cancellation
          conditions. These should be made available before a
          guest confirms a booking and may specify notice
          periods, payment deadlines and the amounts that may
          be retained following cancellation.
        </p>
        <p>
          Guests are responsible for reading these conditions
          before booking. The applicable terms must be clear
          and consistent with consumer law. If a term conflicts
          with a legal right that cannot be excluded, that
          legal right will continue to apply.
        </p>

        <h2>3. If a guest cancels</h2>
        <p>
          If you need to cancel, notify the property owner or
          the contact identified in your booking confirmation
          as soon as possible. Follow any cancellation
          procedure stated in your booking documents.
        </p>
        <p>
          Whether any payment is refundable depends on the
          agreed cancellation terms, the circumstances and
          applicable law. A cancellation may result in the loss
          of some or all of a deposit or other payment where
          this is permitted by the applicable terms and law.
        </p>
        <p>
          A deposit described as non-refundable is not
          automatically retainable in every circumstance.
          Cancellation charges and retained deposits must
          comply with applicable consumer law.
        </p>

        <h2>4. Deposits</h2>
        <p>
          Deposit amounts, payment dates and the circumstances
          in which a deposit may be retained should be stated
          in the individual booking terms before payment.
        </p>
        <p>
          Where a guest cancels or breaches the booking
          agreement, the property owner or other responsible
          contracting party may retain an amount only to the
          extent permitted by the agreed terms and applicable
          law. Any retained amount must not be unfair or
          disproportionate.
        </p>
        <p>
          Static Holidays does not hold, release or refund a
          deposit unless the booking documents expressly state
          that we perform that role. Guests should contact the
          responsible party identified in their booking
          confirmation about deposit disputes.
        </p>

        <h2>5. Missed payments and unpaid balances</h2>
        <p>
          Guests must pay the deposit and any remaining balance
          by the deadlines stated in their booking confirmation.
          If a payment is missed, contact the property owner
          or the relevant payment contact promptly to discuss
          resolving it.
        </p>
        <p>
          Subject to the booking terms and applicable law, an
          owner may be entitled to give notice, cancel a
          reservation or seek payment that is properly due
          where a guest fails to pay on time.
        </p>
        <p>
          If the booking is cancelled because of non-payment,
          the consequences for any deposit or previous payment
          will be determined by the applicable booking terms
          and law. Any amount retained or charged must be
          lawful and proportionate. A guest will not
          automatically be liable for every outstanding
          instalment simply because a booking is cancelled.
        </p>
        <p>
          Static Holidays does not itself collect overdue
          balances or decide what a property owner may
          lawfully retain.
        </p>

        <h2>6. If a property owner cancels</h2>
        <p>
          If the property owner cancels your confirmed booking,
          contact the owner or the responsible payment provider
          identified in your booking confirmation to establish
          what happens next.
        </p>
        <p>
          Where a full refund is legally or contractually due,
          the party responsible for providing that refund must
          arrange it. The amount and timing will depend on
          the booking agreement, payment arrangements and
          applicable law.
        </p>
        <p>
          Static Holidays does not itself issue the refund or
          guarantee alternative accommodation. We may assist
          with communication where appropriate, but guests
          should raise refund requests directly with the
          responsible party.
        </p>
        <p>
          Nothing in this section removes any legal rights a
          guest may have if accommodation is cancelled or
          cannot be provided.
        </p>

        <h2>7. Property rules and serious breaches</h2>
        <p>
          Property owners may set reasonable house rules
          covering matters such as maximum occupancy, pets,
          smoking, parties, noise, use of facilities and
          check-in or check-out times. These rules should be
          communicated before booking.
        </p>
        <p>
          Guests must comply with the applicable house rules
          and take reasonable care of the property. If a guest
          seriously breaches the booking agreement, the owner
          may take action permitted by that agreement and
          applicable law. This may include requiring the guest
          to leave where lawful and appropriate.
        </p>
        <p>
          A guest who is required to leave may not be entitled
          to a full refund, depending on the circumstances and
          the applicable terms. However, loss of all payments
          is not automatic: any amount retained must be
          legally justified and proportionate.
        </p>
        <p>
          Static Holidays does not itself evict guests or
          determine a property's owner's entitlement to retain
          payments.
        </p>

        <h2>8. Requests to change a booking</h2>
        <p>
          Requests to change dates, guest numbers or other
          booking details should be sent to the property owner
          or the contact stated in the booking confirmation.
          Changes depend on availability, the owner's
          agreement and any additional charges properly
          disclosed.
        </p>
        <p>
          A change is not confirmed until the responsible
          party confirms it in writing. If a requested change
          cannot be agreed, the original booking terms will
          generally continue to apply unless the booking is
          cancelled or otherwise varied in accordance with
          those terms and applicable law.
        </p>

        <h2>9. Unexpected events and travel insurance</h2>
        <p>
          If illness, travel disruption, severe weather or
          another unexpected event affects your plans, contact
          the property owner or relevant booking contact as
          soon as possible.
        </p>
        <p>
          Such events do not automatically guarantee a refund.
          The outcome depends on the booking terms, the facts
          and applicable law. Guests may wish to consider
          suitable travel insurance that covers cancellation
          and interruption.
        </p>

        <h2>10. Refund enquiries and payment disputes</h2>
        <p>
          Static Holidays does not itself issue or process
          refunds. Please use your booking confirmation to
          identify the property owner, contracting party or
          payment provider responsible for handling your
          request.
        </p>
        <p>
          If you believe an amount has been retained
          incorrectly, ask the responsible party to explain
          the basis for its decision. You may also seek
          independent consumer advice or use any applicable
          dispute-resolution or payment-provider process.
        </p>
        <p>
          You can contact Static Holidays at
          {" "}
          <a href="mailto:infostaticholidays@gmail.com">
            infostaticholidays@gmail.com
          </a>
          {" "}
          if you need help identifying the relevant contact
          or communicating with a property owner. Contacting
          us does not mean that we can authorise or provide
          a refund.
        </p>

        <h2>11. Your legal rights</h2>
        <p>
          Nothing in this policy is intended to exclude or
          restrict any statutory rights or legal remedies
          that cannot lawfully be excluded or restricted.
          Consumer contract terms must be transparent and
          fair. If a term is legally unenforceable, this
          does not make an otherwise valid legal right
          disappear.
        </p>

        <h2>12. Related policies</h2>
        <p>
          Please also read our{" "}
          <Link to="/booking-terms">
            Booking Terms &amp; Conditions
          </Link>
          {" "}and{" "}
          <Link to="/privacy-policy">
            Privacy Policy
          </Link>.
        </p>
      </main>

      <footer className="cp-footer">
        <p><strong>Static Holidays</strong></p>
        <p>Find your next place to stay.</p>
        <p>
          <Link to="/properties">Explore stays</Link>
          <Link to="/booking-terms">Booking Terms</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/contact">Contact</Link>
        </p>
        <p>© {new Date().getFullYear()} Static Holidays</p>
      </footer>
    </div>
  );
}
