import React from 'react';
import { motion } from 'framer-motion';
import { portfolioData, type ExperienceItem } from '../data/portfolio';
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

export const Experience: React.FC = () => {
  const rm = useReducedMotion();
  const { experience } = portfolioData;

  return (
    <section
      id="experience"
      style={{
        background: '#FFFFFF',
        color: '#1D1D1F',
        padding: '120px 0 140px',
        borderTop: '0.5px solid #E8E8ED',
      }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
        <motion.p
          {...(rm ? {} : fadeUp(0))}
          className="label-small"
          style={{ color: '#6E6E73', margin: '0 0 20px' }}
        >
          {experience.eyebrow}
        </motion.p>

        <motion.h2
          {...(rm ? {} : fadeUp(0.06))}
          className="headline-display"
          style={{ color: '#1D1D1F', margin: '0 0 80px' }}
        >
          <Multiline text={experience.headline} />
        </motion.h2>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {experience.items.map((item: ExperienceItem, idx: number) => (
            <motion.div
              key={item.id}
              {...(rm ? {} : fadeUp(0.1 + idx * 0.1))}
              style={{
                paddingBottom: 64,
                borderBottom:
                  idx < experience.items.length - 1 ? '0.5px solid #E8E8ED' : 'none',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 24,
                  flexWrap: 'wrap',
                  marginBottom: 6,
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: 22,
                      fontWeight: 600,
                      color: '#1D1D1F',
                      margin: 0,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {item.role}
                  </h3>
                  <p
                    className="body-base"
                    style={{ color: '#6E6E73', margin: '4px 0 0', fontWeight: 500 }}
                  >
                    {item.organization}
                  </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p className="label-small" style={{ color: '#A1A1A6', margin: 0 }}>
                    {item.period}
                  </p>
                  <p className="label-small" style={{ color: '#A1A1A6', margin: '3px 0 0' }}>
                    {item.location}
                  </p>
                </div>
              </div>

              <ul
                style={{
                  margin: '20px 0 0',
                  padding: '0 0 0 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {item.description.map((bullet, bi) => (
                  <li
                    key={bi}
                    className="body-base"
                    style={{ color: '#1D1D1F', listStyleType: 'disc' }}
                  >
                    {bullet}
                  </li>
                ))}
              </ul>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 20 }}>
                {item.technologies.map(tech => (
                  <span
                    key={tech}
                    className="tag-pill"
                    style={{
                      background: '#F5F5F7',
                      color: '#1D1D1F',
                      border: '0.5px solid #D2D2D7',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
