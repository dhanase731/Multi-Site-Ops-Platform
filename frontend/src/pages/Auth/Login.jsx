import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Building2, Mail } from 'lucide-react';
import styles from './Login.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [tenantId, setTenantId] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/app';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            if (email === 'admin@demo.com') { // Mock logic for demo
                await login(email, tenantId);
                navigate('/admin/dashboard', { replace: true });
            } else {
                await login(email, tenantId);
                navigate(from, { replace: true });
            }
        } catch (err) {
            setError('Invalid credentials or tenant ID');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <Building2 size={32} className={styles.logoIcon} />
                    </div>
                    <h1 className={styles.title}>Site Ops Platform</h1>
                    <p className={styles.subtitle}>Sign in to your account</p>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="tenantId">Tenant ID</label>
                        <div className={styles.inputWrapper}>
                            <Building2 size={18} className={styles.inputIcon} />
                            <input
                                type="text"
                                id="tenantId"
                                placeholder="e.g. company-slug"
                                value={tenantId}
                                onChange={(e) => setTenantId(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email Address</label>
                        <div className={styles.inputWrapper}>
                            <Mail size={18} className={styles.inputIcon} />
                            <input
                                type="email"
                                id="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <div className={styles.inputWrapper}>
                            <Lock size={18} className={styles.inputIcon} />
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={isSubmitting} className={styles.button}>
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                    <p><Link to="/about">About this website</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
