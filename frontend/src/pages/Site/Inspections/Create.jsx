import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ClipboardCheck, FileText, Camera } from 'lucide-react';
import api from '../../../services/api';
import styles from './Inspections.module.css';

const CreateInspection = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [formData, setFormData] = useState({
        taskId: '',
        status: 'PENDING',
        remarks: '',
        photos: []
    });

    async function loadTasks() {
        try {
            const data = await api.getTasks();
            // Only show tasks that are in INSPECTION status
            const inspectionTasks = data.filter(t => t.status === 'INSPECTION' || t.status === 'IN_PROGRESS');
            setTasks(inspectionTasks);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        }
    }

    useEffect(() => {
        const timerId = setTimeout(() => {
            loadTasks();
        }, 0);

        return () => clearTimeout(timerId);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        // Mock: Just store file names
        setFormData(prev => ({
            ...prev,
            photos: [...prev.photos, ...files.map(f => f.name)]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.createInspection(formData);
            alert('Inspection recorded successfully!');
            navigate('/site/inspections');
        } catch (error) {
            console.error('Failed to create inspection:', error);
            alert('Failed to record inspection. Please try again.');
        }
    };

    const selectedTask = tasks.find(t => t.id === formData.taskId);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={() => navigate(-1)} className={styles.backButton}>
                    <ArrowLeft size={20} />
                    Back to Inspections
                </button>
                <h1 className={styles.title}>Conduct Inspection</h1>
            </div>

            <div className={styles.formContainer}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="taskId">Select Task</label>
                        <div className={styles.inputWrapper}>
                            <ClipboardCheck size={18} className={styles.inputIcon} />
                            <select
                                id="taskId"
                                name="taskId"
                                value={formData.taskId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a task to inspect</option>
                                {tasks.map(task => (
                                    <option key={task.id} value={task.id}>
                                        {task.title} - {task.siteName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {selectedTask && (
                        <div className={styles.taskInfo}>
                            <p><strong>Site:</strong> {selectedTask.siteName}</p>
                            <p><strong>Assigned To:</strong> {selectedTask.assigneeName}</p>
                            <p><strong>Progress:</strong> {selectedTask.progress}%</p>
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label htmlFor="status">Inspection Result</label>
                        <div className={styles.inputWrapper}>
                            <ClipboardCheck size={18} className={styles.inputIcon} />
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="PENDING">Pending Review</option>
                                <option value="PASSED">Passed ✓</option>
                                <option value="FAILED">Failed - Rework Required</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="remarks">Inspection Remarks</label>
                        <div className={styles.inputWrapper}>
                            <FileText size={18} className={styles.inputIcon} />
                            <textarea
                                id="remarks"
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                required
                                rows="5"
                                placeholder="Describe findings, quality checks, safety compliance, etc."
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="photos">Upload Photos (Optional)</label>
                        <div className={styles.photoUpload}>
                            <Camera size={24} />
                            <input
                                type="file"
                                id="photos"
                                accept="image/*"
                                multiple
                                onChange={handlePhotoUpload}
                            />
                            <p>Click to upload inspection photos</p>
                        </div>
                        {formData.photos.length > 0 && (
                            <div className={styles.photoList}>
                                <p><strong>Uploaded:</strong></p>
                                <ul>
                                    {formData.photos.map((photo, idx) => (
                                        <li key={idx}>{photo}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" onClick={() => navigate('/site/inspections')} className={styles.cancelButton}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.submitButton}>
                            Submit Inspection
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateInspection;
