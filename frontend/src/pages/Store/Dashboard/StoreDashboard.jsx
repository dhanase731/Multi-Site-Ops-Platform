import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, TrendingDown, AlertTriangle, Clock } from 'lucide-react';
import api from '../../../services/api';
import Badge from '../../../components/Shared/Badge';
import styles from '../../Admin/Dashboard/Dashboard.module.css';
import invStyles from '../Inventory/Inventory.module.css';

const StoreDashboard = () => {
    const [stats, setStats] = useState({
        totalItems: 0,
        lowStock: 0,
        pendingRequests: 0,
        issuedToday: 0,
    });
    const [inventory, setInventory] = useState([]);
    const [actionItems, setActionItems] = useState([]);
    const [error, setError] = useState('');

    async function loadDashboardData() {
        setError('');
        try {
            const dashboardData = await api.getStoreDashboard();
            setInventory(dashboardData.inventory || []);
            setStats(dashboardData.stats || {
                totalItems: 0,
                lowStock: 0,
                pendingRequests: 0,
                issuedToday: 0,
            });
            setActionItems(dashboardData.actionItems || []);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            setError('Failed to load dashboard data. Please try again.');
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
                <h1 className={styles.title}>Store Dashboard</h1>
                <p className={styles.subtitle}>Inventory and material management</p>
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
                    <div className={styles.statIcon} style={{ backgroundColor: 'rgba(52, 152, 219, 0.1)', color: '#3498DB' }}>
                        <Package size={28} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Total Items</p>
                        <p className={styles.statValue}>{stats.totalItems}</p>
                        <p className={styles.statChange}>In inventory</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: 'rgba(231, 76, 60, 0.1)', color: '#E74C3C' }}>
                        <AlertTriangle size={28} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Low Stock</p>
                        <p className={styles.statValue}>{stats.lowStock}</p>
                        <p className={styles.statChange}>Needs restocking</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: 'rgba(244, 180, 0, 0.1)', color: '#F4B400' }}>
                        <Clock size={28} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Pending Requests</p>
                        <p className={styles.statValue}>{stats.pendingRequests}</p>
                        <p className={styles.statChange}>Awaiting approval</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: 'rgba(46, 204, 113, 0.1)', color: '#2ECC71' }}>
                        <TrendingDown size={28} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Issued Today</p>
                        <p className={styles.statValue}>{stats.issuedToday}</p>
                        <p className={styles.statChange}>Transactions</p>
                    </div>
                </div>
            </div>

            {/* Action Required */}
            {actionItems.length > 0 && (
                <div className={styles.actionRequired}>
                    <h2 className={styles.sectionTitle}>
                        <AlertTriangle size={20} />
                        Action Required
                    </h2>
                    <div className={styles.actionList}>
                        {actionItems.map(action => (
                            <Link key={action.id} to={action.link} className={styles.actionItem}>
                                <div className={styles.actionIcon} data-priority={action.priority}>
                                    {action.type === 'stock' && <AlertTriangle size={20} />}
                                    {action.type === 'request' && <Clock size={20} />}
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
            )}

            {/* Low Stock Alert */}
            {inventory.length > 0 && (
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Low Stock Alerts</h2>
                        <Link to="/store/inventory" className={styles.viewAllLink}>View All →</Link>
                    </div>
                    <div className={invStyles.lowStockBanner}>
                        <AlertTriangle size={20} />
                        <span>{inventory.length} items are below the minimum threshold and need restocking</span>
                    </div>
                    <div className={invStyles.inventoryTable}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Material</th>
                                    <th>Current Stock</th>
                                    <th>Threshold</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.stockQty} {item.unit}</td>
                                        <td>{item.threshold} {item.unit}</td>
                                        <td>
                                            <Badge variant="high">Low Stock</Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoreDashboard;
