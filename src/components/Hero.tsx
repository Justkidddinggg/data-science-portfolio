import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, BrainCircuit, Monitor, ArrowDown } from 'lucide-react';
import { portfolioData } from '../data/portfolio';
import { SilhouetteParticles } from './three/SilhouetteParticles';
import { useReducedMotion } from '../hooks/useReducedMotion';

const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });

export const Hero: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const { hero, contact } = portfolioData;
  return (
    <section id="hero" className="editorial-hero">
      <div className="editorial-hero-glow" aria-hidden="true" />
      <div className="editorial-hero-inner">
        <div className="editorial-hero-copy">
          <motion.div initial={reducedMotion ? false : {opacity: 0, y: 16}} animate={{opacity:1,y:0}} transition={{duration:.65}}>
            <div className="editorial-eyebrow">Chakrapong Pindontree <span className="editorial-eyebrow-rule" /></div>
            <div className="editorial-overline">Data Science Portfolio</div>
            <h1>Data. Insight.<br /><span>Impact.</span></h1>
            <p className="editorial-lede">{hero.subheadline}</p>
            <div className="editorial-actions">
              <button className="editorial-primary" onClick={() => scrollTo('#projects')}>View Projects <ArrowRight size={17}/></button>
              {contact.info.resumeUrl ? (
                <a className="editorial-secondary" href={contact.info.resumeUrl} target="_blank" rel="noreferrer">Download Resume</a>
              ) : (
                <button className="editorial-secondary" onClick={() => scrollTo('#about')}>About me</button>
              )}
            </div>
          </motion.div>
          <div className="editorial-expertise" aria-label="Areas of interest">
            <div><BarChart3/><span><strong>Data Analysis</strong><small>Explore the patterns</small></span></div>
            <div><BrainCircuit/><span><strong>Machine Learning</strong><small>Build predictive models</small></span></div>
            <div><Monitor/><span><strong>Visualization</strong><small>Make data understandable</small></span></div>
          </div>
        </div>
        <div className="editorial-hero-art" aria-label="Animated particle silhouette representing data science">
          <div className="editorial-orbit editorial-orbit-one" aria-hidden="true" />
          <div className="editorial-orbit editorial-orbit-two" aria-hidden="true" />
          <div className="editorial-particle"><SilhouetteParticles reducedMotion={reducedMotion}/></div>
          <div className="editorial-side-label" aria-hidden="true">ANALYZE<br/>MODEL<br/>VISUALIZE<br/>SOLVE</div>
        </div>
      </div>
      <button className="editorial-scroll" onClick={() => scrollTo('#about')}>SCROLL TO EXPLORE <ArrowDown size={15}/></button>
      <div className="editorial-wave" aria-hidden="true" />
    </section>
  );
};
