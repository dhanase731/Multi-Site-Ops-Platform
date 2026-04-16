import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, Plus, Mail, Shield } from 'lucide-react';
import api from '../../../services/api';
import Badge from '../../../components/Shared/Badge';
import styles from './Users.module.css';

const ROLE_LABELS = {
    'SUPER_ADMIN': 'Super Admin',
    'PROJECT_MANAGER': 'Project Manager',
    'SITE_ENGINEER': 'Site Engineer',
    'STORE_KEEPER': 'Store Keeper',
    'SUPERVISOR': 'Supervisor',
    'VIEWER': 'Viewer'
};

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'SITE_ENGINEER'
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await api.getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to load users:', error);
            setError('Failed to load users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const user = await api.createUser(newUser);
            setUsers((prevUsers) => [...prevUsers, user]);
            setShowAddModal(false);
            setNewUser({ name: '', email: '', role: 'SITE_ENGINEER' });
        } catch (error) {
            console.error('Failed to add user:', error);
            alert('Failed to add user. Please try again.');
        }
    };

    const getRoleBadgeVariant = (role) => {
        const variants = {
            'SUPER_ADMIN': 'high',
            'PROJECT_MANAGER': 'medium',
            'SITE_ENGINEER': 'in_progress',
            'STORE_KEEPER': 'approved',
            'SUPERVISOR': 'default',
            'VIEWER': 'default'
        };
        return variants[role] || 'default';
    };

    if (loading) {
        return <div className={styles.loading}>Loading users...</div>;
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>User Management</h1>
                </div>
                <div className={styles.errorState}>
                    <p>{error}</p>
                    <button className={styles.addButton} onClick={loadUsers}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>User Management</h1>
                <button onClick={() => setShowAddModal(true)} className={styles.addButton}>
                    <Plus size={18} />
                    Add User
                </button>
            </div>

            {/* Stats */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <UsersIcon size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Total Users</p>
                        <p className={styles.statValue}>{users.length}</p>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <div className={styles.userName}>
                                        <UsersIcon size={18} />
                                        <span>{user.name}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.userEmail}>
                                        <Mail size={14} />
                                        <span>{user.email}</span>
                                    </div>
                                </td>
                                <td>
                                    <Badge variant={getRoleBadgeVariant(user.role)}>
                                        <Shield size={12} />
                                        {ROLE_LABELS[user.role]}
                                    </Badge>
                                </td>
                                <td>
                                    <button className={styles.actionBtn}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2 className={styles.modalTitle}>Add New User</h2>
                        <form onSubmit={handleAddUser} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    required
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    required
                                    placeholder="john@skyline.com"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Role</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    required
                                >
                                    {Object.entries(ROLE_LABELS).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setShowAddModal(false)} className={styles.cancelBtn}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.submitBtn}>
                                    Add User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
