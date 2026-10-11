import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon.jsx';
import { heroPhrases } from '../data.js';

// Time before the first swap (lets the intro finish) and between swaps
const FIRST_SWAP_MS = 4500;
const SWAP_INTERVAL_MS = 5200;

// Lines glide in from the right and leave to the left
const swapEase = [0.16, 1, 0.3, 1];
const swapVariants = {
  initial: { opacity: 0, x: '0.6em', filter: 'blur(12px)' },
  animate: (delay) => ({
    opacity: 1,
    x: '0em',
    filter: 'blur(0px)',
    transition: { duration: 1.4, delay, ease: swapEase },
  }),
  exit: (delay) => ({
    opacity: 0,
    x: '-0.6em',
    filter: 'blur(12px)',
    transition: { duration: 0.9, delay, ease: [0.7, 0, 0.84, 0] },
  }),
};
const swap = { variants: swapVariants, initial: 'initial', animate: 'animate', exit: 'exit' };

export default function Hero({ revealed }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const phrase = heroPhrases[phraseIndex];
  const videoRef = useRef(null);

  // Visitors who ask for reduced motion get the still poster image instead of the moving video
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      videoRef.current.pause();
    }
  }, []);

  useEffect(() => {
    if (!revealed) return undefined;

    let interval;
    const next = () => setPhraseIndex((index) => (index + 1) % heroPhrases.length);
    const start = window.setTimeout(() => {
      next();
      interval = window.setInterval(next, SWAP_INTERVAL_MS);
    }, FIRST_SWAP_MS);

    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [revealed]);

  return (
    <section className="hero">
      <div className="hero__wrap">
        <div className="hero__canvas">
          <div className="hero__media">
            <video
              ref={videoRef}
              className="hero__bg"
              src="/assets/images/gemini_generated_video_3a83e969.mp4"
              poster="/assets/images/hero.png"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
            />
            <div className="hero__wash hero__wash--bottom" />
            <div className="hero__wash hero__wash--left" />
            <div className="hero__wash hero__wash--top" />
          </div>

          <div className="hero__content">
            <div className="hero__grid">
              <div className="hero__copy">
                <p className="hero__eyebrow">Botanical Sanctuary &amp; Micro-Roastery</p>
                <h1 className="hero__title">
                  <span className="hero__line">Find your</span>
                  <span className="hero__line">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={phrase.accent}
                        className="hero__swap hero__title-accent"
                        {...swap}
                        custom={0}
                      >
                        {phrase.accent}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span className="hero__line">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={phrase.close}
                        className="hero__swap"
                        {...swap}
                        custom={0.12}
                      >
                        {phrase.lead} <span className="hero__title-calm">{phrase.close}</span>
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </h1>
                <p className="hero__lede">
                  Designed as an antidote to urban velocity. Seasonal single-origin espresso, ceremonial grade matcha, wild ferment sourdough, and tactile mid-century forms bathed in morning light.
                </p>
              </div>

              <div className="hero__aside">
                <div className="specimen">
                  <div className="specimen__head">
                    <span>Spatial Metric</span>
                    <span className="specimen__fig">FIG. 01</span>
                  </div>
                  <p className="specimen__body">
                    Filtered natural daylight through unbleached Belgian linen scrims, calibrated for contemplative tea &amp; coffee rituals.
                  </p>
                  <div className="specimen__foot">
                    <span>Temp: 92°C Extraction</span>
                    <span>Sound: 42 dBA</span>
                  </div>
                </div>

                <div className="hero__cta">
                  <a className="btn btn--hero" href="#booking">Reserve a Table</a>
                  <a className="link-arrow link-arrow--hero" href="#menu">
                    <span>Autumn Menu</span>
                    <Icon name="arrow_forward" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="hero__status">
            <div className="hero__status-left">
              <span>Paris · London</span>
              <span className="show-md">Ceremonial Uji Cultivars</span>
              <span className="show-lg">Nordic Light Roasting</span>
            </div>
            <div className="hero__status-right">
              <Icon name="filter_vintage" />
              <span>Issue No. 04 — Autumn Monograph</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
