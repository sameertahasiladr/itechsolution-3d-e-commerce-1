'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/pwa';

export default function PWAInit() {
  useEffect(() => {
    // Register service worker for PWA
    registerServiceWorker();
    
    // Handle install prompt
    let deferredPrompt: any;
    
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      console.log('[PWA] Install prompt ready');
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Log when app is installed
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App successfully installed');
      deferredPrompt = null;
    });
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  return null;
}
