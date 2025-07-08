import { Link, useNavigate } from 'react-router-dom';
import { Scale, LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background text-text">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-text hover:text-primary transition-colors">
              <Scale className="h-6 w-6 text-primary" />
              <span>AI Arbiter</span>
            </Link>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text transition-colors flex items-center gap-2">
                    <Shield size={16} />
                    Dashboard
                  </Link>
                  <button onClick={handleSignOut} className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text transition-colors flex items-center gap-2">
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text transition-colors">
                    Login
                  </Link>
                  <Link to="/signup" className="px-4 py-2 text-sm font-bold bg-primary text-background rounded-md hover:bg-primary/90 transition-colors">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>
      <main className="pt-20">{children}</main>
    </div>
  );
};

export default Layout;
