import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Zap, Shield, Brain, ArrowRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import GlowEffect from '@/src/components/GlowEffect';

export default function Home({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <GlowEffect className="top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px]" color="bg-blue-600" opacity="opacity-20" />
        <GlowEffect className="top-40 right-0 w-[400px] h-[400px]" color="bg-purple-600" opacity="opacity-10" />

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-slate-400 mb-8 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 text-blue-400" />
              Revolutionieren Sie Ihren Workflow mit KI
            </span>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
              "Yurr Sup ma Ne" <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">
                -Anton
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Alter ihr habt auch kein mehr auf Lern Bunker? Dann Benutzt ForzKI
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => onNavigate('/presentations')}
                className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-2 group shadow-[0_0_30px_rgba(59,130,246,0.2)]"
              >
                Kostenlos testen
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto bg-white/5 text-white border border-white/10 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all">
                Demo ansehen
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-20 relative px-4"
          >
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(79,70,229,0.15)] max-w-5xl mx-auto">
              <img 
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2000" 
                alt="AI Dashboard Preview" 
                className="w-full grayscale-[0.5] hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Blitzschnell",
                desc: "Erstellen Sie komplexe Inhalte in Sekunden statt in Stunden. Unser Algorithmus ist auf maximale Performance getrimmt.",
                color: "text-blue-400",
                bg: "bg-blue-600/10"
              },
              {
                icon: Brain,
                title: "Integrierte Intelligenz",
                desc: "Mehr als nur Vorlagen. ForzAI versteht den Kontext und liefert präzise, menschenähnliche Ergebnisse.",
                color: "text-purple-400",
                bg: "bg-purple-600/10"
              },
              {
                icon: Shield,
                title: "Sicher & Privat",
                desc: "Ihre Daten gehören Ihnen. Wir verwenden modernste Verschlüsselung, um Ihre Privatsphäre zu schützen.",
                color: "text-emerald-400",
                bg: "bg-emerald-600/10"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", feature.bg)}>
                  <feature.icon className={cn("w-6 h-6", feature.color)} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-br from-indigo-900/40 to-black border border-white/10 p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400/10 blur-[80px] rounded-full" />
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tighter">Bereit für die Zukunft?</h2>
          <p className="text-xl text-indigo-200/60 mb-10 max-w-xl mx-auto">
            Schließen Sie sich tausenden von Profis an, die ihren Alltag bereits mit ForzAI transformieren.
          </p>
          <button className="bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-zinc-200 transition-all shadow-xl">
            Jetzt kostenlos anmelden
          </button>
        </div>
      </section>
    </div>
  );
}
