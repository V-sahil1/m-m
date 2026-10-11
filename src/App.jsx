import { useRef, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import Preloader from './components/Preloader.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Philosophy from './components/Philosophy.jsx';
import Menu from './components/Menu.jsx';
import FoodStory from './components/FoodStory.jsx';
import Spaces from './components/Spaces.jsx';
import Journal from './components/Journal.jsx';
import Booking from './components/Booking.jsx';
import Footer from './components/Footer.jsx';
import usePageAnimations from './hooks/usePageAnimations.js';

export default function App() {
  const pageRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  usePageAnimations(pageRef, () => setRevealed(true));

  return (
    <MotionConfig reducedMotion="user">
      <div ref={pageRef}>
        <Preloader />
        <Header revealed={revealed} />
        <main id="top">
          <Hero revealed={revealed} />
          <Philosophy />
          <Menu />
          <FoodStory />
          <Spaces />
          <Journal />
          <Booking />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
