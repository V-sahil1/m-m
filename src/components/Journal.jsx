import { motion } from 'framer-motion';
import Icon from './Icon.jsx';
import { stories } from '../data.js';

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

export default function Journal() {
  return (
    <section className="journal" id="journal">
      <div className="container">
        <div className="journal__head" data-reveal>
          <div>
            <span className="eyebrow">Quarterly Dispatch</span>
            <h2 className="section-title section-title--journal">The Journal</h2>
          </div>
          <a className="link-arrow link-arrow--journal" href="#journal">
            <span>Read All Volumes</span>
            <Icon name="north_east" />
          </a>
        </div>

        <motion.div
          className="journal__grid"
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {stories.map((story) => (
            <motion.article
              className="story"
              key={story.title}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
            >
              <div className="story__media">
                <img src={story.image} alt={story.alt} loading="lazy" />
              </div>
              <div className="story__meta">
                <span className="story__vol">{story.volume}</span>
                <span className="story__dot" />
                <span className="story__time">{story.readTime}</span>
              </div>
              <h3 className="story__title">{story.title}</h3>
              <p className="story__body">{story.body}</p>
              <span className="story__more">Read Dispatch →</span>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
