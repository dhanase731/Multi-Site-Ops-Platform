import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ClipboardList, Clock, RefreshCw } from 'lucide-react';
import Badge from '../../../components/Shared/Badge';
import api from '../../../services/api';
import styles from './Approvals.module.css';

const formatDate = (value) => {
    if (!value) return 'Not set';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

const ApprovalsList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadApprovals = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await api.getTasks();
            setTasks(data.filter((task) => task.status === 'APPROVAL_PENDING'));
        } catch (fetchError) {
            console.error('Failed to load approvals:', fetchError);
            setError('Failed to load approval queue. Please try again.');
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timerId = setTimeout(() => {
            loadApprovals();
        }, 0);

        return () => clearTimeout(timerId);
    }, []);

    const stats = useMemo(() => ({
        total: tasks.length,
        urgent: tasks.filter((task) => task.priority === 'HIGH').length,
    }), [tasks]);

    if (loading) {
        return <div className={styles.loading}>Loading approvals...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <Link to="/admin/dashboard" className={styles.backLink}>
                        <ArrowLeft size={16} />
                        Back to dashboard
                    </Link>
                    <h1 className={styles.title}>Approval Queue</h1>
                    <p className={styles.subtitle}>Review material and task approvals waiting on a decision.</p>
                </div>

                <button type="button" onClick={loadApprovals} className={styles.refreshButton}>
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <ClipboardList size={22} />
                    </div>
                    <div>
                        <p className={styles.statLabel}>Pending approvals</p>
                        <p className={styles.statValue}>{stats.total}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <Clock size={22} />
                    </div>
                    <div>
                        <p className={styles.statLabel}>High priority</p>
                        <p className={styles.statValue}>{stats.urgent}</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className={styles.errorState}>
                    <span>{error}</span>
                    <button type="button" onClick={loadApprovals} className={styles.retryButton}>
                        Retry
                    </button>
                </div>
            )}

            {!error && tasks.length === 0 && (
                <div className={styles.emptyState}>
                    <CheckCircle2 size={32} />
                    <h2>Nothing waiting right now</h2>
                    <p>There are no tasks with an approval pending status at the moment.</p>
                </div>
            )}

            {tasks.length > 0 && (
                <div className={styles.grid}>
                    {tasks.map((task) => (
                        <article key={task.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div>
                                    <h2 className={styles.cardTitle}>{task.title}</h2>
                                    <p className={styles.cardMeta}>{task.siteName || 'Unknown site'}</p>
                                </div>
                                <Badge variant={task.priority?.toLowerCase() === 'high' ? 'high' : 'medium'}>
                                    {task.priority || 'MEDIUM'}
                                </Badge>
                            </div>

                            <p className={styles.description}>{task.description || 'No description provided.'}</p>

                            <dl className={styles.details}>
                                <div>
                                    <dt>Assigned to</dt>
                                    <dd>{task.assigneeName || 'Unassigned'}</dd>
                                </div>
                                <div>
                                    <dt>Due date</dt>
                                    <dd>{formatDate(task.dueDate)}</dd>
                                </div>
                                <div>
                                    <dt>Status</dt>
                                    <dd>
                                        <Badge variant="inspection">Approval pending</Badge>
                                    </dd>
                                </div>
                            </dl>

                            <div className={styles.cardFooter}>
                                <Link to="/pm/tasks" className={styles.primaryLink}>
                                    Review in task board
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ApprovalsList;