import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Auto-register service worker for full offline caching
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('Bé Vui Học: Có phiên bản bài học mới!');
  },
  onOfflineReady() {
    console.log('Bé Vui Học: Đã sẵn sàng học ngoại tuyến 100% không cần mạng!');
  },
});

createRoot(document.getElementById('root')!).render(<App />);
