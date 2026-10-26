# Content and publishing checklist

Updated the portfolio using the resume details discussed in chat. Review every claim before publishing.

- BELTON figures: 645K+ records, WMAPE 18.78%, Random Forest F1 81.08%, recall 83.33%. Publish only material cleared by your employer. Replace sensitive examples with synthetic data.
- SECOM competition rank is intentionally omitted because the resume history has conflicting rankings (6th vs 9th). Confirm against the leaderboard before adding.
- The projects currently have no linked case-study pages or repositories. Add real URLs in `src/data/portfolio.ts` when ready.
- LinkedIn and resume URLs are blank and therefore hidden until provided. Add a real PDF in `public/` and set `resumeUrl` to `/your-resume.pdf` if desired.
- Contact now opens the user's email client. The original contact form showed a success message without sending anything; it was removed.
- The project art remains decorative SVG. Replace it with sanitized screenshots, charts, or approved project visuals for credibility.
- TypeScript `tsc -b` completed successfully. Vite production build could not run in this environment because the ZIP's Windows-installed node_modules lacks Linux rolldown native binding. On your computer run `npm install` then `npm run build`.
- Font: Inter with a native system fallback. It is a freely usable alternative to Apple proprietary fonts.
