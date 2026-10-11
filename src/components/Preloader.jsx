export default function Preloader() {
  return (
    <div className="preloader" aria-hidden="true">
      <div className="preloader__panel preloader__panel--left" />
      <div className="preloader__panel preloader__panel--right" />
      <div className="preloader__logo">
        <span className="preloader__mark">
          M<em>&amp;</em>M
        </span>
        <span className="preloader__word">Moss &amp; Mellow</span>
      </div>
    </div>
  );
}
