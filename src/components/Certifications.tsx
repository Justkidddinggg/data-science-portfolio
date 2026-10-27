import { motion } from 'framer-motion';
import { useState } from 'react';
const certificates = [
  { title: 'Advanced SQL', issuer: 'Kaggle', category: 'SQL & Analytics', image: '/certificates/advanced-sql.webp', url: '' },
  { title: 'Intermediate Machine Learning', issuer: 'Kaggle', category: 'Machine Learning', image: '/certificates/intermediate-ml.webp', url: 'https://www.kaggle.com/learn/certification/chakrapongpindontree/intermediate-machine-learning' },
  { title: 'Introduction to Data Science', issuer: 'Cisco Networking Academy', category: 'Data Science', image: '/certificates/cisco-data-science.webp', url: '' },
  { title: 'AI Agent with Microsoft Copilot', issuer: 'SCB Academy', category: 'Generative AI', image: '/certificates/scb-ai-agent.webp', url: '' },
  { title: 'Data-Driven Marketing in Use', issuer: 'Klasssi', category: 'Business Analytics', image: '/certificates/data-driven-marketing.webp', url: '' },
  { title: 'Intro to Python for Automation', issuer: 'Klasssi', category: 'Python Automation', image: '/certificates/python-automation.webp', url: '' },
  { title: 'My GENIEs Workshop', issuer: 'Chulalongkorn University', category: 'AI Workshop', image: '/certificates/chula-genies.webp', url: '' }
];
export default function Certifications() {
 const [selected,setSelected]=useState<number|null>(null);
 return <section id="certifications" className="bg-white px-6 py-24 text-slate-900 sm:px-10">
  <div className="mx-auto max-w-6xl">
   <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="mb-12">
    <p className="mb-3 text-sm font-semibold uppercase tracking-[.2em] text-blue-700">Continuous learning</p>
    <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">Certifications & Achievements</h2>
    <p className="mt-4 max-w-2xl text-slate-500">A selection of completed learning programs across data, machine learning and AI.</p>
   </motion.div>
   <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
    {certificates.map((c,i)=><motion.article key={c.title} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:(i%3)*.06}} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
     <button type="button" onClick={()=>setSelected(i)} className="block w-full cursor-zoom-in bg-white p-3" aria-label={'Preview '+c.title}><img src={c.image} alt={c.title+' certificate'} loading="lazy" className="h-40 w-full rounded-lg object-contain"/></button>
     <div className="p-5"><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-700">{c.category}</p><h3 className="text-lg font-semibold leading-snug">{c.title}</h3><p className="mt-2 text-sm text-slate-500">{c.issuer}</p>
      <div className="mt-5 flex flex-wrap gap-4"><button onClick={()=>setSelected(i)} className="text-sm font-semibold text-blue-800 hover:underline">View certificate ↗</button>{c.url&&<a href={c.url} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-600 hover:underline">Verify credential ↗</a>}</div>
     </div>
    </motion.article>)}
   </div>
  </div>
  {selected!==null&&<div role="dialog" aria-modal="true" aria-label="Certificate preview" onClick={()=>setSelected(null)} className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/85 p-4"><div onClick={e=>e.stopPropagation()} className="relative max-h-[95vh] max-w-5xl overflow-auto rounded-xl bg-white p-4 shadow-2xl"><button onClick={()=>setSelected(null)} aria-label="Close preview" className="absolute right-3 top-3 rounded-full bg-slate-900 px-3 py-1 text-white">✕</button><img src={certificates[selected].image} alt={certificates[selected].title} className="max-h-[80vh] w-full object-contain"/><p className="mt-2 text-center text-sm text-slate-600">{certificates[selected].title} — {certificates[selected].issuer}</p></div></div>}
 </section>
}
