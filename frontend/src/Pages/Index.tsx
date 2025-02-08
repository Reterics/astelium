import React from 'react';
import { Link } from "@inertiajs/react";


const Index: React.FC = () => {
    return (
        <div>
            <h1>Welcome to Our Public Site</h1>
            <p>This is the landing page for everyone.</p>
            <Link href='/login'>Login</Link>
        </div>
    );
};

export default Index;
