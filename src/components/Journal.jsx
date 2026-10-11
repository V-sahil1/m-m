import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import Icon from './Icon.jsx';
import { stories } from '../data.js';

// Time each story stays featured before the next takes its place
const AUTO_ADVANCE_MS = 7000;
// Below this width the featured story and the cards are stacked in one column (see styles.css)
const STACKED_QUERY = '(max-width: 1023.98px)';

const ease = [0.22, 1, 0.36, 1];
const pad = (number) => String(number).padStart(2, '0');

const layoutVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};

const rise = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

export default function Journal() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef(null);
  const leadRef = useRef(null);
  const inView = useInView(sectionRef, { amount: 0.4 });

  const total = stories.length;
  const featured = stories[active];
  // The stories waiting their turn, in the order they will be featured
  const upNext = stories.map((_, offset) => (active + 1 + offset) % total).slice(0, total - 1);

  const step = (direction) => setActive((index) => (index + direction + total) % total);

  // On narrow screens the cards sit far below the featured story, so choosing one
  // brings the page back up to where its title and photograph appear
  const choose = (index) => {
    setActive(index);
    if (!window.matchMedia(STACKED_QUERY).matches) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    leadRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  // Rotate through the stories while the section is on screen and not being hovered
  useEffect(() => {
    if (!inView || paused) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const timer = window.setTimeout(() => step(1), AUTO_ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [inView, paused, active]);

  return (
    <section
      className="journal"
      id="journal"
      ref={sectionRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div
        className="journal__layout"
        variants={layoutVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        {/* Lead column: numeral, title and summary of the featured story */}
        <motion.div className="journal__lead" ref={leadRef} variants={rise}>
          <p className="journal__eyebrow">
            Featured Stories <span />
          </p>

          <div className="journal__lead-body">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={featured.title}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.55, ease }}
              >
                <span className="journal__numeral">{pad(active + 1)}</span>
                <h2 className="journal__title">{featured.title}</h2>
                <p className="journal__text">{featured.body}</p>
                <a className="journal__more" href="#journal">
                  Read More <Icon name="arrow_forward" />
                </a>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="journal__pager">
            <motion.button type="button" aria-label="Previous story" onClick={() => step(-1)} whileTap={{ scale: 0.88 }}>
              <Icon name="west" />
            </motion.button>
            <span>{pad(active + 1)}</span>
            <span className="journal__pager-track">
              <motion.span
                key={`${active}-${paused || !inView}`}
                className="journal__pager-fill"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: paused || !inView ? 0 : 1 }}
                transition={{ duration: paused || !inView ? 0.2 : AUTO_ADVANCE_MS / 1000, ease: 'linear' }}
              />
            </span>
            <span>{pad(total)}</span>
            <motion.button type="button" aria-label="Next story" onClick={() => step(1)} whileTap={{ scale: 0.88 }}>
              <Icon name="east" />
            </motion.button>
          </div>
        </motion.div>

        {/* Large photograph of the featured story; each new one wipes in over the last */}
        <motion.div className="journal__feature" variants={rise}>
          <AnimatePresence initial={false}>
            <motion.img
              key={featured.image}
              src={featured.image}
              alt={featured.alt}
              initial={{ clipPath: 'inset(0% 0% 0% 100%)', scale: 1.18 }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.8 } }}
              transition={{ duration: 1.1, ease }}
            />
          </AnimatePresence>
        </motion.div>

        {/* The other stories; choosing one makes it the feature */}
        <div className="journal__cards">
          <AnimatePresence mode="popLayout" initial={false}>
            {upNext.map((index) => {
              const story = stories[index];
              return (
                <motion.article
                  layout
                  key={story.title}
                  className="journal-card"
                  variants={rise}
                  exit={{ opacity: 0, y: -24, transition: { duration: 0.35 } }}
                  whileHover={{ y: -6 }}
                  transition={{ layout: { duration: 0.7, ease } }}
                  onClick={() => choose(index)}
                >
                  <div className="journal-card__media">
                    <img src={story.image} alt={story.alt} loading="lazy" />
                  </div>
                  <span className="journal-card__label">
                    Chapter {pad(index + 1)} <i>·</i> {story.volume.split('· ')[1]}
                  </span>
                  <h3 className="journal-card__title">{story.title}</h3>
                  <p className="journal-card__text">{story.body}</p>
                  <button className="journal__more" type="button">
                    Read More <Icon name="arrow_forward" />
                  </button>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>

        <motion.div className="journal__rail" variants={rise} aria-hidden="true">
          <span>Real Moments · Good Food · Better Days</span>
          <motion.span
            className="journal__rail-mark"
            animate={{ rotate: [0, 8, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Icon name="spa" />
          </motion.span>
        </motion.div>
      </motion.div>
    </section>
  );
}
