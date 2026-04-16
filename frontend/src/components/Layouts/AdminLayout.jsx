import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Shared/Sidebar';
import { useAuth } from '../../context/AuthContext';
import styles from './Layout.module.css';

const AdminLayout = () => {
    const { user } = useAuth();

    return (
        <div className={styles.container}>
            <Sidebar role={user?.role} />
            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <h2 className={styles.pageTitle}>Dashboard</h2>
                    <div className={styles.userProfile}>
                        <span>{user?.name}</span>
                        <span className={styles.roleBadge}>{user?.role?.replace('_', ' ')}</span>
                    </div>
                </header>
                <div className={styles.content}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
