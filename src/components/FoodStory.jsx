import { storyPlates } from '../data.js';

const total = String(storyPlates.length).padStart(2, '0');

export default function FoodStory() {
  return (
    <section className="story-reel" id="table">
      <div className="story-reel__head">
        <span>The Table · A Day in Five Plates</span>
        <span className="story-reel__hint">Scroll</span>
      </div>

      <div className="story-reel__stage">
        {storyPlates.map((plate, index) => (
          <article className="plate" key={plate.name + plate.accent}>
            {/* The photograph fills the whole stage behind the type */}
            <div className="plate__media">
              <img src={plate.image} alt={plate.alt} loading="lazy" />
            </div>

            <div className="plate__copy">
              <div className="plate__title">
                <span className="plate__time plate__small">{plate.time}</span>
                <h3 className="plate__name">
                  <span className="plate__line">{plate.name}</span>
                  <span className="plate__line plate__line--accent">{plate.accent}</span>
                </h3>
              </div>

              <div className="plate__foot">
                <span className="plate__index plate__small">
                  {String(index + 1).padStart(2, '0')} <i>/ {total}</i>
                </span>
                <p className="plate__text plate__small">{plate.text}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="story-reel__progress">
        <span className="story-reel__bar" />
      </div>
    </section>
  );
}
