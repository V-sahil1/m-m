import Icon from './Icon.jsx';
import { philosophyNotes } from '../data.js';

const headline = ['A Quiet', 'Intersection', 'of Craft'];
const captions = ['Natural Light', 'Textured Materials', 'Quiet Spaces'];
const chapters = 4;

export default function Philosophy() {
  return (
    <section className="philosophy" id="philosophy">
      {/* Decorative leaf shadow in the bottom-left corner */}
      <svg className="philosophy__shade" viewBox="0 0 300 300" aria-hidden="true">
        <g className="philosophy__shade-sway">
          <path d="M20 290 C 70 220, 120 170, 190 120" />
          <ellipse cx="78" cy="214" rx="46" ry="15" transform="rotate(-58 78 214)" />
          <ellipse cx="126" cy="196" rx="42" ry="14" transform="rotate(-8 126 196)" />
          <ellipse cx="112" cy="150" rx="44" ry="14" transform="rotate(-70 112 150)" />
          <ellipse cx="170" cy="150" rx="40" ry="13" transform="rotate(-14 170 150)" />
          <ellipse cx="168" cy="102" rx="42" ry="13" transform="rotate(-62 168 102)" />
          <ellipse cx="42" cy="244" rx="36" ry="12" transform="rotate(-30 42 244)" />
        </g>
      </svg>

      <div className="container philosophy__inner">
        <div className="section-rule" data-reveal>
          <span className="section-rule__label">01 / Architecture &amp; Harmony</span>
          <span className="section-rule__line" />
        </div>

        <div className="philosophy__layout">
          {/* Headline overlaps the edge of the photograph */}
          <div className="philosophy__lead">
            <h2 className="philosophy__title" aria-label={headline.join(' ')}>
              {headline.map((line) => (
                <span className="philosophy__line" aria-hidden="true" key={line}>
                  {line}
                </span>
              ))}
            </h2>
            <p className="philosophy__text">
              Where Scandinavian minimalism meets Kyoto tea culture. Lime plaster, raw timber and filtered daylight shape a calm room where people slow down, connect and return to their daily rituals.
            </p>
            <a className="philosophy__cta" href="#spaces">
              Explore the Space <Icon name="arrow_forward" />
            </a>
          </div>

          <figure className="philosophy__media">
            <img
              src="/assets/images/hero.png"
              alt="Sunlit café interior with lime plaster walls, linen curtains and oak furniture"
              loading="lazy"
            />
            <figcaption className="philosophy__captions">
              {captions.map((caption) => (
                <span key={caption}>{caption}</span>
              ))}
            </figcaption>
          </figure>

          <div className="philosophy__notes">
            {philosophyNotes.map((note) => (
              <div className="note" key={note.title}>
                <p className="note__title">
                  {note.title} <span />
                </p>
                <p className="note__body">{note.body}</p>
              </div>
            ))}
          </div>

          {/* Chapter index down the right edge */}
          <div className="philosophy__index" aria-hidden="true">
            <span>01</span>
            <span className="philosophy__index-line" />
            {Array.from({ length: chapters }, (_, index) => (
              <span className={`philosophy__dot${index === 0 ? ' is-active' : ''}`} key={index} />
            ))}
            <span>{String(chapters).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Arc and caption in the bottom-right corner */}
      <div className="philosophy__detail" aria-hidden="true">
        <svg viewBox="0 0 220 70">
          <path className="philosophy__arc" d="M4 66 C 50 20, 130 0, 216 14" />
        </svg>
        <span>The beauty is in the details</span>
      </div>
    </section>
  );
}
