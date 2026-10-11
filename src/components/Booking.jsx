import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon.jsx';
import { bookingOptions } from '../data.js';

export default function Booking() {
  const [form, setForm] = useState({
    date: bookingOptions.dates[0],
    time: bookingOptions.times[0],
    party: bookingOptions.parties[1],
    name: '',
    email: '',
  });
  const [confirmed, setConfirmed] = useState(false);
  const confirmationRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setConfirmed(true);
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

        <div className="reserve" data-reveal>
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
                  {bookingOptions.dates.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="booking-time">Service Time</label>
                <select id="booking-time" name="time" value={form.time} onChange={handleChange}>
                  {bookingOptions.times.map((option) => (
                    <option key={option}>{option}</option>
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
              <motion.button className="btn btn--confirm" type="submit" whileTap={{ scale: 0.97 }}>
                Confirm Reservation
              </motion.button>
            </div>
          </form>

          <AnimatePresence>
            {confirmed && (
              <motion.div
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
                <div className="confirmation" role="status">
                  <Icon name="verified" />
                  <div>
                    <p className="confirmation__title">Your table has been reserved.</p>
                    <p className="confirmation__body">A confirmation dispatch and tasting preview have been sent to your email.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
