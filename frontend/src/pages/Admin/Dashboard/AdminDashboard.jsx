import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, AlertTriangle, Package, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';
import api from '../../../services/api';
import styles from './Dashboard.module.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalSites: 0,
        activeUsers: 0,
        pendingApprovals: 0,
        lowStockItems: 0,
    });
    const [sites, setSites] = useState([]);
    const [actionItems, setActionItems] = useState([]);
    const [error, setError] = useState('');

    async function loadDashboardData() {
        setError('');
        try {
            const dashboardData = await api.getAdminDashboard();
            setSites(dashboardData.sites || []);
            setStats(dashboardData.stats || {
                totalSites: 0,
                activeUsers: 0,
                pendingApprovals: 0,
                lowStockItems: 0,
            });
            setActionItems(dashboardData.actionItems || []);
        } catch (error) {
            console.error('Failed to load dashboard data from API.', error);
            setError('Failed to load dashboard data. Please try again.');
            setSites([]);
            setStats({
                totalSites: 0,
                activeUsers: 0,
                pendingApprovals: 0,
                lowStockItems: 0,
            });
            setActionItems([]);
        }
    }

    useEffect(() => {
        const timerId = setTimeout(() => {
            loadDashboardData();
        }, 0);

        return () => clearTimeout(timerId);
    }, []);

    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <h1 className={styles.title}>Admin Dashboard</h1>
                <p className={styles.subtitle}>Overview of all operations</p>
            </div>

            {error && (
                <div style={{ marginBottom: '1rem', padding: '0.9rem 1rem', borderRadius: '12px', background: 'rgba(231, 76, 60, 0.1)', color: '#c0392b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <span>{error}</span>
                    <button onClick={loadDashboardData} style={{ border: 'none', borderRadius: '999px', padding: '0.6rem 1rem', background: '#E74C3C', color: '#fff', cursor: 'pointer' }}>
                        Retry
                    </button>
                </div>
            )}

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: 'rgba(255, 140, 66, 0.1)', color: '#FF8C42' }}>
                        <Building2 size={28} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Total Sites</p>
                        <p className={styles.statValue}>{stats.totalSites}</p>
                        <p className={styles.statChange}>All active</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: 'rgba(52, 152, 219, 0.1)', color: '#3498DB' }}>
                        <Users size={28} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Active Users</p>
                        <p className={styles.statValue}>{stats.activeUsers}</p>
                        <p className={styles.statChange}>Across all roles</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: 'rgba(244, 180, 0, 0.1)', color: '#F4B400' }}>
                        <Clock size={28} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Pending Approvals</p>
                        <p className={styles.statValue}>{stats.pendingApprovals}</p>
                        <p className={styles.statChange}>Needs attention</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: 'rgba(231, 76, 60, 0.1)', color: '#E74C3C' }}>
                        <AlertTriangle size={28} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Low Stock Items</p>
                        <p className={styles.statValue}>{stats.lowStockItems}</p>
                        <p className={styles.statChange}>Below threshold</p>
                    </div>
                </div>
            </div>

            {/* Action Required Panel */}
            <div className={styles.actionRequired}>
                <h2 className={styles.sectionTitle}>
                    <AlertTriangle size={20} />
                    Action Required Today
                </h2>
                <div className={styles.actionList}>
                    {actionItems.map(action => (
                        <Link key={action.id} to={action.link} className={styles.actionItem}>
                            <div className={styles.actionIcon} data-priority={action.priority}>
                                {action.type === 'inspection' && <CheckCircle size={20} />}
                                {action.type === 'stock' && <Package size={20} />}
                                {action.type === 'approval' && <Clock size={20} />}
                            </div>
                            <div className={styles.actionContent}>
                                <p className={styles.actionMessage}>{action.message}</p>
                                <p className={styles.actionMeta}>Click to review →</p>
                            </div>
                            <div className={styles.actionBadge} data-priority={action.priority}>
                                {action.count}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Sites Overview */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Sites Overview</h2>
                    <Link to="/admin/sites" className={styles.viewAllLink}>View All →</Link>
                </div>
                <div className={styles.sitesGrid}>
                    {sites.map(site => (
                        <div key={site.id} className={styles.siteCard}>
                            <div className={styles.siteHeader}>
                                <h3 className={styles.siteName}>{site.name}</h3>
                                <span className={styles.siteStatus} data-status={site.status}>
                                    {site.status}
                                </span>
                            </div>
                            <p className={styles.siteLocation}>{site.location}</p>
                            <p className={styles.siteManager}>Manager: {site.manager}</p>
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressFill}
                                    style={{ width: `${site.progress}%` }}
                                />
                            </div>
                            <p className={styles.progressText}>{site.progress}% Complete</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
