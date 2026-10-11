import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon.jsx';
import { bookingDates, bookingOptions, dateValue } from '../data.js';

// A table for today needs at least this much notice
const NOTICE_MINUTES = 30;

// The time groups still open on a date: today loses the slots that have already passed
function openTimeGroups(date) {
  const now = new Date();
  if (date !== dateValue(now)) return bookingOptions.timeGroups;

  const earliest = now.getHours() * 60 + now.getMinutes() + NOTICE_MINUTES;
  return bookingOptions.timeGroups
    .map((group) => ({ ...group, slots: group.slots.filter((slot) => slot.minutes >= earliest) }))
    .filter((group) => group.slots.length > 0);
}

export default function Booking() {
  // Real calendar days from today; today is left out once its last table time has passed
  const dates = useMemo(() => bookingDates().filter((option) => openTimeGroups(option.value).length > 0), []);

  const [form, setForm] = useState(() => ({
    date: dates[0].value,
    time: openTimeGroups(dates[0].value)[0].slots[0].value,
    party: bookingOptions.parties[1],
    name: '',
    email: '',
  }));
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [reference, setReference] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const confirmationRef = useRef(null);
  const sending = status === 'sending';

  const timeGroups = openTimeGroups(form.date);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => {
      const next = { ...current, [name]: value };
      // Switching to today can leave an earlier, already passed time selected
      if (name === 'date') {
        const slots = openTimeGroups(value).flatMap((group) => group.slots);
        if (slots.length > 0 && !slots.some((slot) => slot.value === next.time)) next.time = slots[0].value;
      }
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (sending) return;
    setStatus('sending');

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Something went wrong. Please try again.');

      setReference(result.reference);
      setStatus('sent');
    } catch (error) {
      // A failed fetch (server not running) has no useful message of its own
      setErrorMessage(
        error instanceof TypeError ? 'We could not reach the reservation desk. Please try again in a moment.' : error.message
      );
      setStatus('error');
    }
  };

  return (
    <section className="booking" id="booking">
      <div className="container">
        <div className="booking__statement" data-reveal>
          <span className="booking__eyebrow">An Open Invitation</span>
          <h2 className="booking__title">
            Slow down. Settle in.<br />
            <span>The kettle is on.</span>
          </h2>
        </div>

        {/* The reserve buttons link straight here, past the statement above */}
        <div className="reserve" id="reserve" data-reveal>
          <div className="reserve__head">
            <div>
              <h3 className="reserve__title">Reserve Your Pause</h3>
              <p className="reserve__sub">We hold quiet tables for morning tea ceremonies and light seasonal luncheons.</p>
            </div>
            <span className="reserve__tag">Table Service</span>
          </div>

          <form className="reserve__form" onSubmit={handleSubmit}>
            <div className="field-row field-row--3">
              <div className="field">
                <label htmlFor="booking-date">Preferred Date</label>
                <select id="booking-date" name="date" value={form.date} onChange={handleChange}>
                  {dates.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="booking-time">Service Time</label>
                <select id="booking-time" name="time" value={form.time} onChange={handleChange}>
                  {timeGroups.map((group) => (
                    <optgroup key={group.label} label={group.label}>
                      {group.slots.map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="booking-party">Party Size</label>
                <select id="booking-party" name="party" value={form.party} onChange={handleChange}>
                  {bookingOptions.parties.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field-row field-row--2">
              <div className="field">
                <label htmlFor="booking-name">Guest Name</label>
                <input
                  id="booking-name"
                  name="name"
                  type="text"
                  placeholder="e.g. S. Laurent"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="booking-email">Contact Email</label>
                <input
                  id="booking-email"
                  name="email"
                  type="email"
                  placeholder="name@domain.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="reserve__submit">
              <p>Walk-in bar seats are always reserved for spontaneous wanderers.</p>
              <motion.button className="btn btn--confirm" type="submit" disabled={sending} whileTap={{ scale: 0.97 }}>
                {sending ? 'Sending…' : 'Confirm Reservation'}
              </motion.button>
            </div>
          </form>

          <AnimatePresence>
            {(status === 'sent' || status === 'error') && (
              <motion.div
                key={status}
                className="confirmation-wrap"
                ref={confirmationRef}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                onAnimationComplete={() =>
                  confirmationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                }
              >
                {status === 'sent' ? (
                  <div className="confirmation" role="status">
                    <Icon name="verified" />
                    <div>
                      <p className="confirmation__title">Your table has been reserved.</p>
                      <p className="confirmation__body">
                        A confirmation has been sent to {form.email}. Reference {reference}.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="confirmation confirmation--error" role="alert">
                    <Icon name="error" />
                    <div>
                      <p className="confirmation__title">Your reservation was not sent.</p>
                      <p className="confirmation__body">{errorMessage}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
