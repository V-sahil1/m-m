import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// How many pixels of scrolling move the Spaces track one pixel sideways
const SPACES_SCROLL_RATIO = 1.9;

// Longest the loading screen waits for web fonts before opening anyway
const FONT_TIMEOUT_MS = 4000;

// GSAP: loading screen, hero intro timeline, hero parallax and scroll-triggered reveals.
// onReveal fires the moment the loading screen starts to open.
export default function usePageAnimations(scope, onReveal) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const root = document.documentElement;

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Elements below are moved by percentages of their own size. If a stale transform is
        // still on one of them when its tween is created (the setup runs twice in React's
        // development mode), GSAP reads it as an extra pixel offset that the tween never
        // removes, leaving the element parked off-centre. Zero the pixel offsets first.
        gsap.set('.hero__line, .hero__bg, .plate__line, .plate__media img', { x: 0, y: 0 });

        // The zoom-out is anchored to the top of the page, so start there
        if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
        window.scrollTo(0, 0);
        root.classList.add('is-loading');

        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // The timeline holds on the logo until the fonts are in
        let fontsReady = false;
        let holding = false;
        const release = () => {
          fontsReady = true;
          if (holding) intro.play();
        };
        const fontTimer = window.setTimeout(release, FONT_TIMEOUT_MS);
        if (document.fonts) document.fonts.ready.then(release);
        else release();

        intro
          // Loading screen: logo in, hold, logo out
          .from('.preloader__mark', { opacity: 0, y: 24, scale: 0.9, duration: 0.9 })
          .from('.preloader__word', { opacity: 0, letterSpacing: '0.6em', duration: 0.9 }, '-=0.5')
          .to({}, { duration: 0.5 })
          .addPause('+=0', () => {
            holding = true;
            if (fontsReady) gsap.delayedCall(0.01, () => intro.play());
          })
          .to('.preloader__logo', { opacity: 0, y: -16, duration: 0.5, ease: 'power2.in' })

          // The cover splits down the middle and the site zooms out into place
          .addLabel('open')
          .call(() => onReveal?.(), null, 'open')
          .to('.preloader__panel--left', { xPercent: -100, duration: 1.3, ease: 'power4.inOut' }, 'open')
          .to('.preloader__panel--right', { xPercent: 100, duration: 1.3, ease: 'power4.inOut' }, 'open')
          .fromTo(
            'main',
            { scale: 1.18, transformOrigin: '50% 50vh' },
            { scale: 1, duration: 1.8, ease: 'power3.out', clearProps: 'transform,transformOrigin' },
            'open'
          )
          .set('.preloader', { display: 'none' }, 'open+=1.3')
          .call(
            () => {
              root.classList.remove('is-loading');
              ScrollTrigger.refresh();
            },
            null,
            'open+=1.8'
          )

          // Hero intro
          .fromTo(
            '.hero__bg',
            { scale: 1.35, opacity: 0, filter: 'blur(14px)' },
            {
              scale: 1.08,
              opacity: 1,
              filter: 'blur(0px)',
              clearProps: 'filter',
              duration: 2.6,
              ease: 'power2.out',
            },
            'open'
          )
          .from('.hero__eyebrow', { opacity: 0, y: 20, duration: 0.8 }, 'open+=0.7')
          .from('.hero__line', { opacity: 0, yPercent: 60, duration: 1.1, stagger: 0.12 }, 'open+=0.8')
          .from('.hero__lede', { opacity: 0, y: 24, duration: 0.9 }, 'open+=1.3')
          .from('.specimen', { opacity: 0, x: 32, duration: 0.9 }, 'open+=1.4')
          .from('.hero__cta', { opacity: 0, y: 16, duration: 0.8 }, 'open+=1.55')
          .from('.hero__status', { opacity: 0, duration: 0.8 }, 'open+=1.75');

        // Hero video drifts slightly as the page scrolls
        gsap.to('.hero__bg', {
          yPercent: 3,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
        });

        // The hero holds in place and recedes while the next section slides up over it
        gsap.to('.hero__wrap', {
          scale: 0.92,
          opacity: 0.55,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'bottom bottom',
            end: '+=100%',
            pin: true,
            pinSpacing: false,
            scrub: true,
          },
        });

        // The philosophy sheet rises with rounded corners that flatten as it lands
        gsap.fromTo(
          '.philosophy',
          { borderTopLeftRadius: '3rem', borderTopRightRadius: '3rem' },
          {
            borderTopLeftRadius: '0rem',
            borderTopRightRadius: '0rem',
            ease: 'none',
            scrollTrigger: { trigger: '.philosophy', start: 'top bottom', end: 'top top', scrub: true },
          }
        );

        // The quote lights up word by word as it scrolls into view
        gsap.fromTo(
          '.philosophy__word',
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: { trigger: '.philosophy__quote', start: 'top 85%', end: 'top 30%', scrub: true },
          }
        );

        // Single elements rise into view
        gsap.utils.toArray('[data-reveal]').forEach((element) => {
          gsap.from(element, {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 85%', once: true },
          });
        });

        // Children of a group rise in sequence
        gsap.utils.toArray('[data-reveal-group]').forEach((group) => {
          gsap.from(group.children, {
            opacity: 0,
            y: 32,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: group, start: 'top 85%', once: true },
          });
        });

        // Hairline rule draws from the left
        gsap.from('.section-rule__line', {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.4,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: '.section-rule', start: 'top 85%', once: true },
        });

        // Food story: the section holds while five full-screen plates wipe in one by one from the right
        const reel = scope.current.querySelector('.story-reel');
        const plates = gsap.utils.toArray('.plate');
        const media = (plate) => plate.querySelector('.plate__media');
        const photo = (plate) => plate.querySelector('.plate__media img');
        const lines = (plate) => plate.querySelectorAll('.plate__line');
        const small = (plate) => plate.querySelectorAll('.plate__small');
        // Arrivals animate the individual lines; departures animate these two wrappers instead.
        // Keeping them on different elements means no two tweens ever fight over the same
        // property, which previously could leave a name visible but parked off to the right.
        const blocks = (plate) => plate.querySelectorAll('.plate__title, .plate__foot');
        const closed = 'inset(0% 0% 0% 100%)';
        const open = 'inset(0% 0% 0% 0%)';

        reel.classList.add('is-pinned');

        // The first plate's type glides in while the section scrolls up into place
        const approach = { trigger: reel, start: 'top 85%', end: 'top top', scrub: true };
        gsap.from(photo(plates[0]), { scale: 1.3, ease: 'none', scrollTrigger: approach });
        gsap.from(lines(plates[0]), { xPercent: 60, opacity: 0, stagger: 0.12, ease: 'none', scrollTrigger: approach });
        gsap.from(small(plates[0]), { x: 80, opacity: 0, stagger: 0.08, ease: 'none', scrollTrigger: approach });

        const reelTimeline = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: reel,
            start: 'top top',
            end: '+=400%',
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            refreshPriority: 1,
          },
        });

        reelTimeline.to({}, { duration: 0.4 });
        plates.slice(1).forEach((plate, index) => {
          const previous = plates[index];
          const label = 'plate' + (index + 1);

          reelTimeline
            .addLabel(label)
            // the type on screen drifts out to the left
            .to(blocks(previous), { x: -120, autoAlpha: 0, duration: 0.6, stagger: 0.08 }, label)
            // the next photograph wipes across from the right edge
            .fromTo(media(plate), { clipPath: closed }, { clipPath: open, duration: 1 }, label)
            .fromTo(photo(plate), { scale: 1.35, xPercent: 8 }, { scale: 1, xPercent: 0, duration: 1 }, label)
            // then its name, line by line, and the small type
            .fromTo(
              lines(plate),
              { xPercent: 60, autoAlpha: 0 },
              { xPercent: 0, autoAlpha: 1, duration: 0.9, stagger: 0.12 },
              label + '+=0.3'
            )
            .fromTo(
              small(plate),
              { x: 80, autoAlpha: 0 },
              { x: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08 },
              label + '+=0.45'
            )
            .to({}, { duration: 0.5 });
        });
        reelTimeline.fromTo(
          '.story-reel__bar',
          { scaleX: 1 / plates.length },
          { scaleX: 1, ease: 'none', duration: reelTimeline.duration() },
          0
        );

        return () => {
          window.clearTimeout(fontTimer);
          root.classList.remove('is-loading');
          reel.classList.remove('is-pinned');
        };
      });

      // Spaces on wide screens: the section holds while its panels travel sideways
      mm.add('(prefers-reduced-motion: no-preference) and (min-width: 1024px)', () => {
        const section = scope.current.querySelector('.spaces');
        const track = section.querySelector('.spaces__track');
        section.classList.add('is-horizontal');

        // Same guard as above for the percentage-moved elements in this section
        gsap.set('.spaces__line, .room__line, .room__label, .room__media img, .bloom', { x: 0, y: 0 });

        // offsetWidth, not scrollWidth: blossoms overhanging the last panel must not lengthen the journey
        const distance = () => track.offsetWidth - window.innerWidth;
        const scrollTween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            // more scrolling per panel than the track is wide, so the journey is unhurried
            end: () => '+=' + distance() * SPACES_SCROLL_RATIO,
            pin: true,
            scrub: 1.2,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 1,
          },
        });
        const within = (trigger, start, end) => ({ trigger, containerAnimation: scrollTween, start, end, scrub: true });

        // Cover panel assembles while the section scrolls up into place
        const approach = { trigger: section, start: 'top 85%', end: 'top top', scrub: true };
        gsap.from('.spaces__line', {
          xPercent: (index) => (index % 2 ? 35 : -35),
          opacity: 0,
          ease: 'none',
          scrollTrigger: approach,
        });
        gsap.fromTo(
          '.spaces__tall',
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: approach }
        );
        gsap.from('.spaces__tall img', { scale: 1.3, ease: 'none', scrollTrigger: approach });
        // Blossoms on the first panel grow in from their corners as the section arrives
        gsap.from('.bloom--first-bottom-left', {
          yPercent: 45,
          rotation: -14,
          opacity: 0,
          transformOrigin: '0% 100%',
          ease: 'none',
          scrollTrigger: approach,
        });
        gsap.from('.bloom--first-top-right', {
          yPercent: -45,
          rotation: 10,
          opacity: 0,
          transformOrigin: '100% 0%',
          ease: 'none',
          scrollTrigger: approach,
        });

        // As the track moves, the middle headline line and the corner blossom travel at their own pace
        gsap.to('.spaces__line--b', { x: -140, ease: 'none', scrollTrigger: within('.spaces__intro', 'left left', 'right left') });
        gsap.to('.bloom--first-bottom-left', { x: 200, ease: 'none', scrollTrigger: within('.spaces__intro', 'left left', 'right left') });

        // First panel, top right: starts fading the moment the track moves and is gone
        // once the second panel covers 40% of the screen. Scrolling back reverses it.
        gsap.to('.bloom--first-top-right .bloom__flip', {
          opacity: 0,
          ease: 'none',
          scrollTrigger: within('.spaces__intro', 'left left', 'right 60%'),
        });

        // Last panel: its blossoms fade in from the moment it enters and are fully
        // there once 80% of the panel is on screen. Scrolling back reverses it.
        const lastPanel = scope.current.querySelector('.materials');
        const lastIn = () => 'left ' + Math.round(window.innerWidth - lastPanel.offsetWidth * 0.8) + 'px';
        gsap.fromTo(
          '.bloom--last-top-left',
          { opacity: 0, yPercent: -30 },
          { opacity: 1, yPercent: 0, ease: 'none', scrollTrigger: within(lastPanel, 'left right', lastIn) }
        );
        gsap.fromTo(
          '.bloom--last-bottom-right',
          { opacity: 0, yPercent: 30 },
          { opacity: 1, yPercent: 0, ease: 'none', scrollTrigger: within(lastPanel, 'left right', lastIn) }
        );

        // Each room: photograph wipes open from the right, its name slides in, the image drifts in its frame
        gsap.utils.toArray('.room').forEach((room) => {
          gsap.fromTo(
            room.querySelector('.room__media'),
            { clipPath: 'inset(0% 0% 0% 100%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: within(room, 'left 95%', 'left 55%') }
          );
          gsap.fromTo(
            room.querySelector('.room__media img'),
            { xPercent: -6 },
            { xPercent: 6, ease: 'none', scrollTrigger: within(room, 'left right', 'right left') }
          );
          gsap.from(room.querySelectorAll('.room__label, .room__line'), {
            xPercent: 45,
            opacity: 0,
            stagger: 0.15,
            ease: 'none',
            scrollTrigger: within(room, 'left 90%', 'left 40%'),
          });
        });

        gsap.from('.materials > :not(.bloom)', {
          y: 40,
          opacity: 0,
          stagger: 0.15,
          ease: 'none',
          scrollTrigger: within('.materials', 'left 90%', 'left 58%'),
        });

        return () => section.classList.remove('is-horizontal');
      });

      // Spaces on narrow screens: panels stack and rise in as they are reached
      mm.add('(prefers-reduced-motion: no-preference) and (max-width: 1023.98px)', () => {
        gsap.utils.toArray('.spaces__panel').forEach((panel) => {
          gsap.from(panel.children, {
            opacity: 0,
            y: 32,
            duration: 0.9,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: panel, start: 'top 80%', once: true },
          });
        });
      });

      // Reduced motion: the cover simply fades away
      mm.add('(prefers-reduced-motion: reduce)', () => {
        onReveal?.();
        gsap.to('.preloader', { autoAlpha: 0, duration: 0.4, delay: 0.6 });
      });
    },
    { scope }
  );
}
