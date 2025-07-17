'use client';


import { LogIn, LogOut, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/use-auth';

export function AuthButton() {
  const { user, loading, signIn, signOut } = useAuth();

  if (loading) {
    return (
      <Button variant="outline" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (user) {
    return (
      <Button variant="outline" onClick={signOut}>
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    );
  }

  return (
    <Button variant="outline" onClick={signIn}>
      <LogIn className="mr-2 h-4 w-4" />
      Login with Google
    </Button>
  );
}
