/**
 * PORTFOLIO DATA — SKELETON CONFIGURATION
 *
 * Edit this file to personalise the entire site.
 * All sections are driven from this single source of truth.
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  location: string;
  description: string[];
  technologies: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  oneLiner: string;
  description: string;
  technologies: string[];
  exploreUrl?: string;
  githubUrl?: string;
  /** Controls the background tone of the project showcase */
  bgLight: boolean;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface ContactInfo {
  headline: string;
  subtext: string;
  email: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
  location: string;
}

export interface StoryStage {
  step: string;
  title: string;
  quote: string;
  description: string;
}

export interface ProcessStage {
  number: string;
  label: string;
  title: string;
  description: string;
  vizType: 'scatter' | 'flow' | 'network';
}

export interface PortfolioData {
  meta: {
    name: string;
    initials: string;
    title: string;
    tagline: string;
  };
  navigation: NavItem[];
  hero: {
    eyebrow?: string;
    headline: string;
    subheadline: string;
    primaryCta: { text: string; href: string };
    secondaryCta: { text: string; href: string };
  };
  about: {
    eyebrow: string;
    headline: string;
    storyConcept: string;
    stages: StoryStage[];
    introHeading: string;
    introSubheading: string;
    paragraphs: string[];
    bio: {
      paragraph1: string;
      paragraph2: string;
    };
    process: {
      label: string;
      heading: string;
      subtext: string;
      stages: ProcessStage[];
    };
  };
  experience: {
    eyebrow: string;
    headline: string;
    items: ExperienceItem[];
  };
  projects: {
    eyebrow: string;
    headline: string;
    items: ProjectItem[];
  };
  skills: {
    eyebrow: string;
    headline: string;
    categories: SkillCategory[];
  };
  contact: {
    eyebrow: string;
    info: ContactInfo;
  };
  footer: {
    name: string;
    note: string;
  };
}

