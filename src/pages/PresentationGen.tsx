import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layout, Palette, Wand2, Plus, MonitorPlay, ChevronRight, FileText, X, ChevronLeft } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { AIService } from '@/src/services/ai';
import PptxGenJS from 'pptxgenjs';

interface Slide {
  title: string;
  content: string[];
  imageUrl?: string;
}

export default function PresentationGen() {
  const [topic, setTopic] = useState('');
  const [slidesCount, setSlidesCount] = useState(5);
  const [style, setStyle] = useState('Modern');
  const [generating, setGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [generatedSlides, setGeneratedSlides] = useState<Slide[]>([]);
  const [isPresenting, setIsPresenting] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slidesRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!topic) return;
    setGenerating(true);
    setIsGenerated(false);
    try {
      const slides = await AIService.generatePresentation(topic, slidesCount, style);
      setGeneratedSlides(slides);
      setIsGenerated(true);
      setGenerating(false);
      setTopic('');

      // Progressive Image Loading - Sequential to respect rate limits
      (async () => {
        for (let index = 0; index < slides.length; index++) {
          const slide = slides[index];
          try {
            const imagePrompt = `Visual presentation slide illustration for: ${slide.title}. ${slide.content.join(' ')}. Professional, clean, abstract.`;
            const imageUrl = await AIService.generateImage(imagePrompt, style);
            
            setGeneratedSlides(prev => {
              const next = [...prev];
              if (next[index]) {
                next[index] = { ...next[index], imageUrl };
              }
              return next;
            });
            
            // Wait between image requests to avoid 429 quota errors
            if (index < slides.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 4000));
            }
          } catch (err) {
            console.error(`Failed to load image for slide ${index}:`, err);
          }
        }
      })();
    } catch (error) {
      console.error("Fehler bei der Generierung:", error);
      alert("Die Generierung konnte nicht abgeschlossen werden. Bitte versuchen Sie es gleich noch einmal.");
      setGenerating(false);
    }
  };

  const handleDownloadPPTX = async () => {
    if (!generatedSlides.length) return;
    
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';

    generatedSlides.forEach((slide, i) => {
      const pptxSlide = pptx.addSlide();
      
      // Title slide special styling or just simple?
      // Let's use some background colors for variety
      if (i === 0) {
        pptxSlide.background = { color: '1e3a8a' }; // Dark blue header
      } else {
        pptxSlide.background = { color: '0a0a0a' }; // Dark background
      }

      // Add Title
      pptxSlide.addText(slide.title, {
        x: 0.5,
        y: 0.5,
        w: '90%',
        h: 1,
        fontSize: 32,
        bold: true,
        color: 'FFFFFF',
        align: 'center',
        valign: 'middle'
      });

      // Add Content (Bullet points)
      pptxSlide.addText(slide.content.join('\n'), {
        x: 0.5,
        y: 1.5,
        w: slide.imageUrl ? '60%' : '90%',
        h: 3,
        fontSize: 18,
        color: 'CCCCCC',
        bullet: true,
        valign: 'top'
      });

      // Add Image if exists
      if (slide.imageUrl) {
        pptxSlide.addImage({
          path: slide.imageUrl,
          x: 6.5,
          y: 1.5,
          w: 3,
          h: 3,
          sizing: { type: 'cover', w: 3, h: 3 }
        });
      }
    });

    pptx.writeFile({ fileName: `presentation-${Date.now()}.pptx` });
  };

  const handlePresent = () => {
    setIsPresenting(true);
    setCurrentSlideIndex(0);
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % generatedSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + generatedSlides.length) % generatedSlides.length);
  };

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Präsentationen</h1>
            <p className="text-zinc-400 mb-8">Erstellen Sie professionelle Slides in Sekunden.</p>
            
            <div className="space-y-6 bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Thema / Inhalt</label>
                <textarea
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    setIsGenerated(false);
                  }}
                  placeholder="Beschreiben Sie Ihre Präsentation..."
                  className="w-full h-32 bg-[#020617] border border-white/10 rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all resize-none shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Anzahl der Slides ({slidesCount})</label>
                <input
                  type="range"
                  min="3"
                  max="15"
                  value={slidesCount}
                  onChange={(e) => {
                    setSlidesCount(parseInt(e.target.value));
                    setIsGenerated(false);
                  }}
                  className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Stil / Design</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Modern', 'Business', 'Cyberpunk', 'Minimal'].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setStyle(s);
                        setIsGenerated(false);
                      }}
                      className={cn(
                        "py-2 rounded-xl text-sm font-medium border transition-all",
                        style === s ? "border-blue-500 bg-blue-500/10 text-white" : "border-white/5 bg-black/40 text-slate-500 hover:border-white/20"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={generating || !topic}
                onClick={handleGenerate}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-2"
              >
                {generating ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Wand2 size={20} /></motion.div> : <Wand2 size={20} />}
                {generating ? 'Generiere...' : 'Slides erstellen'}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Main Preview Area */}
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full"
          >
            {generating ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-zinc-900/20 border border-white/5 border-dashed rounded-[2.5rem] space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">Die KI denkt nach...</h3>
                  <p className="text-zinc-500 text-sm">Gliederung wird erstellt und Inhalte optimiert.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isGenerated ? (
                   generatedSlides.map((slide, i) => (
                     <motion.div
                       key={i}
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       transition={{ delay: i * 0.1 }}
                       whileHover={{ scale: 1.02 }}
                       className="aspect-video bg-zinc-900 rounded-3xl border border-white/5 p-6 flex flex-col justify-between group overflow-hidden relative shadow-lg"
                     >
                       <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                         <Layout size={18} className="text-blue-400" />
                       </div>
                       
                       {slide.imageUrl ? (
                         <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                           <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                         </div>
                       ) : (
                         <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                           <div className="w-6 h-6 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin" />
                         </div>
                       )}

                       <div className="space-y-3 relative z-10">
                         <div className="w-12 h-1 bg-blue-500/50 rounded-full" />
                         <h4 className="text-white font-bold leading-tight line-clamp-1">{slide.title}</h4>
                         <ul className="space-y-1">
                           {slide.content.map((point, pi) => (
                             <li key={pi} className="text-[10px] text-zinc-400 flex items-start gap-1">
                               <span className="w-1 h-1 bg-zinc-600 rounded-full mt-1 shrink-0" />
                               <span className="line-clamp-2">{point}</span>
                             </li>
                           ))}
                         </ul>
                       </div>
                     </motion.div>
                   ))
                 ) : (
                   [1, 2, 3, 4].map((i) => (
                     <div
                       key={i}
                       className="aspect-video bg-zinc-900/30 rounded-3xl border border-white/5 p-6 flex flex-col justify-between opacity-50"
                     >
                       <div className="space-y-4">
                         <div className="w-12 h-1 bg-blue-500/20 rounded-full" />
                         <div className="space-y-2">
                           <div className="h-6 w-3/4 bg-white/10 rounded-md" />
                           <div className="h-3 w-1/2 bg-white/5 rounded-md" />
                         </div>
                       </div>
                     </div>
                   ))
                 )}
                 <button className="aspect-video bg-zinc-900/30 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-zinc-900 hover:border-white/10 transition-all text-zinc-500 group">
                   <Plus className="group-hover:scale-125 transition-transform" />
                   <span className="text-sm font-medium">Neue Slide hinzufügen</span>
                 </button>
               </div>
             )}
 
             {!generating && isGenerated && (
               <div className="mt-12 p-8 bg-blue-600 rounded-[2rem] flex items-center justify-between shadow-2xl">
                 <div>
                   <h3 className="text-2xl font-bold text-white mb-1">Export-Bereit</h3>
                   <p className="text-white/60">Ihre Präsentation wurde erfolgreich generiert.</p>
                 </div>
                 <div className="flex gap-3">
                   <button 
                    onClick={handleDownloadPPTX}
                    className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-lg"
                   >
                     <FileText size={18} />
                     Download PPTX
                   </button>
                   <button 
                    onClick={handlePresent}
                    className="bg-blue-900/50 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-900 transition-all flex items-center gap-2 border border-white/10"
                   >
                     <MonitorPlay size={18} />
                     Präsentieren
                   </button>
                 </div>
               </div>
             )}
           </motion.div>
         </div>
       </div>

       {/* Presentation Modal */}
       <AnimatePresence>
        {isPresenting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8 overflow-hidden"
          >
            <button 
              onClick={() => setIsPresenting(false)}
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>

            <div className="w-full max-w-6xl aspect-video relative group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlideIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="w-full h-full bg-zinc-900 rounded-[3rem] border border-white/10 p-16 flex flex-col justify-center relative overflow-hidden"
                >
                  {generatedSlides[currentSlideIndex].imageUrl ? (
                    <div className="absolute inset-0 opacity-10">
                      <img src={generatedSlides[currentSlideIndex].imageUrl} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 opacity-5 flex items-center justify-center">
                      <div className="w-20 h-20 border-4 border-white/5 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                  )}

                  <div className="relative z-10 flex gap-12 items-center">
                    <div className="flex-1 space-y-8">
                      <div className="w-20 h-2 bg-blue-500 rounded-full" />
                      <h2 className="text-6xl font-bold text-white leading-tight">
                        {generatedSlides[currentSlideIndex].title}
                      </h2>
                      <ul className="space-y-6">
                        {generatedSlides[currentSlideIndex].content.map((point, i) => (
                          <li key={i} className="text-2xl text-zinc-400 flex items-start gap-4">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mt-4 shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="w-1/3 aspect-square rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-black/20 flex items-center justify-center">
                      {generatedSlides[currentSlideIndex].imageUrl ? (
                        <img src={generatedSlides[currentSlideIndex].imageUrl} alt={generatedSlides[currentSlideIndex].title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin" />
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls */}
              <div className="absolute inset-y-0 -left-20 flex items-center">
                <button 
                  onClick={prevSlide}
                  className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
              </div>
              <div className="absolute inset-y-0 -right-20 flex items-center">
                <button 
                  onClick={nextSlide}
                  className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            <div className="mt-12 flex gap-2">
              {generatedSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlideIndex(i)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all",
                    currentSlideIndex === i ? "bg-blue-500 w-8" : "bg-white/10 hover:bg-white/20"
                  )}
                />
              ))}
            </div>
            
            <p className="mt-8 text-zinc-500 text-sm font-medium tracking-widest uppercase">
              Slide {currentSlideIndex + 1} von {generatedSlides.length}
            </p>
          </motion.div>
        )}
       </AnimatePresence>
     </div>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m12 3-1.912 5.813L4.275 10.725 10.088 12.637 12 18.45l1.912-5.813 5.813-1.912-5.813-1.912z" />
      <path d="M5 3v4" /><path d="M3 5h4" /><path d="M21 17v4" /><path d="M19 19h4" />
    </svg>
  );
}

