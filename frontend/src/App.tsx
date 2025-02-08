import React from 'react';

interface AppProps {
    children: React.ReactNode;
}

export default function App({ children }: AppProps) {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Global header, sidebar, or other layout components can go here */}
            {children}
        </div>
    );
}