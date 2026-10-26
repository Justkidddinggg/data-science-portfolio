import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../data/portfolio';
import { useReducedMotion } from '../hooks/useReducedMotion';
import './ProjectsEditorial.css';

const forecast = [80,40,94,100,88,91,63,24,95,80,32,89,100,76,30,92,99,91,106,110,115,97,38,128,121];
const bars = [75,105,68,120,87,140,95,118,72,108];
const MiniDashboard: React.FC = () => <div className="work-mini" aria-label="Illustrative dashboard preview with production charts">
  <div className="work-mini-top"><strong>WIP Production Trend & AI Forecast</strong><span>ILLUSTRATIVE DEMO</span></div>
  <div className="work-mini-metrics">{[['Total WIP','1,248'],['Critical Lots','126'],['Watchlist','218'],['WMAPE','18.78%']].map(([a,b])=><div key={a}><small>{a}</small><strong>{b}</strong></div>)}</div>
  <div className="work-mini-graphs"><div className="work-mini-panel"><strong>WIP Aging by Process</strong>{[[8,9,16,67],[13,16,25,46],[7,12,20,35],[4,8,12,42]].map((parts,i)=><div className="work-mini-stack" key={i}><span>P{i+1}</span><div>{parts.map((v,j)=><i key={j} style={{width:v+'%',background:['#d84d57','#f18a32','#f7c53f','#25b780'][j]}}/>)}</div></div>)}</div><div className="work-mini-panel"><strong>Aging Distribution</strong><div className="work-mini-columns">{bars.map((v,i)=><div key={i} style={{height:`${v/1.5}px`}}><i/><b/><em/></div>)}</div></div></div>
  <div className="work-mini-panel work-mini-wide"><strong>Daily WIP Tracking & TimesNet AI Forecast</strong><svg viewBox="0 0 520 115" preserveAspectRatio="none" role="img" aria-label="Forecast preview"><defs><linearGradient id="work-fill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#3c79c9" stopOpacity=".42"/><stop offset="1" stopColor="#3c79c9" stopOpacity=".04"/></linearGradient></defs><polygon points={`0,110 ${forecast.map((v,i)=>`${i*20},${110-v*.7}`).join(' ')} 480,110`} fill="url(#work-fill)"/><polyline points={forecast.map((v,i)=>`${i*20},${110-v*.7}`).join(' ')} fill="none" stroke="#4477b6" strokeWidth="2"/><path d="M480 25 L500 33 L520 40" stroke="#4477b6" strokeDasharray="4 3" fill="none" strokeWidth="2"/></svg></div>
</div>;

