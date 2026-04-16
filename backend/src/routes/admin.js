import { Router } from 'express';
import { runQuery } from '../db.js';

const router = Router();

router.get('/dashboard', async (req, res) => {
  try {
    const [sitesResult, usersResult, tasksResult, inventoryResult] = await Promise.all([
      runQuery('SELECT id, name, location, manager, status, progress FROM sites ORDER BY name ASC'),
      runQuery('SELECT id FROM users WHERE is_active = TRUE'),
      runQuery('SELECT id, status FROM tasks'),
      runQuery('SELECT id, threshold, stock_qty FROM inventory_items'),
    ]);

    const sites = sitesResult.rows;
    const activeUsers = usersResult.rows.length;

    const pendingInspections = tasksResult.rows.filter((task) => task.status === 'INSPECTION').length;
    const pendingApprovals = tasksResult.rows.filter((task) => task.status === 'APPROVAL_PENDING').length;

    const lowStockItems = inventoryResult.rows.filter(
      (item) => Number(item.stock_qty) <= Number(item.threshold),
    ).length;

    const actionItems = [];

    if (pendingInspections > 0) {
      actionItems.push({
        id: 1,
        type: 'inspection',
        priority: 'high',
        count: pendingInspections,
        message: `${pendingInspections} tasks pending inspection`,
        link: '/pm/tasks',
      });
    }

    if (lowStockItems > 0) {
      actionItems.push({
        id: 2,
        type: 'stock',
        priority: 'high',
        count: lowStockItems,
        message: `${lowStockItems} items below stock threshold`,
        link: '/store/inventory',
      });
    }

    if (pendingApprovals > 0) {
      actionItems.push({
        id: 3,
        type: 'approval',
        priority: 'medium',
        count: pendingApprovals,
        message: `${pendingApprovals} material requests waiting approval`,
        link: '/admin/approvals',
      });
    }

    return res.json({
      stats: {
        totalSites: sites.length,
        activeUsers,
        pendingApprovals,
        lowStockItems,
      },
      sites,
      actionItems,
    });
  } catch (error) {
    console.error('Error loading admin dashboard:', error);
    return res.status(500).json({ error: 'Failed to load admin dashboard data.' });
  }
});

export default router;
