// PWA Service Worker Registration and Utilities

export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      
      console.log('[PWA] Service Worker registered:', registration);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('[PWA] Service Worker update found');
        
        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[PWA] New service worker available');
            // Optionally show update notification
            if (window.confirm('New version available! Reload to update?')) {
              window.location.reload();
            }
          }
        });
      });
    } catch (error) {
      console.error('[PWA] Service Worker registration failed:', error);
    }
  });
}

export function unregisterServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker.ready.then((registration) => {
    registration.unregister();
  });
}

export function checkPWAInstallation() {
  if (typeof window === 'undefined') return false;
  
  // Check if app is installed
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
}

export function getPWADisplayMode() {
  if (typeof window === 'undefined') return 'browser';
  
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  if (isStandalone) return 'standalone';
  return 'browser';
}
