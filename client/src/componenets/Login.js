import { useState } from 'react';

export default function Login({ onLogin}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
        const res = await fetch('/api/users/login', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),

        });

        if( res.ok) {
            const { token } = await res.json();
            onLogin(token);
        } else {
            alert ('Invalid credentials');

        }
        };

        return (
           <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <input 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                type="password"
                placeholder='Password'
                value={password}
                onChange={ (e) => setPassword(e.target.value)}
                 />
                 <button type="submit" >Login</button>
         </form>
        )
    }
