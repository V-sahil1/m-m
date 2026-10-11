// Bougainvillea cut-outs in the corners of the first and last Spaces panels.
// The outer element is moved by the scroll animation; the image sways on a loop (see styles.css).

const FLOWER_01 = '6a4afbe9f3a19844a4b0caed_bougainvillea-flowers_01.avif'; // hangs from the top-left
const FLOWER_06 = '6a4afbe968be0cc0c1f5fef2_bougainvillea-flowers_06.avif'; // hangs from the top-right

// The source images all hang downward, so the bottom corners use a vertically flipped one (see styles.css)
const sources = {
  'first-bottom-left': FLOWER_01,
  'first-top-right': FLOWER_06,
  'last-top-left': FLOWER_01,
  'last-bottom-right': FLOWER_06,
};

export default function Bloom({ variant }) {
  return (
    <div className={`bloom bloom--${variant}`} aria-hidden="true">
      <span className="bloom__flip">
        <img src={`/assets/flower/${sources[variant]}`} alt="" loading="lazy" />
      </span>
    </div>
  );
}
