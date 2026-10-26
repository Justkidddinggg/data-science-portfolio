import React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Database, Settings2, ChartNoAxesCombined, GraduationCap, Code2, Mail } from 'lucide-react';
import { portfolioData } from '../data/portfolio';
import portrait from '../assets/chakrapong-portrait.png';
import { useReducedMotion } from '../hooks/useReducedMotion';

export const About: React.FC = () => {
  const rm = useReducedMotion();
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 150, damping: 22 });
  const rotateY = useSpring(tiltY, { stiffness: 150, damping: 22 });
  const handleCardMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (rm || event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    tiltY.set(((event.clientX - rect.left) / rect.width - .5) * 11);
    tiltX.set((.5 - (event.clientY - rect.top) / rect.height) * 11);
  };
  const resetCard = () => { tiltX.set(0); tiltY.set(0); };
  const { about, contact } = portfolioData;
  const steps = [
    { number:'01', title:'Raw Data', kicker:'Start with the problem.', text:'Understand what the data represents and which questions need answering.', icon: Database },
    { number:'02', title:'Process', kicker:'Look for what matters.', text:'Explore the data, test approaches, and evaluate the results.', icon: Settings2 },
    { number:'03', title:'Impact', kicker:'Make the results useful.', text:'Present findings in a way people can understand and use.', icon: ChartNoAxesCombined },
  ];
  return (
    <section id="about" className="editorial-about">
      <div className="editorial-about-grid">
        <motion.div className="editorial-bio" initial={rm ? false : {opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:.6}}>
          <p className="editorial-section-label">ABOUT ME</p>
          <h2>Hi, I’m Chakrapong.</h2>
          {about.paragraphs.map((paragraph,i)=><p key={i}>{paragraph}</p>)}
          <div className="editorial-bio-links">
            <span><GraduationCap size={19}/><span>Silpakorn University<small>Data Science</small></span></span>
            {contact.info.email && <a href={`mailto:${contact.info.email}`}><Mail size={19}/><span>Email<small>Get in touch</small></span></a>}
            {contact.info.github && <a href={contact.info.github} target="_blank" rel="noreferrer"><Code2 size={19}/><span>GitHub<small>View my work</small></span></a>}
          </div>
        </motion.div>
        <motion.div className="editorial-id-stage" initial={rm ? false : {opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.25}} transition={{duration:.7,delay:.1}}>
          <div className="editorial-id-float">
            <motion.div className="editorial-id-tilt" style={rm ? undefined : { rotateX, rotateY }} onPointerMove={handleCardMove} onPointerLeave={resetCard}>
              <div className="editorial-id-lanyard" aria-hidden="true">
                <span className="editorial-id-strap editorial-id-strap-left"><span>DATA SCIENCE</span></span>
                <span className="editorial-id-strap editorial-id-strap-right" />
                <span className="editorial-id-ring" />
                <span className="editorial-id-clip" />
              </div>
              <div className="editorial-id-badge" aria-label="Portfolio identity card for Chakrapong, Data Science at Silpakorn University">
                <div className="editorial-id-slot" aria-hidden="true" />
                <div className="editorial-id-photo"><img src={portrait} alt="Portrait of Chakrapong" /></div>
                <div className="editorial-id-content">
                  <span className="editorial-id-eyebrow">PORTFOLIO · DATA SCIENCE</span>
                  <strong>CHAKRAPONG</strong>
                  <span className="editorial-id-role">Data Science Student</span>
                  <div className="editorial-id-footer"><span>SILPAKORN UNIVERSITY</span><span className="editorial-id-monogram" aria-hidden="true">DS</span></div>
                </div>
                <div className="editorial-id-shine" aria-hidden="true" />
              </div>
            </motion.div>
          </div>
        </motion.div>
        <motion.div className="editorial-process" initial={rm ? false : {opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:.7,delay:.2}}>
          <p className="editorial-section-label">MY PROCESS</p>
          <div className="editorial-timeline">
            {steps.map(({number,title,kicker,text,icon:Icon})=>(
              <div className="editorial-step" key={number}>
                <span className="editorial-step-number">{number}</span>
                <div className="editorial-step-body"><h3>{title}</h3><strong>{kicker}</strong><p>{text}</p></div>
                <Icon className="editorial-step-icon" size={21} strokeWidth={1.6}/>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
