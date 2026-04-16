import React, { useEffect, useState } from 'react';
import { ClipboardCheck, Plus, Camera, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../../../components/Shared/Badge';
import api from '../../../services/api';
import styles from './Inspections.module.css';

const InspectionsList = () => {
    const [inspections, setInspections] = useState([]);

    const loadInspections = async () => {
        try {
            const data = await api.getInspections();
            setInspections(data);
        } catch (error) {
            console.error('Failed to load inspections:', error);
        }
    };

    useEffect(() => {
        queueMicrotask(() => {
            loadInspections();
        });
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PASSED':
                return <CheckCircle size={16} />;
            case 'FAILED':
                return <XCircle size={16} />;
            case 'PENDING':
                return <Clock size={16} />;
            default:
                return null;
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'PASSED':
                return 'approved';
            case 'FAILED':
                return 'high';
            case 'PENDING':
                return 'medium';
            default:
                return 'default';
        }
    };

    const getStatusCounts = () => {
        return {
            total: inspections.length,
            passed: inspections.filter(i => i.status === 'PASSED').length,
            failed: inspections.filter(i => i.status === 'FAILED').length,
            pending: inspections.filter(i => i.status === 'PENDING').length,
        };
    };

    const counts = getStatusCounts();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Site Inspections</h1>
                <Link to="/site/inspections/create" className={styles.createButton}>
                    <Plus size={18} />
                    New Inspection
                </Link>
            </div>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                        <ClipboardCheck size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Total Inspections</p>
                        <p className={styles.statValue}>{counts.total}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Passed</p>
                        <p className={styles.statValue}>{counts.passed}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                        <XCircle size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Failed</p>
                        <p className={styles.statValue}>{counts.failed}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                        <Clock size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Pending</p>
                        <p className={styles.statValue}>{counts.pending}</p>
                    </div>
                </div>
            </div>

            {/* Inspections List */}
            <div className={styles.inspectionsList}>
                {inspections.map(inspection => (
                    <div key={inspection.id} className={styles.inspectionCard}>
                        <div className={styles.cardHeader}>
                            <div>
                                <h3 className={styles.cardTitle}>{inspection.taskTitle}</h3>
                                <p className={styles.cardSubtitle}>{inspection.siteName}</p>
                            </div>
                            <Badge variant={getStatusVariant(inspection.status)}>
                                {getStatusIcon(inspection.status)}
                                {inspection.status}
                            </Badge>
                        </div>

                        <div className={styles.cardBody}>
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Inspector:</span>
                                <span>{inspection.inspectorName}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Date:</span>
                                <span>{new Date(inspection.date).toLocaleDateString()}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Photos:</span>
                                <span>
                                    <Camera size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                    {inspection.photos}
                                </span>
                            </div>
                            <div className={styles.remarks}>
                                <span className={styles.label}>Remarks:</span>
                                <p>{inspection.remarks}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InspectionsList;
