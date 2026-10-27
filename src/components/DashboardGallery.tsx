import { useState } from 'react';
import './DashboardGallery.css';

const screenshots = [
  { src: '/dashboard-original-1.png', title: 'WIP Production Trend & AI Forecast' },
  { src: '/dashboard-original-2.png', title: 'Bottleneck Alert Systems' },
];

export default function DashboardGallery() {
  const [active, setActive] = useState(0);
  return (
    <section className="original-gallery" aria-label="Original Power BI dashboard screenshots">
      <div className="original-gallery-heading">
        <div><span className="original-gallery-kicker">POWER BI DASHBOARD · ORIGINAL SCREENSHOTS</span><h2>{screenshots[active].title}</h2></div>
        <span className="original-gallery-count">{active + 1} / {screenshots.length}</span>
      </div>
      <div className="original-gallery-tabs" role="group" aria-label="Choose dashboard page">
        {screenshots.map((item, i) => <button key={item.src} type="button" className={active === i ? 'selected' : ''} onClick={() => setActive(i)}>{i + 1}. {item.title}</button>)}
      </div>
      <a className="original-gallery-image-link" href={screenshots[active].src} target="_blank" rel="noopener noreferrer" title="Open full-size dashboard image">
        <img src={screenshots[active].src} alt={`Original dashboard screenshot: ${screenshots[active].title}`} loading="lazy" />
      </a>
      <p className="original-gallery-caption">Original dashboard screenshot, unchanged. Click the image to view full size.</p>
    </section>
  );
}
