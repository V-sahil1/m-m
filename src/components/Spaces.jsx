import Icon from './Icon.jsx';
import Bloom from './Bloom.jsx';
import { galleryFrames, materialSpecs } from '../data.js';

export default function Spaces() {
  return (
    <section className="spaces" id="spaces">
      <div className="spaces__track">
        {/* Cover panel: staggered headline overlapping a tall photograph */}
        <div className="spaces__panel spaces__intro">
          <div className="spaces__rail">
            <span className="spaces__rail-line" />
            <span>{String(galleryFrames.length).padStart(2, '0')}</span>
          </div>
          <p className="spaces__eyebrow">Architectural Spatial Study</p>

          <h2 className="spaces__title" aria-label="Spaces carved from light">
            <span className="spaces__line spaces__line--a" aria-hidden="true">Spaces</span>
            <span className="spaces__line spaces__line--b" aria-hidden="true">
              <em>carved from</em>
            </span>
            <span className="spaces__line spaces__line--c" aria-hidden="true">light</span>
          </h2>
          <span className="spaces__place">Paris · London</span>

          <div className="spaces__tall">
            <img
              src="/assets/images/space-lanterns.jpg"
              alt="Woven rattan pendant lamps hanging at different heights from a pale ceiling"
              loading="lazy"
            />
          </div>

          <p className="spaces__intro-text">
            Every corner of Moss &amp; Mellow was constructed in quiet collaboration with architectural studio Atelier Nō. No shiny polymers, no synthetic gloss—purely tactile, earthen matter.
          </p>

          <Bloom variant="first-bottom-left" />
          <Bloom variant="first-top-right" />
        </div>

        {galleryFrames.map((frame) => (
          <article className="spaces__panel room" key={frame.key}>
            <div className="room__media">
              <img src={frame.image} alt={frame.alt} loading="lazy" />
            </div>
            <div className="room__copy">
              <span className="room__label">
                {frame.code} · {frame.label}
              </span>
              <h3 className="room__name" aria-label={frame.title}>
                {frame.lines.map((line) => (
                  <span className="room__line" aria-hidden="true" key={line}>
                    {line}
                  </span>
                ))}
              </h3>
            </div>
          </article>
        ))}

        <div className="spaces__panel materials">
          <Bloom variant="last-top-left" />
          <Bloom variant="last-bottom-right" />
          <p className="materials__eyebrow">Material Index</p>
          {materialSpecs.map((spec) => (
            <div className="spec" key={spec.title}>
              <Icon name={spec.icon} />
              <div>
                <p className="spec__label">{spec.label}</p>
                <p className="spec__title">{spec.title}</p>
                <p className="spec__body">{spec.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
