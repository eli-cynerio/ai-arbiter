import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AtSign, Lock, LogIn } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await signIn(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'url(https://images.pexels.com/photos/158771/justice-law-case-hearing-158771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-lg"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8 space-y-6 bg-surface/50 border border-border rounded-2xl shadow-2xl shadow-primary/10"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text">Welcome Back</h1>
          <p className="text-text-secondary mt-2">Sign in to continue to AI Arbiter.</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative">
            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
            <input 
              {...register('email')}
              type="email" 
              placeholder="Email"
              className="w-full pl-10 pr-3 py-3 bg-surface border border-border rounded-lg text-text focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
            {errors.email && <p className="text-error text-sm mt-1">{errors.email.message}</p>}
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
            <input 
              {...register('password')}
              type="password" 
              placeholder="Password"
              className="w-full pl-10 pr-3 py-3 bg-surface border border-border rounded-lg text-text focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
            {errors.password && <p className="text-error text-sm mt-1">{errors.password.message}</p>}
          </div>

          {error && <p className="text-error text-center text-sm">{error}</p>}
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-primary text-background font-bold rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
            {!isSubmitting && <LogIn size={18} />}
          </button>
        </form>
        
        <p className="text-center text-sm text-text-secondary">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
