import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Cpu className="text-indigo-500 w-8 h-8" />
            <span className="text-2xl font-bold tracking-tighter text-white">ForzAI</span>
          </div>
          <p className="text-zinc-400 max-w-sm leading-relaxed mb-8">
            Die nächste Generation der künstlichen Intelligenz. Wir bauen die Werkzeuge, 
            die Ihnen helfen, schneller zu denken, besser zu gestalten und intelligenter zu lernen.
          </p>
          <div className="flex gap-4">
            {[Twitter, Github, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-colors">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Plattform</h4>
          <ul className="space-y-4 text-zinc-400 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Präsentationen</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Bilder</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Hausaufgaben KI</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Rechtliches</h4>
          <ul className="space-y-4 text-zinc-400 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Datenschutz</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Impressum</a></li>
            <li><a href="#" className="hover:text-white transition-colors">AGB</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Cookie-Richtlinien</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-500 text-xs">
        <p>© 2026 ForzAI GmbH. Alle Rechte vorbehalten.</p>
        <p>Entwickelt in Berlin mit künstlicher Intelligenz.</p>
      </div>
    </footer>
  );
}
