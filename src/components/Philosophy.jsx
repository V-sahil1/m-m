import { philosophyNotes } from '../data.js';

const quote = '“A quiet intersection where Scandinavian minimalism meets Kyoto tea culture.”';

export default function Philosophy() {
  return (
    <section className="philosophy" id="philosophy">
      <div className="container">
        <div className="section-rule" data-reveal>
          <span className="section-rule__label">01 / Architecture &amp; Harmony</span>
          <span className="section-rule__line" />
        </div>
        <div className="philosophy__grid">
          <blockquote className="philosophy__quote" aria-label={quote}>
            {quote.split(' ').map((word, index) => (
              <span className="philosophy__word" aria-hidden="true" key={index}>
                {word}{' '}
              </span>
            ))}
          </blockquote>
          <div className="philosophy__notes" data-reveal-group>
            {philosophyNotes.map((note) => (
              <div className="note" key={note.title}>
                <p className="note__title">{note.title}</p>
                <p className="note__body">{note.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
