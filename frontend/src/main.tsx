import {createInertiaApp} from '@inertiajs/react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {resolvePageComponent} from 'laravel-vite-plugin/inertia-helpers';
import './index.css';

createInertiaApp({
  resolve: (name) =>
    resolvePageComponent(
      `./Pages/${name}.tsx`,
      import.meta.glob('./Pages/**/*.tsx')
    ),

  setup({el, App: InertiaApp, props}) {
    createRoot(el).render(
      <App>
        <InertiaApp {...props} />
      </App>
    );
  },
  id: 'app',
}).then(() => {
  console.log('Inertia App loaded');
});
