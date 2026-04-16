import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import api from '../../../services/api';
import TaskCard from './TaskCard';
import styles from './Board.module.css';

const STATUSES = [
    { key: 'ASSIGNED', label: 'Assigned', color: '#64748b' },
    { key: 'IN_PROGRESS', label: 'In Progress', color: '#3b82f6' },
    { key: 'INSPECTION', label: 'Inspection', color: '#f59e0b' },
    { key: 'APPROVED', label: 'Approved', color: '#10b981' },
    { key: 'CLOSED', label: 'Closed', color: '#6b7280' },
];

const TaskBoard = () => {
    const [tasks, setTasks] = useState([]);
    const [sites, setSites] = useState([]);
    const [selectedSite, setSelectedSite] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [tasksData, sitesData] = await Promise.all([
                api.getTasks(),
                api.getSites()
            ]);
            setTasks(tasksData);
            setSites(sitesData);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        // Optimistic update
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId
                    ? { ...task, status: newStatus, progress: newStatus === 'APPROVED' || newStatus === 'CLOSED' ? 100 : task.progress }
                    : task
            )
        );

        // API call
        try {
            await api.updateTaskStatus(taskId, {
                status: newStatus,
                progress: newStatus === 'APPROVED' || newStatus === 'CLOSED' ? 100 : null,
            });
        } catch (error) {
            console.error('Failed to update task:', error);
            // Revert on error
            loadData();
        }
    };

    const getTasksByStatus = (status) => {
        let filtered = tasks.filter(task => task.status === status);
        if (selectedSite !== 'all') {
            filtered = filtered.filter(task => task.siteId === selectedSite);
        }
        return filtered;
    };

    if (loading) {
        return <div className={styles.loading}>Loading tasks...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Task Board</h1>
                <div className={styles.filters}>
                    <Filter size={18} />
                    <select
                        value={selectedSite}
                        onChange={(e) => setSelectedSite(e.target.value)}
                        className={styles.siteFilter}
                    >
                        <option value="all">All Sites</option>
                        {sites.map(site => (
                            <option key={site.id} value={site.id}>{site.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={styles.board}>
                {STATUSES.map(status => {
                    const statusTasks = getTasksByStatus(status.key);
                    return (
                        <div key={status.key} className={styles.column}>
                            <div className={styles.columnHeader} style={{ borderTopColor: status.color }}>
                                <h3 className={styles.columnTitle}>{status.label}</h3>
                                <span className={styles.taskCount}>{statusTasks.length}</span>
                            </div>
                            <div className={styles.columnContent}>
                                {statusTasks.length === 0 ? (
                                    <div className={styles.emptyState}>No tasks</div>
                                ) : (
                                    statusTasks.map(task => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            onStatusChange={handleStatusChange}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TaskBoard;
