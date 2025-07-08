import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-text">Dashboard</h1>
        <p className="mt-2 text-text-secondary">Welcome back, {user?.email}</p>
      </motion.div>

      <motion.div 
        className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {/* Placeholder for dashboard content */}
        <motion.div 
          className="p-6 bg-surface border border-border rounded-lg"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
          <h2 className="text-xl font-semibold text-text">My Conflicts</h2>
          <p className="mt-2 text-text-secondary">You have no active conflicts.</p>
          <button className="mt-4 px-4 py-2 bg-primary text-background font-bold rounded-lg text-sm hover:bg-primary/90 transition-colors">
            Start a New Resolution
          </button>
        </motion.div>
        <motion.div 
          className="p-6 bg-surface border border-border rounded-lg"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
          <h2 className="text-xl font-semibold text-text">Account Settings</h2>
          <p className="mt-2 text-text-secondary">Manage your profile and preferences.</p>
        </motion.div>
        <motion.div 
          className="p-6 bg-surface border border-border rounded-lg"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
          <h2 className="text-xl font-semibold text-text">Resolution History</h2>
          <p className="mt-2 text-text-secondary">View your past resolutions.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