export const Projects: React.FC<{onOpenDashboard?:()=>void}> = ({onOpenDashboard}) => {
  const rm=useReducedMotion();
  const projects=portfolioData.projects.items;
  const [activeProject, setActiveProject] = useState(0);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const activeCardRef = useRef<HTMLDivElement | null>(null);
  const [stageHeight, setStageHeight] = useState(760);
  useLayoutEffect(() => {
    const slot = activeCardRef.current;
    const card = slot?.querySelector<HTMLElement>('.work-carousel-card');
    if (!slot || !card) return;

    // Measure the untransformed content height. getBoundingClientRect() on the
    // animated slot includes scale(.84 -> 1), which can clip the bottom buttons.
    const updateHeight = () => {
      const contentHeight = Math.max(card.scrollHeight, card.offsetHeight);
      const topOffset = slot.offsetTop;
      setStageHeight(Math.ceil(topOffset + contentHeight + 32));
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(card);
    window.addEventListener('resize', updateHeight);
    // Re-measure after fonts finish loading (text wrapping can change height).
    document.fonts?.ready.then(updateHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, [activeProject, expandedProject]);
  const secondaryProjects = projects.filter(p => p.id !== 'proj-1');
  const goToProject = (index: number) => {
    setActiveProject((index + secondaryProjects.length) % secondaryProjects.length);
    setExpandedProject(null);
  };
  const onCarouselKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); goToProject(activeProject + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); goToProject(activeProject - 1); }
  };
  return <section id="projects" className="work-section"><div className="work-container">
    <div className="work-heading"><span>02 / SELECTED WORK</span><h2>A closer look<br/>at my work.</h2><p>Projects where I explored data, tested models, and turned the results into something useful.</p></div>
    <motion.article className="work-feature" initial={rm?false:{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.65}}>
      <div className="work-feature-copy"><span className="work-kicker">FEATURED CASE STUDY · INTERNSHIP</span><h3>Production Analytics<br/>& AI Forecasting.</h3><p>Forecasting work-in-progress, identifying potential bottlenecks, and presenting production trends through an interactive dashboard.</p><div className="work-feature-stats">
        <div><strong>18.78%</strong><span>Forecast WMAPE</span></div><div><strong>81.08%</strong><span>Classification F1</span></div></div><div className="work-tags"><span>Python</span><span>TimesNet</span><span>Random Forest</span><span>Power BI</span>
      </div>
      <div className="work-actions">
  <button
    type="button"
    className="work-primary"
    onClick={onOpenDashboard}
    disabled={!onOpenDashboard}
  >
    Explore Interactive Dashboard
    <span aria-hidden="true">↗</span>
  </button>

  <a
    className="work-github"
    href="https://github.com/Justkidddinggg/smart-factory-wip-bottleneck-ai"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="View forecasting source code on GitHub"
  >
    Forecasting Code
    <span aria-hidden="true">↗</span>
  </a>
</div>

<small className="work-note">
  Dashboard: synthetic data · GitHub: forecasting implementation only
</small>
</div>
      <div className="work-feature-preview"><MiniDashboard/></div>
    </motion.article>
    <div className="work-carousel-heading">
      <div><span className="work-kicker">MORE PROJECTS</span><h3>Explore other projects.</h3><p>Browse projects using the arrows or select a neighboring card.</p></div>
      <div className="work-carousel-controls">
        <button type="button" aria-label="Previous project" onClick={() => goToProject(activeProject-1)} >←</button>
        <span>{String(activeProject+1).padStart(2,'0')} / {String(secondaryProjects.length).padStart(2,'0')}</span>
        <button type="button" aria-label="Next project" onClick={() => goToProject(activeProject+1)} >→</button>
      </div>
    </div>
    <div className="work-carousel-stage" style={{height: stageHeight}} role="region" aria-roledescription="carousel" aria-label="More data science projects" tabIndex={0} onKeyDown={onCarouselKeyDown}>
      {secondaryProjects.map((project, i) => {
        const offset = (i - activeProject + secondaryProjects.length) % secondaryProjects.length;
        const position = offset === 0 ? 'center' : offset === 1 ? 'right' : 'left';
        const expanded = expandedProject === project.id;
        const details = project.id === 'proj-2' ? [
          'Removed constant and high-missingness sensor features. Median imputation was fitted inside each training pipeline to prevent leakage.',
          'Compared Logistic Regression, ExtraTrees, and Random Forest using repeated stratified five-fold validation. The rank-averaged ensemble reached OOF ROC-AUC 0.760.',
          'The reported ROC curve uses out-of-fold predictions, not the Kaggle test set.'
        ] : project.id === 'proj-3' ? [
          'ETL: collected six US equities using yfinance, implemented incremental loading, Pandera schema checks, logging, retry handling, and SQLite storage.',
          'Analytics: moving averages, volatility, correlation, RSI, MACD, and Bollinger Bands.',
          'Modeling: compared Linear Regression, Random Forest and Gradient Boosting with a time-based split. README reports Linear Regression MAE 3.52 and R² 0.94; this is a project-specific result, not a general claim of future trading accuracy.',
          'Delivery: Streamlit dashboard with stock indicators, comparisons, and a Prophet-based 90-day forecast.'
        ] : [
          'Implemented document ingestion, text chunking, embeddings, vector storage, and retrieval experiments in the repository.',
          'The repository includes FastAPI, PyMuPDF, python-docx, sentence-transformers, and ChromaDB dependencies.',
          'LLM integration is in progress. Answer quality and end-to-end performance have not been evaluated yet.'
        ];
        return <div key={project.id} ref={position === 'center' ? activeCardRef : undefined} className={`work-carousel-slot is-${position}`}>
          {position !== 'center' && <button type="button" className="work-carousel-side-click" tabIndex={-1} onClick={() => goToProject(i)} aria-label={`Show ${project.title}`}/>}
          <motion.article className="work-carousel-card" initial={false} animate={{opacity:1}} transition={{duration:rm?0:.25}}>
            <div className={`work-carousel-art ${project.id === 'proj-2' ? 'work-secom-art' : project.id === 'proj-3' ? 'work-stock-art' : 'work-rag-art'}`}>
              {project.id === 'proj-2' ? <img src="/images/secom-roc-curve.png" alt="SECOM out-of-fold ROC curve comparing Logistic Regression, tuned ExtraTrees, and final ensemble" loading="lazy"/> : project.id === 'proj-3' ? <div className="work-stock-visual"><div className="work-stock-visual-top"><span>STOCK ANALYTICS</span><span>ETL → ANALYTICS → ML</span></div><svg viewBox="0 0 560 180" preserveAspectRatio="none" role="img" aria-label="Illustrative financial analytics trend, not real stock price data"><defs><linearGradient id="stockGradient" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#4e8de5" stopOpacity=".30"/><stop offset="1" stopColor="#4e8de5" stopOpacity="0"/></linearGradient></defs><path d="M0 145 L45 124 L90 132 L135 95 L180 107 L225 72 L270 87 L315 55 L360 69 L405 40 L450 56 L505 24 L560 13 L560 180 L0 180Z" fill="url(#stockGradient)"/><path d="M0 145 L45 124 L90 132 L135 95 L180 107 L225 72 L270 87 L315 55 L360 69 L405 40 L450 56 L505 24 L560 13" fill="none" stroke="#3979c7" strokeWidth="3" strokeLinecap="round"/></svg><div className="work-stock-visual-bottom"><span>6 EQUITIES</span><span>34 ML FEATURES</span><span>STREAMLIT</span></div></div> : <div className="work-rag-visual" aria-label="Illustrative RAG architecture"><div className="work-rag-flow"><span>PDF / DOCX</span><b>→</b><span>Chunks</span><b>→</b><span>Embeddings</span><b>→</b><span>ChromaDB</span></div><div className="work-rag-flow work-rag-flow-bottom"><span>Retriever</span><b>→</b><span className="work-rag-llm">LLM · IN PROGRESS</span><b>→</b><span>Answer + Sources</span></div></div>}
              <span className="work-art-caption">{project.id === 'proj-2' ? 'OOF ROC-AUC 0.760' : project.id === 'proj-3' ? 'END-TO-END DATA PLATFORM' : 'WORK IN PROGRESS'}</span>
            </div>
            <div className="work-carousel-copy">
              <span className="work-kicker">{project.category.toUpperCase()}</span>
              <h3>{project.title}</h3>
              <p>{project.oneLiner}</p>
              {project.id === 'proj-2' && <div className="work-secom-metrics"><div><strong>0.760</strong><span>OOF ROC-AUC</span></div><div><strong>6.6%</strong><span>Defect rate</span></div><div><strong>1,253</strong><span>Training samples</span></div></div>}
              {project.id === 'proj-3' && <div className="work-secom-metrics"><div><strong>6</strong><span>US stocks</span></div><div><strong>34</strong><span>ML features</span></div><div><strong>0.94</strong><span>Reported R² (time split)</span></div></div>}
              {project.id === 'proj-4' && <div className="work-rag-progress">Document ingestion · Embeddings · Retrieval <strong>LLM integration underway</strong></div>}
              <div className="work-tags">{project.technologies.slice(0,5).map(t=><span key={t}>{t}</span>)}</div>
              <div className="work-carousel-actions">
                <button type="button" className="work-detail-button" onClick={()=>setExpandedProject(expanded ? null : project.id)} aria-expanded={expanded}>{expanded?'Hide Details −':'View Case Study +'}</button>
                <a className="work-github" href={project.id === 'proj-2' ? 'https://github.com/Justkidddinggg/Defect-Detection-Competition' : project.id === 'proj-3' ? 'https://github.com/Justkidddinggg/stock-analytics-platform' : 'https://github.com/Justkidddinggg/personal-knowledge-assistant'} target="_blank" rel="noopener noreferrer">View GitHub ↗</a>
              </div>
              {expanded && <div className="work-secom-details"><h4>Approach & implementation</h4>{details.map((detail,j)=><p key={j}>{detail}</p>)}</div>}
            </div>
          </motion.article>
        </div>;
      })}
    </div>
    <div className="work-carousel-dots" aria-label="Choose project">{secondaryProjects.map((project,i)=><button type="button" key={project.id} aria-label={`Go to project ${i+1}`} aria-current={activeProject===i?'true':undefined} className={activeProject===i?'active':''} onClick={()=>goToProject(i)}/>)}</div>
  </div></section>;
};
