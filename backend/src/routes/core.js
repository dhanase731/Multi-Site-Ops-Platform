import { Router } from 'express';
import { getClient, runQuery } from '../db.js';

const router = Router();

const mapTaskRow = (row) => ({
  id: row.id,
  siteId: row.site_id,
  siteName: row.site_name,
  title: row.title,
  description: row.description,
  assignedTo: row.assigned_to,
  assigneeName: row.assignee_name,
  status: row.status,
  priority: row.priority,
  progress: Number(row.progress),
  dueDate: row.due_date,
  createdAt: row.created_at,
});

const mapInventoryRow = (row) => ({
  id: row.id,
  name: row.name,
  unit: row.unit,
  threshold: Number(row.threshold),
  stockQty: Number(row.stock_qty),
  status: Number(row.stock_qty) <= Number(row.threshold) ? 'LOW_STOCK' : 'ADEQUATE',
});

router.get('/sites', async (_req, res) => {
  try {
    const result = await runQuery('SELECT id, name, location, manager, status, progress FROM sites ORDER BY name ASC');
    return res.json(result.rows);
  } catch (error) {
    console.error('Error loading sites:', error);
    return res.status(500).json({ error: 'Failed to load sites.' });
  }
});

router.post('/sites', async (req, res) => {
  const { name, location, manager, status = 'PLANNING' } = req.body;

  if (!name || !location || !manager) {
    return res.status(400).json({ error: 'name, location, and manager are required.' });
  }

  try {
    const id = `s${Date.now()}`;
    const result = await runQuery(
      'INSERT INTO sites (id, name, location, manager, status, progress) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, location, manager, status, progress',
      [id, name, location, manager, status, 0],
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating site:', error);
    return res.status(500).json({ error: 'Failed to create site.' });
  }
});

router.get('/users', async (_req, res) => {
  try {
    const result = await runQuery('SELECT id, name, role, email, is_active FROM users ORDER BY name ASC');
    return res.json(result.rows.map((user) => ({ ...user, isActive: user.is_active })));
  } catch (error) {
    console.error('Error loading users:', error);
    return res.status(500).json({ error: 'Failed to load users.' });
  }
});

router.post('/users', async (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ error: 'name, email, and role are required.' });
  }

  try {
    const id = `u${Date.now()}`;
    const result = await runQuery(
      'INSERT INTO users (id, name, role, email, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, role, email, is_active',
      [id, name, role, email, true],
    );
    const user = result.rows[0];
    return res.status(201).json({ ...user, isActive: user.is_active });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Failed to create user.' });
  }
});

router.get('/tasks', async (req, res) => {
  const { siteId, assigneeName } = req.query;

  try {
    let query = `
      SELECT
        t.id,
        t.site_id,
        s.name AS site_name,
        t.title,
        t.description,
        t.assigned_to,
        u.name AS assignee_name,
        t.status,
        t.priority,
        t.progress,
        t.due_date,
        t.created_at
      FROM tasks t
      LEFT JOIN sites s ON s.id = t.site_id
      LEFT JOIN users u ON u.id = t.assigned_to
      WHERE 1 = 1
    `;

    const params = [];

    if (siteId) {
      params.push(siteId);
      query += ` AND t.site_id = $${params.length}`;
    }

    if (assigneeName) {
      params.push(assigneeName);
      query += ` AND u.name = $${params.length}`;
    }

    query += ' ORDER BY t.created_at DESC, t.id DESC';

    const result = await runQuery(query, params);
    return res.json(result.rows.map(mapTaskRow));
  } catch (error) {
    console.error('Error loading tasks:', error);
    return res.status(500).json({ error: 'Failed to load tasks.' });
  }
});

