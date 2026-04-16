import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, FileText, Building2 } from 'lucide-react';
import api from '../../../services/api';
import styles from './Inventory.module.css';

const MaterialRequest = () => {
    const navigate = useNavigate();
    const [inventory, setInventory] = useState([]);
    const [sites, setSites] = useState([]);
    const [formData, setFormData] = useState({
        itemId: '',
        quantity: '',
        siteId: '',
        reason: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [inventoryData, sitesData] = await Promise.all([
                api.getInventory(),
                api.getSites()
            ]);
            setInventory(inventoryData);
            setSites(sitesData);
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const item = inventory.find(i => i.id === formData.itemId);
        const site = sites.find(s => s.id === formData.siteId);

        if (item && site) {
            try {
                await api.createInventoryTransaction({
                    itemId: item.id,
                    type: 'ISSUED',
                    quantity: -parseInt(formData.quantity, 10),
                    siteId: site.id,
                    siteName: site.name,
                    performedBy: 'Store Keeper',
                    reason: formData.reason,
                });
            } catch (error) {
                console.error('Failed to submit material request:', error);
                alert('Failed to submit request. Please try again.');
                return;
            }
        }

        alert('Material request submitted successfully!');
        navigate('/store/inventory');
    };

    const selectedItem = inventory.find(i => i.id === formData.itemId);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={() => navigate(-1)} className={styles.backButton}>
                    <ArrowLeft size={20} />
                    Back to Inventory
                </button>
                <h1 className={styles.title}>Request Material</h1>
            </div>

            <div className={styles.formContainer}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="itemId">Material Item</label>
                        <div className={styles.inputWrapper}>
                            <Package size={18} className={styles.inputIcon} />
                            <select
                                id="itemId"
                                name="itemId"
                                value={formData.itemId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Material</option>
                                {inventory.map(item => (
                                    <option key={item.id} value={item.id}>
                                        {item.name} (Available: {item.stockQty} {item.unit})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {selectedItem && selectedItem.status === 'LOW_STOCK' && (
                        <div className={styles.warningBox}>
                            ⚠️ This item is running low on stock. Current: {selectedItem.stockQty} {selectedItem.unit}
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label htmlFor="quantity">Quantity</label>
                        <div className={styles.inputWrapper}>
                            <Package size={18} className={styles.inputIcon} />
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                                min="1"
                                placeholder="Enter quantity"
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="siteId">Destination Site</label>
                        <div className={styles.inputWrapper}>
                            <Building2 size={18} className={styles.inputIcon} />
                            <select
                                id="siteId"
                                name="siteId"
                                value={formData.siteId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Site</option>
                                {sites.map(site => (
                                    <option key={site.id} value={site.id}>
                                        {site.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="reason">Reason / Purpose</label>
                        <div className={styles.inputWrapper}>
                            <FileText size={18} className={styles.inputIcon} />
                            <textarea
                                id="reason"
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                required
                                rows="4"
                                placeholder="e.g., Slab casting tomorrow"
                            />
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" onClick={() => navigate('/store/inventory')} className={styles.cancelButton}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.submitButton}>
                            Submit Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MaterialRequest;
