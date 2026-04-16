import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Users, Calendar } from 'lucide-react';
import api from '../../../services/api';
import styles from './Sites.module.css';

const SiteList = () => {
    const [sites, setSites] = useState([]);
    const [error, setError] = useState('');

    const loadSites = async () => {
        setError('');
        try {
            const data = await api.getSites();
            setSites(data);
        } catch (error) {
            console.error('Failed to load sites:', error);
            setError('Failed to load sites. Please try again.');
        }
    };

    useEffect(() => {
        queueMicrotask(() => {
            loadSites();
        });
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Construction Sites</h1>
                <Link to="/admin/sites/create" className={styles.createButton}>
                    <Plus size={20} />
                    Create New Site
                </Link>
            </div>

            {error && (
                <div className={styles.errorState}>
                    <p>{error}</p>
                    <button className={styles.createButton} onClick={loadSites}>Retry</button>
                </div>
            )}

            <div className={styles.grid}>
                {sites.map((site) => (
                    <div key={site.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>{site.name}</h3>
                            <span className={`${styles.status} ${styles[site.status.toLowerCase()]}`}>
                                {site.status}
                            </span>
                        </div>

                        <div className={styles.cardBody}>
                            <div className={styles.infoRow}>
                                <MapPin size={16} />
                                <span>{site.location}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <Users size={16} />
                                <span>{site.manager}</span>
                            </div>

                            <div className={styles.progressContainer}>
                                <div className={styles.progressLabel}>
                                    <span>Progress</span>
                                    <span>{site.progress}%</span>
                                </div>
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{ width: `${site.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SiteList;
