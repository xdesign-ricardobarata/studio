'use client';

import { LogIn } from 'lucide-react';
import { Button } from './ui/button';

export function DummyLoginButton() {
  const handleLogin = () => {
    // In a real application, this would trigger an authentication flow.
    // For now, we'll just log a message to the console.
    console.log('Dummy login action triggered!');
    alert('Dummy login successful! (Check the console for details)');
  };

  return (
    <Button variant="outline" onClick={handleLogin}>
      <LogIn className="mr-2 h-4 w-4" />
      Dummy Login
    </Button>
  );
}
