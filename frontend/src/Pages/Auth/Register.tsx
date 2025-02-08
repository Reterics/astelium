import React, { useState } from 'react';
import {router} from "@inertiajs/react";

const Register: React.FC = () => {
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/register', data, {
            onError: (err) => setErrors(err as Record<string, string>),
        });
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={data.name} onChange={handleChange} />
                    {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={data.email} onChange={handleChange} />
                    {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={data.password} onChange={handleChange} />
                    {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input type="password" name="password_confirmation" value={data.password_confirmation} onChange={handleChange} />
                    {errors.password_confirmation && <div style={{ color: 'red' }}>{errors.password_confirmation}</div>}
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
