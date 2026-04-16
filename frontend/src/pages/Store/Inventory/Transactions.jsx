import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Package, Calendar, User } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../../services/api';
import Badge from '../../../components/Shared/Badge';
import styles from './Inventory.module.css';

const TRANSACTION_TYPES = {
    'STOCK_IN': { label: 'Stock In', icon: TrendingUp, color: '#10b981' },
    'ISSUED': { label: 'Issued to Site', icon: TrendingDown, color: '#3b82f6' },
    'CONSUMED': { label: 'Consumed', icon: Package, color: '#f59e0b' },
    'WASTAGE': { label: 'Wastage', icon: TrendingDown, color: '#ef4444' },
};

const TransactionHistory = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const itemId = searchParams.get('itemId');

    const [transactions, setTransactions] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [itemId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [txns, inv] = await Promise.all([
                api.getInventoryTransactions(itemId),
                api.getInventory()
            ]);
            setTransactions(txns);
            setInventory(inv);

            if (itemId) {
                const item = inv.find(i => i.id === itemId);
                setSelectedItem(item);
            }
        } catch (error) {
            console.error('Failed to load transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTransactionTypeInfo = (type) => {
        return TRANSACTION_TYPES[type] || TRANSACTION_TYPES['STOCK_IN'];
    };

    const calculateRunningBalance = () => {
        if (!selectedItem) return transactions;

        let balance = 0;
        return transactions.map(txn => {
            balance += txn.quantity;
            return { ...txn, runningBalance: balance };
        }).reverse();
    };

    const txnsWithBalance = selectedItem ? calculateRunningBalance() : transactions;

    if (loading) {
        return <div className={styles.loading}>Loading transactions...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={() => navigate('/store/inventory')} className={styles.backButton}>
                    <ArrowLeft size={20} />
                    Back to Inventory
                </button>
                <h1 className={styles.title}>
                    {selectedItem ? `${selectedItem.name} - Transaction History` : 'All Transactions'}
                </h1>
            </div>

            {selectedItem && (
                <div className={styles.itemSummary}>
                    <div className={styles.summaryCard}>
                        <Package size={24} />
                        <div>
                            <p className={styles.summaryLabel}>Current Stock</p>
                            <p className={styles.summaryValue}>{selectedItem.stockQty} {selectedItem.unit}</p>
                        </div>
                    </div>
                    <div className={styles.summaryCard}>
                        <TrendingUp size={24} />
                        <div>
                            <p className={styles.summaryLabel}>Threshold</p>
                            <p className={styles.summaryValue}>{selectedItem.threshold} {selectedItem.unit}</p>
                        </div>
                    </div>
                    <div className={styles.summaryCard}>
                        <Badge variant={selectedItem.status === 'LOW_STOCK' ? 'high' : 'approved'}>
                            {selectedItem.status === 'LOW_STOCK' ? 'Low Stock' : 'Adequate'}
                        </Badge>
                    </div>
                </div>
            )}

            {/* Filter by Item */}
            {!itemId && (
                <div className={styles.filterSection}>
                    <label>Filter by Material:</label>
                    <select
                        onChange={(e) => {
                            if (e.target.value) {
                                navigate(`/store/inventory/transactions?itemId=${e.target.value}`);
                            } else {
                                navigate('/store/inventory/transactions');
                            }
                        }}
                        className={styles.filterSelect}
                    >
                        <option value="">All Materials</option>
                        {inventory.map(item => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Transactions Table */}
            <div className={styles.tableContainer}>
                <table className={styles.transactionTable}>
                    <thead>
                        <tr>
                            <th>Date & Time</th>
                            <th>Type</th>
                            {!selectedItem && <th>Material</th>}
                            <th>Quantity</th>
                            {selectedItem && <th>Balance</th>}
                            <th>Site/Location</th>
                            <th>Performed By</th>
                            <th>Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        {txnsWithBalance.length === 0 ? (
                            <tr>
                                <td colSpan="8" className={styles.emptyState}>No transactions found</td>
                            </tr>
                        ) : (
                            txnsWithBalance.map(txn => {
                                const typeInfo = getTransactionTypeInfo(txn.type);
                                const TypeIcon = typeInfo.icon;

                                return (
                                    <tr key={txn.id}>
                                        <td>
                                            <div className={styles.dateCell}>
                                                <Calendar size={14} />
                                                {new Date(txn.timestamp).toLocaleString()}
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.typeCell} style={{ color: typeInfo.color }}>
                                                <TypeIcon size={16} />
                                                {typeInfo.label}
                                            </div>
                                        </td>
                                        {!selectedItem && <td>{txn.itemName}</td>}
                                        <td>
                                            <span className={txn.quantity > 0 ? styles.positiveQty : styles.negativeQty}>
                                                {txn.quantity > 0 ? '+' : ''}{txn.quantity}
                                            </span>
                                        </td>
                                        {selectedItem && (
                                            <td>
                                                <strong>{txn.runningBalance}</strong>
                                            </td>
                                        )}
                                        <td>{txn.siteName}</td>
                                        <td>
                                            <div className={styles.userCell}>
                                                <User size={14} />
                                                {txn.performedBy}
                                            </div>
                                        </td>
                                        <td className={styles.reasonCell}>{txn.reason}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionHistory;