export const portfolioData: PortfolioData = {
  meta: {
    name: 'Chakrapong Pindontree',
    initials: 'CP',
    title: 'Chakrapong Pindontree | Data Science Portfolio',
    tagline: 'Data Science · Analytics · Machine Learning',
  },
  navigation: [
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ],
  hero: {
    eyebrow: 'CHAKRAPONG PINDONTREE / DATA SCIENCE',
    headline: 'Data. Insight.\nImpact.',
    subheadline: 'I explore data, build predictive models, and create visualizations that make complex problems easier to understand.',
    primaryCta: { text: 'View my work', href: '#projects' },
    secondaryCta: { text: 'About me', href: '#about' },
  },
  about: {
    eyebrow: 'About',
    headline: 'A little about me.',
    storyConcept: 'Behind the Numbers',
    stages: [
      { step: '01', title: 'CURIOSITY', quote: 'Start with the problem.', description: 'Before building a model, I want to understand what the data represents and what people need to know.' },
      { step: '02', title: 'EXPLORATION', quote: 'Find what matters.', description: 'Clean the data, check assumptions, test approaches, and look closely at the results.' },
      { step: '03', title: 'IMPACT', quote: 'Make it useful.', description: 'Present findings in a way that helps someone make a better-informed decision.' },
    ],
    introHeading: "Hi, I'm Chakrapong.",
    introSubheading: 'Data Science student at Silpakorn University.',
    paragraphs: [
      'I study Data Science at Silpakorn University. I enjoy exploring datasets, finding patterns, and figuring out what the results actually mean.',
      'During my internship at BELTON, I worked on forecasting, classification, and Power BI dashboards using real production data.',
      'I try to understand the question first, choose an approach that fits, and explain the results in a way people can use.',
    ],
    bio: {
      paragraph1: "I'm Chakrapong, a Data Science student at Silpakorn University. I like working with data, from exploring patterns to building models and visualizations.",
      paragraph2: 'My internship at BELTON gave me the chance to work with real production data. It also taught me to look beyond model scores and think about how results will be understood and used.',
    },
    process: {
      label: 'HOW I APPROACH DATA',
      heading: 'From raw data\nto useful answers.',
      subtext: 'Understand the problem. Work through the data. Make the findings clear.',
      stages: [
        { number: '01', label: 'RAW DATA', title: 'Understand', description: 'Check the source, quality, and context of the data before drawing conclusions.', vizType: 'scatter' },
        { number: '02', label: 'PROCESS', title: 'Explore & model', description: 'Find patterns, test approaches, and evaluate what works and what does not.', vizType: 'flow' },
        { number: '03', label: 'INSIGHT', title: 'Communicate', description: 'Turn the results into clear visuals and explanations that support decisions.', vizType: 'network' },
      ],
    },
  },
  experience: {
    eyebrow: 'Experience',
    headline: 'Putting data\nto work.',
    items: [
      {
        id: 'exp-1',
        role: 'Data Analyst Trainee (Cooperative Education)',
        organization: 'BELTON TECHNOLOGY (THAILAND) CO., LTD.',
        period: 'Jul – Oct 2026',
        location: 'Pathum Thani, Thailand',
        description: [
          'Combined and cleaned more than 645,000 production records using Python, then checked WIP trends and data quality with the production team.',
          'Built a TimesNet model to forecast WIP levels, achieving 18.78% WMAPE.',
          'Trained a class-weighted Random Forest model for bottleneck classification, achieving 81.08% F1-score and 83.33% recall on a held-out test set.',
          'Developed a Power BI dashboard bringing together WIP forecasts, bottleneck predictions, and aging-lot tracking; supported user acceptance testing.',
        ],
        technologies: ['Python', 'TimesNet', 'Random Forest', 'Power BI', 'DAX'],
      },
    ],
  },
  projects: {
    eyebrow: 'Selected projects',
    headline: 'Work worth\nlooking into.',
    items: [
      {
        id: 'proj-1',
        title: 'Manufacturing WIP Forecasting & Bottleneck Detection',
        category: 'Cooperative Education · Manufacturing Analytics',
        oneLiner: 'Forecasting production WIP and identifying potential bottlenecks.',
        description: 'Worked with production data to build WIP forecasts using TimesNet and bottleneck classification using Random Forest. Evaluated the models and brought the outputs into a Power BI dashboard. WMAPE: 18.78%; classification F1-score: 81.08%.',
        technologies: ['Python', 'TimesNet', 'Random Forest', 'Power BI'],
        bgLight: false,
      },
      {
        id: 'proj-2',
        title: 'SECOM Defect Detection',
        category: 'Kaggle · Semiconductor Manufacturing',
        oneLiner: 'Predicting rare defects from semiconductor process measurements.',
        description: 'Explored a dataset with 590 sensor features and a 6.62% defect rate. Used LightGBM, class weighting, and stratified five-fold cross-validation, reaching a mean ROC-AUC of 0.721.',
        technologies: ['Python', 'LightGBM', 'Classification', 'Cross-Validation'],
        bgLight: true,
      },
      {
        id: 'proj-3',
        title: 'Stock Analytics Platform',
        category: 'Data Engineering · Analytics · Machine Learning',
        oneLiner: 'Built an end-to-end stock analytics platform spanning incremental ETL, technical indicators, machine learning, and an interactive Streamlit dashboard.',
        description: 'Analyzed six US equities with a validated ETL pipeline, 34 engineered features, model comparisons, and a Streamlit dashboard. Linear Regression achieved a reported R² of 0.94 on a time-based split.',
        technologies: ['Python', 'SQLite', 'Pandera', 'Scikit-learn', 'Streamlit'],
        bgLight: true,
      },
      {
        id: 'proj-4',
        title: 'Personal Knowledge Assistant',
        category: 'RAG · LLM Application · In Progress',
        oneLiner: 'Building a document-grounded knowledge assistant with ingestion, chunking, embeddings, vector search, and an LLM integration in progress.',
        description: 'A work-in-progress retrieval-augmented generation application. Document ingestion, chunking, embedding, and retrieval experiments are represented in the repository; LLM integration is ongoing.',
        technologies: ['Python', 'FastAPI', 'ChromaDB', 'Embeddings', 'RAG'],
        bgLight: true,
      },
    ],
  },
  skills: {
    eyebrow: 'Skills',
    headline: 'Tools I work with.',
    categories: [
      { title: 'Programming & Libraries', skills: ['Python', 'SQL', 'R', 'Pandas', 'NumPy', 'Scikit-learn', 'PyTorch'] },
      { title: 'Analytics & Reporting', skills: ['Power BI', 'DAX', 'Microsoft Excel', 'Data Cleaning', 'Exploratory Data Analysis'] },
      { title: 'Modeling & Communication', skills: ['Time-Series Forecasting', 'Classification', 'Model Evaluation', 'Thai — Native', 'English — B2'] },
    ],
  },
  contact: {
    eyebrow: 'Contact',
    info: {
      headline: 'Get in touch.',
      subtext: 'I’m looking for opportunities to learn and contribute in data analytics, data science, or business intelligence. Feel free to get in touch.',
      email: 'chakrapong.pindontre@gmail.com',
      github: 'https://github.com/Justkidddinggg',
      linkedin: '',
      resumeUrl: '',
      location: 'Pathum Thani, Thailand',
    },
  },
  footer: { name: 'Chakrapong Pindontree', note: 'Built with React and Three.js.' },
};