router.patch('/tasks/:taskId/status', async (req, res) => {
  const { taskId } = req.params;
  const { status, progress } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'status is required.' });
  }

  try {
    const result = await runQuery(
      `
      UPDATE tasks
      SET
        status = $2,
        progress = COALESCE($3, progress)
      WHERE id = $1
      RETURNING id
      `,
      [taskId, status, progress ?? null],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    const fullTask = await runQuery(
      `
      SELECT
        t.id,
        t.site_id,
        s.name AS site_name,
        t.title,
        t.description,
        t.assigned_to,
        u.name AS assignee_name,
        t.status,
        t.priority,
        t.progress,
        t.due_date,
        t.created_at
      FROM tasks t
      LEFT JOIN sites s ON s.id = t.site_id
      LEFT JOIN users u ON u.id = t.assigned_to
      WHERE t.id = $1
      `,
      [taskId],
    );

    return res.json(mapTaskRow(fullTask.rows[0]));
  } catch (error) {
    console.error('Error updating task status:', error);
    return res.status(500).json({ error: 'Failed to update task status.' });
  }
});

router.get('/inventory', async (_req, res) => {
  try {
    const result = await runQuery('SELECT id, name, unit, threshold, stock_qty FROM inventory_items ORDER BY name ASC');
    return res.json(result.rows.map(mapInventoryRow));
  } catch (error) {
    console.error('Error loading inventory:', error);
    return res.status(500).json({ error: 'Failed to load inventory.' });
  }
});

router.get('/inventory/transactions', async (req, res) => {
  const { itemId } = req.query;

  try {
    const params = [];
    let query = `
      SELECT
        id,
        item_id,
        item_name,
        type,
        quantity,
        site_id,
        site_name,
        performed_by,
        reason,
        timestamp
      FROM inventory_transactions
      WHERE 1 = 1
    `;

    if (itemId) {
      params.push(itemId);
      query += ` AND item_id = $${params.length}`;
    }

    query += ' ORDER BY timestamp DESC';

    const result = await runQuery(query, params);

    return res.json(result.rows.map((txn) => ({
      id: txn.id,
      itemId: txn.item_id,
      itemName: txn.item_name,
      type: txn.type,
      quantity: Number(txn.quantity),
      siteId: txn.site_id,
      siteName: txn.site_name,
      performedBy: txn.performed_by,
      reason: txn.reason,
      timestamp: txn.timestamp,
    })));
  } catch (error) {
    console.error('Error loading inventory transactions:', error);
    return res.status(500).json({ error: 'Failed to load inventory transactions.' });
  }
});

