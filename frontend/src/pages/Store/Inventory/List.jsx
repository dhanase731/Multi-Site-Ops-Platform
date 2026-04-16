import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingDown, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import Badge from '../../../components/Shared/Badge';
import styles from './Inventory.module.css';

const InventoryList = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await api.getInventory();
            setInventory(data);
        } catch (error) {
            console.error('Failed to load inventory:', error);
            setError('Failed to load inventory. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getLowStockItems = () => {
        return inventory.filter(item => item.stockQty <= item.threshold);
    };

    const getTotalItems = () => {
        return inventory.length;
    };

    if (loading) {
        return <div className={styles.loading}>Loading inventory...</div>;
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Inventory Management</h1>
                </div>
                <div className={styles.errorState}>
                    <p>{error}</p>
                    <button className={styles.requestButton} onClick={loadInventory}>Retry</button>
                </div>
            </div>
        );
    }

    const lowStockItems = getLowStockItems();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Inventory Management</h1>
                <Link to="/store/requests" className={styles.requestButton}>
                    <Plus size={18} />
                    Request Material
                </Link>
            </div>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                        <Package size={24} style={{ color: '#3b82f6' }} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Total Items</p>
                        <p className={styles.statValue}>{getTotalItems()}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                        <AlertTriangle size={24} style={{ color: '#ef4444' }} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Low Stock Alerts</p>
                        <p className={styles.statValue}>{lowStockItems.length}</p>
                    </div>
                </div>
            </div>

            {/* Low Stock Alert Banner */}
            {lowStockItems.length > 0 && (
                <div className={styles.alertBanner}>
                    <AlertTriangle size={20} />
                    <span>
                        <strong>{lowStockItems.length} item(s)</strong> are running low on stock
                    </span>
                </div>
            )}

            {/* Inventory Table */}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Material Name</th>
                            <th>Current Stock</th>
                            <th>Unit</th>
                            <th>Threshold</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map(item => (
                            <tr key={item.id} className={item.status === 'LOW_STOCK' ? styles.lowStockRow : ''}>
                                <td>
                                    <div className={styles.itemName}>
                                        <Package size={18} />
                                        <span>{item.name}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={styles.stockQty}>
                                        {item.stockQty}
                                    </span>
                                </td>
                                <td>{item.unit}</td>
                                <td>{item.threshold}</td>
                                <td>
                                    {item.status === 'LOW_STOCK' ? (
                                        <Badge variant="high">
                                            <TrendingDown size={12} />
                                            Low Stock
                                        </Badge>
                                    ) : (
                                        <Badge variant="approved">Adequate</Badge>
                                    )}
                                </td>
                                <td>
                                    <Link to={`/store/inventory/transactions?itemId=${item.id}`} className={styles.historyLink}>
                                        View History
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryList;
