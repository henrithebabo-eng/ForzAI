import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, Wand2, Download, Play, Share2, Sparkles, Loader2, Clapperboard, Film } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { AIService } from '@/src/services/ai';

const VIDEO_STYLES = ['Cinematic', '3D Animation', 'Cyberpunk', 'Klassisch', 'Vaporwave', 'Natur'];

export default function VideoGen() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Cinematic');
  const [generating, setGenerating] = useState(false);
  const [videos, setVideos] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleGenerate = async () => {
    if (!prompt) return;
    setGenerating(true);
    try {
      const videoUrl = await AIService.generateVideo(prompt, style);
      setVideos([videoUrl, ...videos]);
      setPrompt('');
    } catch (error) {
      console.error("Fehler bei der Video-Generierung:", error);
      alert("Das Video konnte nicht erstellt werden. Eventuell ist das Limit für heute erreicht.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `forzki-video-${Date.now()}.mp4`;
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
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tighter leading-tight">KI Video Generator</h1>
            <p className="text-slate-400 mb-8">Erzeugen Sie filmreife Kurzvideos aus einer einfachen Textbeschreibung.</p>
          </motion.div>
        </header>

        {/* Control Center */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto bg-white/5 p-6 rounded-[2.5rem] border border-white/10 backdrop-blur-xl shadow-2xl mb-16"
        >
          <div className="space-y-6">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ein neonfarbener Wasserfall in einer futuristischen Marsstadt..."
                className="w-full h-32 bg-[#020617] border border-white/10 rounded-3xl p-6 text-white focus:border-blue-500 outline-none transition-all pr-12 resize-none shadow-inner"
              />
              <Film className="absolute right-6 bottom-6 text-slate-600 pointer-events-none" />
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 w-full overflow-hidden">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 block px-1">
                  Visueller Stil
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {VIDEO_STYLES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStyle(s)}
                      className={cn(
                        "px-4 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap",
                        style === s ? "bg-white text-black border-white shadow-lg shadow-white/10" : "bg-white/5 text-slate-500 border-white/10 hover:border-white/20"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={handleGenerate}
                disabled={generating || !prompt}
                className="h-16 w-full md:w-auto bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-2xl px-10 shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex items-center justify-center gap-3 shrink-0"
              >
                {generating ? <Loader2 className="animate-spin" /> : <Clapperboard size={20} />}
                {generating ? 'Regie führt...' : 'Szenario filmen'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Scene Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {generating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="aspect-video bg-[#020617] rounded-[2rem] overflow-hidden flex items-center justify-center border border-white/5 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-transparent animate-pulse" />
                <div className="z-10 text-center">
                  <div className="w-16 h-16 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                  <span className="text-slate-500 font-bold text-xs tracking-[0.3em] uppercase">Rendert Szene...</span>
                </div>
              </motion.div>
            )}
            
            {videos.map((url, i) => (
              <motion.div
                key={url + i}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="aspect-video bg-[#020617] rounded-[2rem] overflow-hidden relative group border border-white/10 shadow-2xl"
              >
                <video 
                  src={url} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {/* Visual Polish Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60" />
                
                {/* Actions */}
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                  <button className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
                    <Play fill="currentColor" size={24} />
                  </button>
                  <button 
                    onClick={() => handleDownload(url)}
                    className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white flex items-center justify-center hover:bg-white hover:text-black transition-all"
                  >
                    <Download size={20} />
                  </button>
                </div>
                
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded text-[10px] font-bold text-blue-400 uppercase">
                      {style}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">4K • 24fps</span>
                  </div>
                  <p className="text-white text-sm font-medium line-clamp-1">{prompt}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {videos.length === 0 && !generating && (
          <div className="text-center py-24 glass-panel rounded-[3rem] max-w-xl mx-auto">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-400">
              <Film size={32} />
            </div>
            <h3 className="text-white font-bold text-lg">Noch keine Visionen gefilmt</h3>
            <p className="text-slate-500 text-sm mt-2">Beschreiben Sie eine Szene, um die KI-Regie zu starten.</p>
          </div>
        )}
      </div>
    </div>
  );
}
