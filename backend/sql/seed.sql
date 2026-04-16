INSERT INTO sites (id, name, location, manager, status, progress) VALUES
  ('s1', 'Chennai Metro Phase 2', 'Chennai, TN', 'Rajesh Kumar', 'ACTIVE', 65),
  ('s2', 'IT Park Tower Construction', 'Bangalore, KA', 'Priya Sharma', 'ACTIVE', 45),
  ('s3', 'Highway Bridge Project', 'Hyderabad, TS', 'Vikram Singh', 'ACTIVE', 30)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  location = EXCLUDED.location,
  manager = EXCLUDED.manager,
  status = EXCLUDED.status,
  progress = EXCLUDED.progress;

INSERT INTO users (id, name, role, email, is_active) VALUES
  ('u1', 'Arjun', 'SITE_ENGINEER', 'arjun@skyline.com', TRUE),
  ('u2', 'Ravi', 'SITE_ENGINEER', 'ravi@skyline.com', TRUE),
  ('u3', 'Suresh', 'PROJECT_MANAGER', 'suresh@skyline.com', TRUE),
  ('u4', 'Store Keeper', 'STORE_KEEPER', 'store@skyline.com', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  email = EXCLUDED.email,
  is_active = EXCLUDED.is_active;

INSERT INTO tasks (id, site_id, title, description, assigned_to, status, priority, progress, due_date, created_at) VALUES
  ('t1', 's2', '2nd Floor Slab Reinforcement', 'Complete steel reinforcement for 2nd floor slab casting', 'u1', 'IN_PROGRESS', 'HIGH', 70, '2026-02-20', '2026-02-10'),
  ('t2', 's1', 'Station Platform Excavation', 'Excavate and prepare foundation for platform area', 'u2', 'ASSIGNED', 'MEDIUM', 0, '2026-02-25', '2026-02-12'),
  ('t3', 's2', 'Column Casting Block B', 'Pour concrete for columns in Block B', 'u1', 'INSPECTION', 'HIGH', 100, '2026-02-15', '2026-02-08'),
  ('t4', 's3', 'Bridge Pillar Foundation', 'Complete foundation work for bridge pillar #3', 'u2', 'IN_PROGRESS', 'HIGH', 55, '2026-02-18', '2026-02-05'),
  ('t5', 's1', 'Safety Rails Installation', 'Install safety rails on platform edges', 'u1', 'APPROVAL_PENDING', 'MEDIUM', 100, '2026-02-14', '2026-02-01'),
  ('t6', 's2', 'Electrical Conduit Installation', 'Install electrical conduits for 1st floor', 'u2', 'CLOSED', 'LOW', 100, '2026-02-10', '2026-01-28'),
  ('t7', 's3', 'Concrete Curing Monitoring', 'Monitor and maintain concrete curing for deck', 'u1', 'IN_PROGRESS', 'MEDIUM', 40, '2026-02-22', '2026-02-11'),
  ('t8', 's1', 'Waterproofing Application', 'Apply waterproofing membrane to tunnel walls', 'u2', 'ASSIGNED', 'HIGH', 0, '2026-02-28', '2026-02-13')
ON CONFLICT (id) DO UPDATE SET
  site_id = EXCLUDED.site_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  assigned_to = EXCLUDED.assigned_to,
  status = EXCLUDED.status,
  priority = EXCLUDED.priority,
  progress = EXCLUDED.progress,
  due_date = EXCLUDED.due_date,
  created_at = EXCLUDED.created_at;

INSERT INTO inventory_items (id, name, unit, threshold, stock_qty) VALUES
  ('i1', 'Cement', 'bags', 50, 60),
  ('i2', 'Steel Rods (12mm)', 'pieces', 100, 250),
  ('i3', 'Bricks', 'pieces', 2000, 1900),
  ('i4', 'Paint (White)', 'liters', 20, 15)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  threshold = EXCLUDED.threshold,
  stock_qty = EXCLUDED.stock_qty;

INSERT INTO inventory_transactions (id, item_id, item_name, type, quantity, site_id, site_name, performed_by, reason, timestamp) VALUES
  ('txn1', 'i1', 'Cement', 'STOCK_IN', 200, null, 'Warehouse', 'Store Keeper', 'Initial stock', '2026-02-01T10:00:00Z'),
  ('txn2', 'i1', 'Cement', 'ISSUED', -100, 's2', 'IT Park Tower Construction', 'Store Keeper', 'Foundation work', '2026-02-05T14:30:00Z'),
  ('txn3', 'i1', 'Cement', 'ISSUED', -40, 's1', 'Chennai Metro Phase 2', 'Store Keeper', 'Platform construction', '2026-02-08T09:15:00Z'),
  ('txn4', 'i2', 'Steel Rods (12mm)', 'STOCK_IN', 500, null, 'Warehouse', 'Store Keeper', 'Bulk purchase', '2026-02-01T10:00:00Z'),
  ('txn5', 'i2', 'Steel Rods (12mm)', 'ISSUED', -250, 's2', 'IT Park Tower Construction', 'Store Keeper', 'Slab reinforcement', '2026-02-10T11:00:00Z'),
  ('txn6', 'i4', 'Paint (White)', 'STOCK_IN', 50, null, 'Warehouse', 'Store Keeper', 'Monthly stock', '2026-02-01T10:00:00Z'),
  ('txn7', 'i4', 'Paint (White)', 'CONSUMED', -35, 's1', 'Chennai Metro Phase 2', 'Site Engineer', 'Interior painting', '2026-02-11T16:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  item_id = EXCLUDED.item_id,
  item_name = EXCLUDED.item_name,
  type = EXCLUDED.type,
  quantity = EXCLUDED.quantity,
  site_id = EXCLUDED.site_id,
  site_name = EXCLUDED.site_name,
  performed_by = EXCLUDED.performed_by,
  reason = EXCLUDED.reason,
  timestamp = EXCLUDED.timestamp;

INSERT INTO inspections (id, task_id, inspector_name, status, inspection_date, remarks, photos_count) VALUES
  ('ins1', 't1', 'Suresh (PM)', 'PASSED', '2026-02-12', 'All safety standards met. Steel reinforcement properly placed.', 2),
  ('ins2', 't3', 'Suresh (PM)', 'PENDING', '2026-02-13', 'Awaiting final inspection', 0),
  ('ins3', 't5', 'Rajesh (PM)', 'FAILED', '2026-02-11', 'Concrete curing not done correctly. Rework required.', 3),
  ('ins4', 't4', 'Vikram (PM)', 'PASSED', '2026-02-10', 'Foundation depth and quality approved.', 1)
ON CONFLICT (id) DO UPDATE SET
  task_id = EXCLUDED.task_id,
  inspector_name = EXCLUDED.inspector_name,
  status = EXCLUDED.status,
  inspection_date = EXCLUDED.inspection_date,
  remarks = EXCLUDED.remarks,
  photos_count = EXCLUDED.photos_count;
