import React from 'react';
import { portfolioData } from '../data/portfolio';

const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const { footer } = portfolioData;

  const linkStyle: React.CSSProperties = {
    color: '#6E6E73',
    fontSize: 12,
    textDecoration: 'none',
    transition: 'color 0.15s',
  };

  return (
    <footer
      style={{
        background: '#101014',
        borderTop: '0.5px solid rgba(255,255,255,0.08)',
        padding: '40px 24px',
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
        }}
      >
        {/* Copyright */}
        <div>
          <p style={{ color: '#6E6E73', fontSize: 12, margin: '0 0 4px' }}>
            © {year} {footer.name}. All rights reserved.
          </p>
          <p style={{ color: '#444448', fontSize: 11, margin: 0 }}>
            {footer.note}
          </p>
        </div>

        {/* Links + back-to-top */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {portfolioData.navigation.slice(0, 3).map(item => (
            <a
              key={item.href}
              href={item.href}
              style={linkStyle}
              onMouseOver={e => (e.currentTarget.style.color = '#F5F5F7')}
              onMouseOut={e => (e.currentTarget.style.color = '#6E6E73')}
            >
              {item.label}
            </a>
          ))}

          <button
            type="button"
            onClick={scrollTop}
            aria-label="Back to top"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '0.5px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              padding: '6px 12px',
              color: '#A1A1A6',
              fontSize: 12,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.10)';
              e.currentTarget.style.color = '#F5F5F7';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.color = '#A1A1A6';
            }}
          >
            ↑ Top
          </button>
        </div>
      </div>
    </footer>
  );
};
