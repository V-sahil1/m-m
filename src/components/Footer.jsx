import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { footerLinks } from '../data.js';

const legalLinks = ['Privacy Notice', 'Terms', 'Press'];

const swap = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.3 },
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setJoined(true);
  };

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <p className="site-footer__name">Moss &amp; Mellow</p>
            <p className="site-footer__text site-footer__about">
              An architectural atelier &amp; slow culinary space dedicated to botanical provenance, tactile design, and organic pause.
            </p>
          </div>
          <div className="site-footer__hours">
            <p className="site-footer__label">Atelier &amp; Hours</p>
            <p className="site-footer__text site-footer__text--strong">Mon — Sun</p>
            <p className="site-footer__text site-footer__text--gap">07:30 — 18:00</p>
            <p className="site-footer__label">Locations</p>
            <p className="site-footer__text">74 Rue de Bellechasse, Paris</p>
            <p className="site-footer__text">Kingly Court, Carnaby, London</p>
          </div>
          <div className="site-footer__index">
            <p className="site-footer__label">Index</p>
            <ul>
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a href={`#${link.id}`}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="site-footer__dispatch">
            <p className="site-footer__label">Dispatch</p>
            <p className="site-footer__text site-footer__text--gap">
              Receive periodic editions, seasonal menu previews, and architectural reflections.
            </p>
            <AnimatePresence mode="wait" initial={false}>
              {joined ? (
                <motion.p key="thanks" className="dispatch__thanks" role="status" {...swap}>
                  Thank you — the next edition is yours.
                </motion.p>
              ) : (
                <motion.form key="form" className="dispatch" onSubmit={handleSubmit} {...swap}>
                <input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  aria-label="Your email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                  <button type="submit">Join</button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="site-footer__base">
          <p className="site-footer__text">© 2025 Moss &amp; Mellow Editions. All rights reserved.</p>
          <div className="site-footer__legal">
            {legalLinks.map((label) => (
              <a key={label} href="#" onClick={(event) => event.preventDefault()}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