router.post('/inventory/transactions', async (req, res) => {
  const {
    itemId,
    type,
    quantity,
    siteId = null,
    siteName = 'Warehouse',
    performedBy,
    reason,
  } = req.body;

  if (!itemId || !type || quantity === undefined || !performedBy || !reason) {
    return res.status(400).json({ error: 'itemId, type, quantity, performedBy, and reason are required.' });
  }

  const client = await getClient();

  try {
    await client.query('BEGIN');

    const itemResult = await client.query('SELECT id, name FROM inventory_items WHERE id = $1 FOR UPDATE', [itemId]);

    if (itemResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Inventory item not found.' });
    }

    const item = itemResult.rows[0];
    const txnId = `txn${Date.now()}`;

    const insertTxn = await client.query(
      `
      INSERT INTO inventory_transactions (
        id,
        item_id,
        item_name,
        type,
        quantity,
        site_id,
        site_name,
        performed_by,
        reason,
        timestamp
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING id, item_id, item_name, type, quantity, site_id, site_name, performed_by, reason, timestamp
      `,
      [txnId, itemId, item.name, type, quantity, siteId, siteName, performedBy, reason],
    );

    await client.query('UPDATE inventory_items SET stock_qty = stock_qty + $2 WHERE id = $1', [itemId, quantity]);

    await client.query('COMMIT');

    const txn = insertTxn.rows[0];
    return res.status(201).json({
      id: txn.id,
      itemId: txn.item_id,
      itemName: txn.item_name,
      type: txn.type,
      quantity: Number(txn.quantity),
      siteId: txn.site_id,
      siteName: txn.site_name,
      performedBy: txn.performed_by,
      reason: txn.reason,
      timestamp: txn.timestamp,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating inventory transaction:', error);
    return res.status(500).json({ error: 'Failed to create inventory transaction.' });
  } finally {
    client.release();
  }
});

router.get('/dashboards/pm', async (_req, res) => {
  try {
    const tasksResult = await runQuery(
      `
      SELECT
        t.id,
        t.site_id,
        s.name AS site_name,
        t.title,
        t.description,
        t.assigned_to,
        u.name AS assignee_name,
        t.status,
        t.priority,
        t.progress,
        t.due_date,
        t.created_at
      FROM tasks t
      LEFT JOIN sites s ON s.id = t.site_id
      LEFT JOIN users u ON u.id = t.assigned_to
      ORDER BY t.created_at DESC, t.id DESC
      `,
    );

    const tasks = tasksResult.rows.map(mapTaskRow);
    const activeTasks = tasks.filter((task) => task.status !== 'CLOSED');
    const pendingInspections = tasks.filter((task) => task.status === 'INSPECTION');
    const completedTasks = tasks.filter((task) => task.status === 'CLOSED');

    const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

    const actionItems = [];
    if (pendingInspections.length > 0) {
      actionItems.push({
        id: 1,
        type: 'inspection',
        priority: 'high',
        count: pendingInspections.length,
        message: `${pendingInspections.length} tasks pending inspection`,
        link: '/pm/tasks',
      });
    }

    const pendingApprovals = tasks.filter((task) => task.status === 'APPROVAL_PENDING').length;
    if (pendingApprovals > 0) {
      actionItems.push({
        id: 2,
        type: 'approval',
        priority: 'medium',
        count: pendingApprovals,
        message: `${pendingApprovals} material requests need approval`,
        link: '/admin/approvals',
      });
    }

    return res.json({
      stats: {
        activeTasks: activeTasks.length,
        pendingInspections: pendingInspections.length,
        completedToday: completedTasks.length,
        completionRate,
      },
      tasks: tasks.slice(0, 5),
      actionItems,
    });
  } catch (error) {
    console.error('Error loading PM dashboard:', error);
    return res.status(500).json({ error: 'Failed to load PM dashboard.' });
  }
});

router.get('/dashboards/engineer', async (req, res) => {
  const assigneeName = req.query.assigneeName || 'Arjun';

  try {
    const result = await runQuery(
      `
      SELECT
        t.id,
        t.site_id,
        s.name AS site_name,
        t.title,
        t.description,
        t.assigned_to,
        u.name AS assignee_name,
        t.status,
        t.priority,
        t.progress,
        t.due_date,
        t.created_at
      FROM tasks t
      LEFT JOIN sites s ON s.id = t.site_id
      LEFT JOIN users u ON u.id = t.assigned_to
      WHERE u.name = $1
      ORDER BY t.created_at DESC, t.id DESC
      `,
      [assigneeName],
    );

    const myTasks = result.rows.map(mapTaskRow);
    const activeTasks = myTasks.filter((task) => task.status !== 'CLOSED');
    const pendingInspection = myTasks.filter((task) => task.status === 'INSPECTION');
    const completedToday = myTasks.filter((task) => task.status === 'CLOSED');

    const inProgress = myTasks.filter((task) => task.status === 'IN_PROGRESS');

    const actionItems = [];
    if (pendingInspection.length > 0) {
      actionItems.push({
        id: 1,
        type: 'inspection',
        priority: 'high',
        count: pendingInspection.length,
        message: `${pendingInspection.length} of your tasks pending inspection`,
        link: '/pm/tasks',
      });
    }

    if (inProgress.length > 0) {
      actionItems.push({
        id: 2,
        type: 'task',
        priority: 'medium',
        count: inProgress.length,
        message: `${inProgress.length} tasks in progress`,
        link: '/pm/tasks',
      });
    }

    return res.json({
      stats: {
        assignedTasks: activeTasks.length,
        completedToday: completedToday.length,
        pendingInspection: pendingInspection.length,
        overdue: 0,
      },
      myTasks: myTasks.slice(0, 5),
      actionItems,
    });
  } catch (error) {
    console.error('Error loading engineer dashboard:', error);
    return res.status(500).json({ error: 'Failed to load engineer dashboard.' });
  }
});

router.get('/dashboards/store', async (_req, res) => {
  try {
    const inventoryResult = await runQuery('SELECT id, name, unit, threshold, stock_qty FROM inventory_items ORDER BY name ASC');
    const inventory = inventoryResult.rows.map(mapInventoryRow);

    const lowStockItems = inventory.filter((item) => item.status === 'LOW_STOCK');

    const txnsResult = await runQuery(
      `
      SELECT id
      FROM inventory_transactions
      WHERE DATE(timestamp) = CURRENT_DATE
      `,
    );

    const actionItems = [];
    if (lowStockItems.length > 0) {
      actionItems.push({
        id: 1,
        type: 'stock',
        priority: 'high',
        count: lowStockItems.length,
        message: `${lowStockItems.length} items below stock threshold`,
        link: '/store/inventory',
      });
    }

    return res.json({
      stats: {
        totalItems: inventory.length,
        lowStock: lowStockItems.length,
        pendingRequests: 0,
        issuedToday: txnsResult.rows.length,
      },
      inventory: lowStockItems,
      actionItems,
    });
  } catch (error) {
    console.error('Error loading store dashboard:', error);
    return res.status(500).json({ error: 'Failed to load store dashboard.' });
  }
});

router.get('/inspections', async (_req, res) => {
  try {
    const result = await runQuery(
      `
      SELECT
        i.id,
        i.task_id,
        t.title AS task_title,
        s.name AS site_name,
        i.inspector_name,
        i.status,
        i.inspection_date,
        i.remarks,
        i.photos_count
      FROM inspections i
      LEFT JOIN tasks t ON t.id = i.task_id
      LEFT JOIN sites s ON s.id = t.site_id
      ORDER BY i.inspection_date DESC, i.id DESC
      `,
    );

    return res.json(result.rows.map((inspection) => ({
      id: inspection.id,
      taskId: inspection.task_id,
      taskTitle: inspection.task_title,
      siteName: inspection.site_name,
      inspectorName: inspection.inspector_name,
      status: inspection.status,
      date: inspection.inspection_date,
      remarks: inspection.remarks,
      photos: Number(inspection.photos_count),
    })));
  } catch (error) {
    console.error('Error loading inspections:', error);
    return res.status(500).json({ error: 'Failed to load inspections.' });
  }
});

router.post('/inspections', async (req, res) => {
  const { taskId, status, remarks, photos = [] } = req.body;

  if (!taskId || !status || !remarks) {
    return res.status(400).json({ error: 'taskId, status, and remarks are required.' });
  }

  const inspectorName = 'Suresh (PM)';
  const photoCount = Array.isArray(photos) ? photos.length : 0;

  const client = await getClient();

  try {
    await client.query('BEGIN');

    const inspectionId = `ins${Date.now()}`;
    const inspectionStatus = status === 'PASSED' || status === 'FAILED' ? status : 'PENDING';

    const inspectionInsert = await client.query(
      `
      INSERT INTO inspections (id, task_id, inspector_name, status, inspection_date, remarks, photos_count)
      VALUES ($1, $2, $3, $4, CURRENT_DATE, $5, $6)
      RETURNING id
      `,
      [inspectionId, taskId, inspectorName, inspectionStatus, remarks, photoCount],
    );

    if (inspectionStatus === 'PASSED') {
      await client.query('UPDATE tasks SET status = $2, progress = 100 WHERE id = $1', [taskId, 'APPROVED']);
    } else if (inspectionStatus === 'FAILED') {
      await client.query('UPDATE tasks SET status = $2 WHERE id = $1', [taskId, 'IN_PROGRESS']);
    }

    await client.query('COMMIT');

    return res.status(201).json({ id: inspectionInsert.rows[0].id });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating inspection:', error);
    return res.status(500).json({ error: 'Failed to create inspection.' });
  } finally {
    client.release();
  }
});

export default router;
