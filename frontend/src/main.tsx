import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/*.tsx', { eager: true })
        return pages[`./Pages/${name}.tsx`] || pages[Object.keys(pages)[0]]
    },
    setup({ el, App, props }) {
        props.initialPage.component = 'Dashboard'
        console.log(el)
        createRoot(el).render(<App {...props} />)
    },
    id: 'root'
})