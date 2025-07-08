import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const { 
    user, 
    session, 
    isAuthenticated, 
    isLoading, 
    signIn, 
    signUp, 
    signOut 
  } = useAuthStore();

  return { user, session, isAuthenticated, isLoading, signIn, signUp, signOut };
};
