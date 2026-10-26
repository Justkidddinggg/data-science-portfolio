import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { ProjectItem } from '../data/portfolio';
import { GithubIcon } from './Icons';
import { fadeUp } from '../utils/animations';

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  reducedMotion?: boolean;
}

/** Per-project visual art: abstract SVG composition */
const ProjectArt: React.FC<{ project: ProjectItem }> = ({ project }) => {
  const { id } = project;
  if (id === 'proj-1') {
    return (
      <svg viewBox="0 0 480 320" style={{ width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="p1a" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#F5D0FE" />
            <stop offset="100%" stopColor="#C084FC" />
          </radialGradient>
        </defs>
        <circle cx="240" cy="160" r="90" fill="none" stroke="#C4B5FD" strokeWidth="1" strokeDasharray="3 4" />
        <ellipse cx="240" cy="155" rx="82" ry="36" fill="none" stroke="url(#p1a)" strokeWidth="28" transform="rotate(-20 240 155)" />
        <circle cx="320" cy="220" r="48" fill="url(#p1a)" opacity="0.85" />
        <circle cx="150" cy="108" r="32" fill="#E9D5FF" opacity="0.7" />
        <circle cx="360" cy="90" r="14" fill="#C084FC" />
        {/* Sine wave accent */}
        <path d="M 40 200 Q 100 140, 160 200 T 280 200 T 400 200 T 460 200"
          fill="none" stroke="#A78BFA" strokeWidth="1.5" opacity="0.5" />
      </svg>
    );
  }
  if (id === 'proj-2') {
    return (
      <svg viewBox="0 0 480 320" style={{ width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="p2a" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FBCFE8" />
            <stop offset="100%" stopColor="#F472B6" />
          </radialGradient>
        </defs>
        <rect x="130" y="60" width="220" height="200" rx="28" fill="none" stroke="#F9A8D4" strokeWidth="1.5" />
        <rect x="155" y="85" width="170" height="150" rx="18" fill="#FDF2F8" />
        {/* Grid pattern */}
        {[0,1,2,3].map(r => [0,1,2,3].map(c => (
          <circle key={`${r}-${c}`}
            cx={180 + c * 40} cy={110 + r * 40}
            r={r === 1 && c === 2 ? 10 : r === 2 && c === 1 ? 8 : 3}
            fill={r === 1 && c === 2 ? '#F472B6' : r === 2 && c === 1 ? '#F9A8D4' : '#D1D5DB'}
          />
        )))}
        <circle cx="344" cy="245" r="38" fill="url(#p2a)" opacity="0.85" />
        <circle cx="118" cy="220" r="22" fill="#FBCFE8" opacity="0.7" />
      </svg>
    );
  }
  // proj-3
  return (
    <svg viewBox="0 0 480 320" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="p3a" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#BAE6FD" />
          <stop offset="100%" stopColor="#60A5FA" />
        </radialGradient>
      </defs>
      {/* Hexagon grid */}
      {[0,1,2].map(r => [0,1,2,3].map(c => (
        <polygon key={`${r}-${c}`}
          points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11"
          transform={`translate(${80 + c * 86 + (r % 2) * 43}, ${90 + r * 76})`}
          fill="none" stroke="#93C5FD" strokeWidth="1" opacity="0.5"
        />
      )))}
      <circle cx="240" cy="160" r="52" fill="url(#p3a)" opacity="0.9" />
      <circle cx="240" cy="160" r="28" fill="#BAE6FD" />
      {/* Axes */}
      <line x1="240" y1="60" x2="240" y2="260" stroke="#60A5FA" strokeWidth="1" opacity="0.4" />
      <line x1="140" y1="160" x2="340" y2="160" stroke="#60A5FA" strokeWidth="1" opacity="0.4" />
    </svg>
  );
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  reducedMotion = false,
}) => {
  const [hovered, setHovered] = useState(false);
  const isDark = !project.bgLight;

  const bg = isDark ? '#101014' : '#F5F5F7';
  const headingColor = isDark ? '#F5F5F7' : '#1D1D1F';
  const bodyColor = isDark ? '#A1A1A6' : '#6E6E73';
  const tagBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const tagColor = isDark ? '#D2D2D7' : '#1D1D1F';
  const tagBorder = isDark ? 'rgba(255,255,255,0.12)' : '#D2D2D7';

  return (
    <motion.article
      {...(reducedMotion ? {} : fadeUp(index * 0.1, 32))}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="product-card"
      style={{
        background: bg,
        transform: hovered && !reducedMotion ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 60px rgba(0,0,0,0.15)' : '0 4px 24px rgba(0,0,0,0.06)',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Visual art area */}
      <div
        style={{
          height: 280,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: `0.5px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#E8E8ED'}`,
          padding: '20px 20px 0',
        }}
      >
        <ProjectArt project={project} />
      </div>

      {/* Content area */}
      <div
        style={{
          padding: '32px 36px 36px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: 12,
        }}
      >
        {/* Category label */}
        <p
          className="label-small"
          style={{ color: isDark ? '#6E6E73' : '#A1A1A6', margin: 0 }}
        >
          {project.category}
        </p>

        {/* Title */}
        <h3
          className="headline-card"
          style={{ color: headingColor, margin: 0 }}
        >
          {project.title}
        </h3>

        {/* One-liner */}
        <p
          className="body-base"
          style={{ color: isDark ? '#A1A1A6' : '#6E6E73', margin: 0, fontWeight: 500 }}
        >
          {project.oneLiner}
        </p>

        {/* Description */}
        <p
          className="body-base"
          style={{ color: bodyColor, margin: 0 }}
        >
          {project.description}
        </p>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Tech tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingTop: 16 }}>
          {project.technologies.map(tech => (
            <span
              key={tech}
              className="tag-pill"
              style={{ background: tagBg, color: tagColor, border: `0.5px solid ${tagBorder}` }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 20,
            borderTop: `0.5px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#E8E8ED'}`,
          }}
        >
          {project.exploreUrl ? (
            <a href={project.exploreUrl} className="apple-link" style={{ fontSize: 15, color: '#0071E3' }}>
              Explore project ›
            </a>
          ) : (
            <span style={{ fontSize: 13, color: bodyColor }}>Project overview</span>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              style={{ color: bodyColor, display: 'flex', alignItems: 'center' }}
            >
              <GithubIcon className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
};
