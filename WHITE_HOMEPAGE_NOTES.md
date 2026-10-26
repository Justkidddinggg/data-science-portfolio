# White editorial homepage update

Updated the existing React portfolio to follow the approved white reference layout.

- `src/components/Hero.tsx`: white editorial hero, animated Three.js particle silhouette, navigation CTAs, responsive typography.
- `src/components/About.tsx`: three-column About / actual user-supplied portrait / process timeline.
- `src/components/Navbar.tsx`: light navigation on Hero/About and About active while at Hero.
- `src/data/portfolio.ts`: navigation trimmed to About, Experience, Projects, Contact.
- `src/index.css`: responsive homepage and About design rules.
- `src/assets/chakrapong-portrait.png`: user-provided photo.

Other sections are intentionally unchanged pending review of the homepage design. The Download Resume CTA is replaced with a working About Me scroll button until a real resume URL is configured.

Run `npm install` and `npm run dev` locally. Build could not be verified in this environment because package installation did not finish (dependencies unavailable).
