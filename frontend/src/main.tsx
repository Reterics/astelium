import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import App from "./App.tsx";

createInertiaApp({
    resolve: (name) =>
        import(`./Pages/${name}.tsx`).then((module) => module.default),
    setup({ el, App: InertiaApp, props }) {
        createRoot(el).render(
            <App>
                <InertiaApp {...props} />
            </App>
        )
    },
    id: 'app'
}).then(()=> {
    console.log('Inertia App loaded')
})