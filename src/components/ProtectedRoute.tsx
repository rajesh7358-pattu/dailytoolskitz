import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!mounted) return;

        if (!user) {
          setIsAuthenticated(false);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Get the user's profile to check admin status
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          if (mounted) {
            setIsAuthenticated(true);
            setIsAdmin(false);
          }
        } else if (mounted) {
          setIsAuthenticated(true);
          setIsAdmin(profile?.is_admin || false);
        }
      } catch (error) {
        console.error('Error checking user:', error);
        if (mounted) {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        if (mounted) {
          setIsAuthenticated(true);
          setIsAdmin(profile?.is_admin || false);
          setLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        if (mounted) {
          setIsAuthenticated(false);
          setIsAdmin(false);
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    toast.error('Please sign in to access this page');
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    toast.error('You do not have permission to access this page');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}