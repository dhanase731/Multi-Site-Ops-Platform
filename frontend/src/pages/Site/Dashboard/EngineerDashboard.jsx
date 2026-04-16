import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import api from '../../../services/api';
import Badge from '../../../components/Shared/Badge';
import styles from '../../Admin/Dashboard/Dashboard.module.css';

const EngineerDashboard = () => {
    const [stats, setStats] = useState({
        assignedTasks: 0,
        completedToday: 0,
        pendingInspection: 0,
        overdue: 0,
    });
    const [myTasks, setMyTasks] = useState([]);
    const [actionItems, setActionItems] = useState([]);
    const [error, setError] = useState('');

    async function loadDashboardData() {
        setError('');
        try {
            const dashboardData = await api.getEngineerDashboard('Arjun');
            setMyTasks(dashboardData.myTasks || []);
            setStats(dashboardData.stats || {
                assignedTasks: 0,
                completedToday: 0,
                pendingInspection: 0,
                overdue: 0,
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

    const getStatusVariant = (status) => {
        const variants = {
            'ASSIGNED': 'default',
            'IN_PROGRESS': 'medium',
            'INSPECTION': 'high',
            'APPROVED': 'approved',
            'CLOSED': 'low',
        };
        return variants[status] || 'default';
    };

    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <h1 className={styles.title}>Engineer Dashboard</h1>
                <p className={styles.subtitle}>Your assigned tasks and progress</p>
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
                        <ClipboardList size={28} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Assigned Tasks</p>
                        <p className={styles.statValue}>{stats.assignedTasks}</p>
                        <p className={styles.statChange}>Active</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: 'rgba(46, 204, 113, 0.1)', color: '#2ECC71' }}>
                        <CheckCircle size={28} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Completed Today</p>
                        <p className={styles.statValue}>{stats.completedToday}</p>
                        <p className={styles.statChange}>Great work!</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: 'rgba(244, 180, 0, 0.1)', color: '#F4B400' }}>
                        <Clock size={28} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Pending Inspection</p>
                        <p className={styles.statValue}>{stats.pendingInspection}</p>
                        <p className={styles.statChange}>Awaiting review</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: 'rgba(231, 76, 60, 0.1)', color: '#E74C3C' }}>
                        <AlertCircle size={28} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Overdue</p>
                        <p className={styles.statValue}>{stats.overdue}</p>
                        <p className={styles.statChange}>On track!</p>
                    </div>
                </div>
            </div>

            {/* Action Required */}
            {actionItems.length > 0 && (
                <div className={styles.actionRequired}>
                    <h2 className={styles.sectionTitle}>
                        <AlertCircle size={20} />
                        Your Action Items
                    </h2>
                    <div className={styles.actionList}>
                        {actionItems.map(action => (
                            <Link key={action.id} to={action.link} className={styles.actionItem}>
                                <div className={styles.actionIcon} data-priority={action.priority}>
                                    {action.type === 'inspection' && <CheckCircle size={20} />}
                                    {action.type === 'task' && <ClipboardList size={20} />}
                                </div>
                                <div className={styles.actionContent}>
                                    <p className={styles.actionMessage}>{action.message}</p>
                                    <p className={styles.actionMeta}>Click to view →</p>
                                </div>
                                <div className={styles.actionBadge} data-priority={action.priority}>
                                    {action.count}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* My Tasks */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>My Tasks</h2>
                    <Link to="/pm/tasks" className={styles.viewAllLink}>View All →</Link>
                </div>
                <div className={styles.taskList}>
                    {myTasks.map(task => (
                        <div key={task.id} className={styles.taskItem}>
                            <div className={styles.taskHeader}>
                                <h3 className={styles.taskTitle}>{task.title}</h3>
                                <Badge variant={getStatusVariant(task.status)}>
                                    {task.status.replace('_', ' ')}
                                </Badge>
                            </div>
                            <p className={styles.taskSite}>{task.siteName}</p>
                            <p className={styles.taskAssignee}>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressFill}
                                    style={{ width: `${task.progress}%` }}
                                />
                            </div>
                            <p className={styles.progressText}>{task.progress}% Complete</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EngineerDashboard;
