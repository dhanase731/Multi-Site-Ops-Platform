import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, Mail, Lock, User, ArrowRight } from 'lucide-react';
import styles from './Login.module.css'; // Reusing Login styles for consistency

const SignUp = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        fullName: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await signup(formData.companyName, formData.fullName, formData.email, formData.password);
            navigate('/admin/dashboard', { replace: true });
        } catch (err) {
            setError(err.message || 'Failed to create account');
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
                    <h1 className={styles.title}>Get Started</h1>
                    <p className={styles.subtitle}>Create your construction company account</p>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="companyName">Company Name</label>
                        <div className={styles.inputWrapper}>
                            <Building2 size={18} className={styles.inputIcon} />
                            <input
                                type="text"
                                id="companyName"
                                name="companyName"
                                placeholder="e.g. Acme Constructions"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="fullName">Full Name</label>
                        <div className={styles.inputWrapper}>
                            <User size={18} className={styles.inputIcon} />
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={handleChange}
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
                                name="email"
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={handleChange}
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
                                name="password"
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={isSubmitting} className={styles.button}>
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p>Already have an account? <Link to="/login">Sign In</Link></p>
                    <p><Link to="/about">About this website</Link></p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
