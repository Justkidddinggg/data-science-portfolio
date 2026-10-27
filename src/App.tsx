import React, { useState } from 'react';
import { DashboardDemo } from './components/DashboardDemo';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import Certifications from './components/Certifications';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [demoOpen, setDemoOpen] = useState(false);
  return (
  <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif' }}>
    <a
      href="#main-content"
      style={{
        position: 'absolute',
        top: -999,
        left: -999,
        zIndex: 9999,
        background: '#0071E3',
        color: '#fff',
        padding: '8px 16px',
        borderRadius: 6,
        fontSize: 14,
        textDecoration: 'none',
      }}
      onFocus={e => {
        e.currentTarget.style.top = '8px';
        e.currentTarget.style.left = '8px';
      }}
      onBlur={e => {
        e.currentTarget.style.top = '-999px';
        e.currentTarget.style.left = '-999px';
      }}
    >
      Skip to main content
    </a>

    <Navbar />

    <main id="main-content">
      <Hero />
      <About />
      <Experience />
      <Projects onOpenDashboard={() => setDemoOpen(true)} />
      <Skills />
      <Certifications />
      <Contact />
    </main>

    <Footer />
    {demoOpen && <DashboardDemo onClose={() => setDemoOpen(false)} />}
  </div>
);
};

export default App;
