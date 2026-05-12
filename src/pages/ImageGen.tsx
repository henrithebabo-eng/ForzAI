import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Wand2, Download, Maximize2, Share2, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { AIService } from '@/src/services/ai';

const STYLES = ['Fotorealistisch', 'Anime', '3D Render', 'Ölgemälde', 'Digital Art', 'Skizze'];

export default function ImageGen() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Fotorealistisch');
  const [generating, setGenerating] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleGenerate = async () => {
    if (!prompt) return;
    setGenerating(true);
    try {
      const imageUrl = await AIService.generateImage(prompt, style);
      setImages([imageUrl, ...images]);
      setPrompt('');
    } catch (error) {
      console.error("Fehler bei der Bildgenerierung:", error);
      alert("Das Bild konnte nicht erstellt werden. Eventuell ist das Limit für heute erreicht.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `forzki-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tighter leading-tight">KI-Bildergenerator</h1>
            <p className="text-zinc-400 mb-8">Verwandeln Sie Ihre Worte in atemberaubende visuelle Meisterwerke mit unserer fortschrittlichen Engine.</p>
          </motion.div>
        </header>

        {/* Input Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto bg-zinc-900/50 p-4 rounded-[2.5rem] border border-white/5 backdrop-blur-xl shadow-2xl mb-16"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ein Astronaut reitet auf einem Panda im Weltraum..."
                className="w-full h-14 bg-[#020617] border border-white/10 rounded-3xl px-6 text-white focus:border-blue-500 outline-none transition-all pr-12 shadow-inner"
              />
              <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating || !prompt}
              className="h-14 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-3xl px-10 shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex items-center justify-center gap-2"
            >
              {generating ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
              {generating ? 'Generiere...' : 'Erstellen'}
            </button>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {STYLES.map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold transition-all border",
                  style === s ? "bg-white text-black border-white" : "bg-white/5 text-zinc-500 border-white/10 hover:border-white/20"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {generating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="aspect-square bg-zinc-900 rounded-[2rem] overflow-hidden flex items-center justify-center border border-white/5 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900 to-transparent animate-pulse" />
                <div className="z-10 text-center">
                  <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                  <span className="text-zinc-500 font-bold text-sm tracking-widest uppercase">Erschaffe...</span>
                </div>
              </motion.div>
            )}
            
            {images.map((url, i) => (
              <motion.div
                key={url}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="aspect-square bg-zinc-900 rounded-[2rem] overflow-hidden relative group border border-white/5"
              >
                <img 
                  src={url} 
                  alt="Generated AI Art" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={() => handleDownload(url)}
                    className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-white hover:text-black transition-all"
                  >
                    <Download size={20} />
                  </button>
                  <button className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-white hover:text-black transition-all">
                    <Maximize2 size={20} />
                  </button>
                  <button className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-white hover:text-black transition-all">
                    <Share2 size={20} />
                  </button>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-lg border border-white/10 p-3 rounded-2xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
                  <p className="text-white text-xs font-medium truncate">{prompt}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {images.length === 0 && !generating && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-600">
              <Sparkles size={32} />
            </div>
            <h3 className="text-zinc-500 font-bold">Noch keine Bilder generiert</h3>
            <p className="text-zinc-600 text-sm">Geben Sie oben einen Prompt ein, um zu beginnen.</p>
          </div>
        )}
      </div>
    </div>
  );
}
