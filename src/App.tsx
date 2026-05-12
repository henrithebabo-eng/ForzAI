import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PresentationGen from './pages/PresentationGen';
import ImageGen from './pages/ImageGen';
import VideoGen from './pages/VideoGen';
import HomeworkAI from './pages/HomeworkAI';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle browser navigation
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    
    // Simulate initial load
    setTimeout(() => setLoading(false), 1200);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPath) {
      case '/presentations': return <PresentationGen />;
      case '/images': return <ImageGen />;
      case '/videos': return <VideoGen />;
      case '/homework': return <HomeworkAI />;
      default: return <Home onNavigate={navigate} />;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#0A0A0A] flex flex-col items-center justify-center">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.5)] mb-8"
        >
          <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        </motion.div>
        <div className="text-zinc-500 font-bold tracking-[0.3em] uppercase text-xs animate-pulse">Lade ForzAI</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar currentPath={currentPath} onNavigate={navigate} />
      
      <main className="min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
