import { Scale, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
        <img 
          src="https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
          alt="Abstract background" 
          className="object-cover w-full h-full opacity-10"
        />
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6 flex items-center gap-4 p-3 border border-border rounded-full bg-surface/50 backdrop-blur-md"
        >
          <div className="p-2 bg-primary/10 rounded-full">
            <Scale className="h-6 w-6 text-primary" />
          </div>
          <span className="text-text-secondary font-medium">Fair & Impartial Resolutions</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 100 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400"
        >
          AI Arbiter
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-4 max-w-2xl text-lg md:text-xl text-text-secondary"
        >
          Resolve everyday disputes with the clarity of AI. A modern, private, and streamlined approach to finding common ground.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="mt-10"
        >
          <button className="px-8 py-4 bg-primary text-background font-bold rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 animate-subtle-glow">
            Begin a Resolution
          </button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12 flex items-center gap-2 text-sm text-text-secondary"
        >
          <ShieldCheck className="h-4 w-4 text-success" />
          <span>Private by Design &bull; Legally Non-Binding Advice</span>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
