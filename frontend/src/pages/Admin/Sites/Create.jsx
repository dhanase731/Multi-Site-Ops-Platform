import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Users } from 'lucide-react';
import api from '../../../services/api';
import styles from './Sites.module.css'; // Reusing styles for now

const CreateSite = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        manager: '',
        status: 'PLANNING'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.createSite(formData);
            navigate('/admin/sites');
        } catch (error) {
            console.error('Failed to create site:', error);
            alert('Failed to create site. Please try again.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={() => navigate(-1)} className={styles.backButton}>
                    <ArrowLeft size={20} />
                    Back to Sites
                </button>
                <h1 className={styles.title}>Create New Site</h1>
            </div>

            <div className={styles.formContainer}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Site Name</label>
                        <div className={styles.inputWrapper}>
                            <Building2 size={18} className={styles.inputIcon} />
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Metro Station 5"
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="location">Location</label>
                        <div className={styles.inputWrapper}>
                            <MapPin size={18} className={styles.inputIcon} />
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                placeholder="City, State"
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="manager">Assign Manager</label>
                        <div className={styles.inputWrapper}>
                            <Users size={18} className={styles.inputIcon} />
                            <select
                                id="manager"
                                name="manager"
                                value={formData.manager}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a Manager</option>
                                <option value="John Doe">John Doe</option>
                                <option value="Jane Smith">Jane Smith</option>
                                <option value="Mike Ross">Mike Ross</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" onClick={() => navigate('/admin/sites')} className={styles.cancelButton}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.submitButton}>
                            Create Site
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateSite;
