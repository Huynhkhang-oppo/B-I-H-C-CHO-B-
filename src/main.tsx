import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Auto-register service worker for full offline caching (safely wrapped)
try {
  registerSW({
    immediate: true,
    onNeedRefresh() {
      console.log('Bé Vui Học: Có phiên bản bài học mới!');
    },
    onOfflineReady() {
      console.log('Bé Vui Học: Đã sẵn sàng học ngoại tuyến 100% không cần mạng!');
    },
  });
} catch (err) {
  console.warn('PWA service worker registration skipped:', err);
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
