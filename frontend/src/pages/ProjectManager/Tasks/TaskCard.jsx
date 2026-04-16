import React from 'react';
import { User, Calendar, TrendingUp } from 'lucide-react';
import Badge from '../../../components/Shared/Badge';
import styles from './TaskCard.module.css';

const TaskCard = ({ task, onStatusChange }) => {
    const handleStatusChange = (newStatus) => {
        if (onStatusChange) {
            onStatusChange(task.id, newStatus);
        }
    };

    const getNextStatus = () => {
        const statusFlow = {
            'ASSIGNED': 'IN_PROGRESS',
            'IN_PROGRESS': 'INSPECTION',
            'INSPECTION': 'APPROVED',
            'APPROVED': 'CLOSED',
        };
        return statusFlow[task.status];
    };

    const nextStatus = getNextStatus();

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.badges}>
                    <Badge variant={task.priority.toLowerCase()}>{task.priority}</Badge>
                    <Badge variant={task.status.toLowerCase().replace('_', '_')}>
                        {task.status.replace('_', ' ')}
                    </Badge>
                </div>
            </div>

            <h3 className={styles.title}>{task.title}</h3>
            <p className={styles.description}>{task.description}</p>

            <div className={styles.meta}>
                <div className={styles.metaItem}>
                    <User size={14} />
                    <span>{task.assigneeName}</span>
                </div>
                <div className={styles.metaItem}>
                    <Calendar size={14} />
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
            </div>

            <div className={styles.progress}>
                <div className={styles.progressLabel}>
                    <TrendingUp size={14} />
                    <span>{task.progress}%</span>
                </div>
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${task.progress}%` }}
                    ></div>
                </div>
            </div>

            {nextStatus && task.status !== 'CLOSED' && (
                <button
                    className={styles.actionButton}
                    onClick={() => handleStatusChange(nextStatus)}
                >
                    Move to {nextStatus.replace('_', ' ')}
                </button>
            )}
        </div>
    );
};

export default TaskCard;
