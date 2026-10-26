import React from 'react';
import { motion } from 'framer-motion';
import { Code2, MessageCircle } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import './SkillsEditorial.css';

// Edit these arrays to update the skill tags displayed on the portfolio.
const technicalSkills = [
  'Python', 'SQL', 'Pandas', 'NumPy', 'Power BI', 'DAX', 'Excel',
  'Scikit-learn', 'Machine Learning', 'Time Series Forecasting',
  'Data Cleaning', 'Data Visualization',
];

const professionalSkills = [
  'Stakeholder Communication', 'Requirements Gathering',
  'Cross-functional Collaboration', 'Data Storytelling',
  'Presentation', 'Problem Solving',
];

export const Skills: React.FC = () => {
  const reducedMotion = useReducedMotion();
  return (
    <section id="skills" className="skills-compact-section" aria-labelledby="skills-heading">
      <div className="skills-compact-container">
        <motion.div className="skills-compact-header"
          initial={reducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: .45 }}>
          <span className="skills-compact-eyebrow">03 / EXPERTISE</span>
          <h2 id="skills-heading">What I work with.</h2>
          <p>A practical toolkit built through projects and real-world collaboration.</p>
        </motion.div>
        <div className="skills-compact-list">
          <div className="skills-compact-row">
            <div className="skills-compact-label"><Code2 size={20} strokeWidth={1.7} aria-hidden="true"/><h3>Technical</h3></div>
            <ul className="skills-compact-tags" aria-label="Technical skills">
              {technicalSkills.map(skill => <li key={skill}>{skill}</li>)}
            </ul>
          </div>
          <div className="skills-compact-row">
            <div className="skills-compact-label"><MessageCircle size={20} strokeWidth={1.7} aria-hidden="true"/><h3>Professional</h3></div>
            <ul className="skills-compact-tags" aria-label="Professional and communication skills">
              {professionalSkills.map(skill => <li key={skill}>{skill}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
