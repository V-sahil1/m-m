import { menuItems } from '../data.js';

export default function Menu() {
  return (
    <section className="menu" id="menu">
      <div className="container">
        <div className="section-head" data-reveal>
          <div>
            <span className="eyebrow">Autumn Collection · Issue No. 04</span>
            <h2 className="section-title section-title--menu">Seasonal Offerings</h2>
          </div>
          <p className="section-head__intro">
            Culinary expressions derived from wild mountain botanicals, heirloom grains, and single-estate cultivars harvested at peak autumnal stillness.
          </p>
        </div>

        <div className="menu__grid">
          <div className="feature" data-reveal>
            <div>
              <span className="feature__label">Provenance Feature</span>
              <h3 className="feature__title">Single-Estate Uji Tencha</h3>
              <p className="feature__body">
                Harvested during the third week of May under 90% reed shade screens. Stone-ground at 18 RPM to preserve delicate volatile oils and vegetal chlorophyll sweetness.
              </p>
            </div>
            <div className="feature__media">
              <img
                src="/assets/images/matcha.jpg"
                alt="Ceremonial matcha powder in a wabi-sabi ceramic chawan with a bamboo whisk"
                loading="lazy"
              />
            </div>
          </div>

          <div className="menu__list-col">
            <div className="menu__list" data-reveal-group>
              {menuItems.map((item, index) => (
                <div className="menu-item" key={item.name}>
                  <div className="menu-item__row">
                    <div className="menu-item__name">
                      <span className="menu-item__num">{String(index + 1).padStart(2, '0')}.</span>
                      <h4>{item.name}</h4>
                    </div>
                    <span className="menu-item__price">{item.price}</span>
                  </div>
                  <p className="menu-item__desc">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="menu__foot" data-reveal>
              <span className="menu__note">Kitchen closes 16:00 daily</span>
              <button className="btn btn--menu" type="button">View Complete Autumn Menu</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
