import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import Icon from './Icon.jsx';
import useActiveSection from '../hooks/useActiveSection.js';
import { navLinks } from '../data.js';

const sectionIds = navLinks.map((link) => link.id);

export default function Header({ revealed }) {
  const [navOpen, setNavOpen] = useState(false);
  const headerRef = useRef(null);
  const activeId = useActiveSection(sectionIds);

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  // Transparent over the hero, tinted once the page has scrolled
  // and slides away entirely as soon as the home screen starts to leave
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const hasHidden = useRef(false);
  useMotionValueEvent(scrollY, 'change', (y) => {
    const isPast = y > window.innerHeight * 0.15;
    if (isPast) {
      hasHidden.current = true;
      setNavOpen(false);
    }
    setScrolled(y > 40);
    setPastHero(isPast);
  });

  // Close the mobile panel on Escape or a click outside the header
  useEffect(() => {
    if (!navOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setNavOpen(false);
    };
    const onClick = (event) => {
      if (!headerRef.current.contains(event.target)) setNavOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('click', onClick);
    };
  }, [navOpen]);

  return (
    <motion.header
      className={`site-header${scrolled ? ' is-scrolled' : ''}`}
      ref={headerRef}
      initial={{ y: -80, opacity: 0 }}
      animate={revealed && !pastHero ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
      transition={{ duration: hasHidden.current ? 0.6 : 0.9, delay: hasHidden.current ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="site-header__inner">
        <a className="brand" href="#top">
          <span className="brand__name">Moss &amp; Mellow</span>
          <span className="brand__tag">Atelier</span>
        </a>

        <nav className={`site-nav${navOpen ? ' is-open' : ''}`} id="site-nav" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.id}
              className={`site-nav__link${activeId === link.id ? ' is-active' : ''}`}
              href={`#${link.id}`}
              onClick={() => setNavOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          <motion.a className="btn-pill" href="#reserve" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            Reserve Table
          </motion.a>
          <a className="icon-btn icon-btn--account" href="#reserve" aria-label="Guest Concierge">
            <Icon name="person" />
          </a>
          <button
            className="icon-btn icon-btn--menu"
            type="button"
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={navOpen}
            aria-controls="site-nav"
            onClick={() => setNavOpen((open) => !open)}
          >
            <Icon name={navOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
    </motion.header>
  );
}
