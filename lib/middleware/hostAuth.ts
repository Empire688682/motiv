import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function useHostAuth() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Pages that don't require authentication
  const publicHostPages = ['/hosts/signin', '/hosts/signup'];
  const isPublicPage = publicHostPages.includes(pathname);

  useEffect(() => {
    if (!isLoading && !isPublicPage) {
      if (!user) {
        // Not authenticated, redirect to host signin
        router.push('/hosts/signin');
      } else if (user.role === 'guest') {
        // User is authenticated but is a guest, show error and redirect to home
        toast.error('Guests cannot use host mode');
        router.push('/');
      }
    }
  }, [user, isLoading, router, isPublicPage]);

  const isHost = user?.role && ['host', 'admin', 'superhost'].includes(user.role);
  const canAccessHostFeatures = isPublicPage || (!!user && isHost);

  return {
    user,
    isLoading,
    isHost,
    canAccessHostFeatures,
  };
}