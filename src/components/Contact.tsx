import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Copy, Check, MapPin, FileDown } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { portfolioData } from '../data/portfolio';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { fadeUp } from '../utils/animations';

const Multiline: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split('\n').map((line, i, arr) => (
      <React.Fragment key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </React.Fragment>
    ))}
  </>
);

export const Contact: React.FC = () => {
  const rm = useReducedMotion();
  const { contact } = portfolioData;
  const { info } = contact;

  const [copied, setCopied] = useState(false);
  const copyEmail = () => {
    navigator.clipboard.writeText(info.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section
      id="contact"
      style={{
        background: '#000000',
        color: '#F5F5F7',
        padding: '120px 0 100px',
        borderTop: '0.5px solid rgba(255,255,255,0.08)',
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
        {/* Eyebrow */}
        <motion.p
          {...(rm ? {} : fadeUp(0))}
          className="label-small"
          style={{ color: '#6E6E73', margin: '0 0 20px' }}
        >
          {contact.eyebrow}
        </motion.p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(420px, 100%), 1fr))',
            gap: 64,
            alignItems: 'start',
          }}
        >
          {/* Left — headline + info */}
          <motion.div {...(rm ? {} : fadeUp(0.06))}>
            <h2
              className="headline-display"
              style={{ color: '#F5F5F7', margin: '0 0 28px' }}
            >
              <Multiline text={info.headline} />
            </h2>

            <p
              className="body-large"
              style={{ color: '#A1A1A6', margin: '0 0 48px', maxWidth: 400 }}
            >
              {info.subtext}
            </p>

            {/* Email copy row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.04)',
                border: '0.5px solid rgba(255,255,255,0.12)',
                marginBottom: 28,
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <Mail style={{ width: 16, height: 16, color: '#A1A1A6', flexShrink: 0 }} />
                <span
                  className="body-base"
                  style={{ color: '#F5F5F7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {info.email}
                </span>
              </div>
              <button
                type="button"
                onClick={copyEmail}
                aria-label="Copy email address"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: copied ? '#34D399' : '#A1A1A6',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  flexShrink: 0,
                  transition: 'color 0.2s',
                }}
              >
                {copied ? <Check style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* Social links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { href: info.github,    icon: <GithubIcon className="w-4 h-4" />,        label: 'GitHub' },
                { href: info.linkedin,  icon: <LinkedinIcon className="w-4 h-4" />,      label: 'LinkedIn' },
                { href: info.resumeUrl, icon: <FileDown style={{ width: 16, height: 16 }} />, label: 'Resume PDF' },
              ].filter(item => item.href).map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    color: '#A1A1A6',
                    textDecoration: 'none',
                    fontSize: 15,
                    transition: 'color 0.2s',
                  }}
                  onMouseOver={e => (e.currentTarget.style.color = '#F5F5F7')}
                  onMouseOut={e => (e.currentTarget.style.color = '#A1A1A6')}
                >
                  {icon}
                  <span>{label}</span>
                  <span style={{ color: '#0071E3', marginLeft: 'auto' }}>›</span>
                </a>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 32,
              }}
            >
              <MapPin style={{ width: 13, height: 13, color: '#6E6E73' }} />
              <span className="label-small" style={{ color: '#6E6E73' }}>
                {info.location}
              </span>
            </div>
          </motion.div>

          {/* Direct email link: no backend or fake success state */}
          <motion.div {...(rm ? {} : fadeUp(0.15))} style={{ alignSelf: 'center' }}>
            <p style={{ color: '#A1A1A6', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
              Have a role or project in mind? Email is the best way to reach me.
            </p>
            <a href={`mailto:${info.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#F5F5F7', color: '#1D1D1F', padding: '14px 24px', borderRadius: 999, fontWeight: 600, textDecoration: 'none' }}>
              <Mail size={18} /> Send an email
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
