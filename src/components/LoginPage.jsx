import React, { useState } from 'react';
import './styles/compstyle.css';
import { auth, database } from './../firebase.js';
import { ref, get } from 'firebase/database';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Fetch user role from Realtime Database
            const userRef = ref(database, `users/${user.uid}`);
            const snapshot = await get(userRef);

            if (snapshot.exists()) {
                const userData = snapshot.val();
                console.log('User Data:', userData);

                // Redirect based on user role
            navigate('/organizer-dashboard');
            } else {
                setError('User data not found.');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
            <div>
                <div className="login-heading">Welcome to EvenZo</div>
                <form className="login-box" onSubmit={handleAuth}>
                    <h1>{isRegistering ? 'Create Account' : 'Sign In'}</h1>

                    {error && <p className="error-message">{error}</p>}

                    <input
                        className='input-field'
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        className='input-field'
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button className='login-button' type="submit">
                        {isRegistering ? 'Register' : 'Login'}
                    </button>

                    <p>
                        {isRegistering ? 'Already have an account? ' : 'New to EvenZo? '}
                        <span className='signup' onClick={() => setIsRegistering(!isRegistering)}>
                            {isRegistering ? 'Login' : 'Create an account on our mobile app'}
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
  