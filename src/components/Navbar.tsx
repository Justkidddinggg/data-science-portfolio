import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData, type NavItem } from '../data/portfolio';
import { useActiveSection } from '../hooks/useActiveSection';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDarkSection, setIsDarkSection] = useState(true);

  const sectionIds = ['hero', ...portfolioData.navigation.map(n => n.href.replace('#', ''))];
  const activeSection = useActiveSection(sectionIds);

  // Sections that are dark (white text nav)
  const darkSections = new Set(['projects', 'contact']);

  useEffect(() => {
    setIsDarkSection(darkSections.has(activeSection));
  }, [activeSection]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      const offset = el.getBoundingClientRect().top + window.scrollY - 56;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  };

  const isLight = !isDarkSection;
  const navBg = scrolled
    ? isLight
      ? 'rgba(255, 255, 255, 0.85)'
      : 'rgba(7, 10, 19, 0.82)'
    : 'transparent';
  const borderColor = scrolled
    ? isLight
      ? 'rgba(0, 0, 0, 0.08)'
      : 'rgba(255, 255, 255, 0.08)'
    : 'transparent';
  const textColor = isLight ? '#1D1D1F' : '#F5F5F7';
  const textMuted = isLight ? '#6E6E73' : '#8E9AA8';

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        backdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none',
        backgroundColor: navBg,
        borderBottom: `0.5px solid ${borderColor}`,
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1240,
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        {/* Desktop Navigation — menu only */}
        <nav
          aria-label="Primary navigation"
          style={{ display: 'flex', alignItems: 'center', gap: 32 }}
          className="hidden md:flex"
        >
          {portfolioData.navigation.map((item: NavItem) => {
            const id = item.href.replace('#', '');
            const isActive = activeSection === id || (id === 'about' && activeSection === 'hero');
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={e => handleClick(e, item.href)}
                style={{
                  position: 'relative',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? textColor : textMuted,
                  textDecoration: 'none',
                  letterSpacing: '0.01em',
                  padding: '8px 0',
                  transition: 'color 0.2s',
                  fontFamily: 'inherit',
                }}
                onMouseOver={e => {
                  if (!isActive) e.currentTarget.style.color = textColor;
                }}
                onMouseOut={e => {
                  if (!isActive) e.currentTarget.style.color = textMuted;
                }}
              >
                <span>{item.label}</span>
                {/* Active Underline Indicator matching reference */}
                {isActive && (
                  <motion.div
                    layoutId="navActiveLine"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 20,
                      height: 1.5,
                      backgroundColor: isLight ? '#0071E3' : '#FFFFFF',
                      borderRadius: 1,
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Mobile Menu Hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen(v => !v)}
          className="md:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 6,
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
          }}
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                display: 'block',
                width: 22,
                height: 1.5,
                backgroundColor: textColor,
                borderRadius: 1,
                transition: 'transform 0.25s, opacity 0.25s',
                transformOrigin: 'center',
                transform: mobileOpen
                  ? i === 1
                    ? 'scaleX(0)'
                    : i === 0
                    ? 'translateY(6.5px) rotate(45deg)'
                    : 'translateY(-6.5px) rotate(-45deg)'
                  : 'none',
                opacity: mobileOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: 56,
              left: 0,
              right: 0,
              background: isLight ? 'rgba(255,255,255,0.98)' : 'rgba(7, 10, 19, 0.98)',
              backdropFilter: 'blur(20px)',
              borderBottom: `0.5px solid ${borderColor}`,
              padding: '16px 28px 24px',
            }}
          >
            {portfolioData.navigation.map((item: NavItem) => (
              <a
                key={item.href}
                href={item.href}
                onClick={e => handleClick(e, item.href)}
                style={{
                  display: 'block',
                  padding: '12px 0',
                  fontSize: 16,
                  fontWeight: 400,
                  color: textColor,
                  textDecoration: 'none',
                  borderBottom: `0.5px solid ${
                    isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'
                  }`,
                }}
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
