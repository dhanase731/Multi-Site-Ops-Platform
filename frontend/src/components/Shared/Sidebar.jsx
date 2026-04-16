import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Building2,
    ClipboardList,
    Package,
    Users,
    LogOut,
    Settings
} from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = ({ role }) => {
    const { logout } = useAuth();

    const roleNavigation = {
        SUPER_ADMIN: [
            { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { path: '/admin/sites', label: 'Sites', icon: Building2 },
            { path: '/admin/users', label: 'Users', icon: Users },
            { path: '/pm/tasks', label: 'Tasks', icon: ClipboardList },
            { path: '/store/inventory', label: 'Inventory', icon: Package },
        ],
        PROJECT_MANAGER: [
            { path: '/pm/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { path: '/pm/tasks', label: 'Tasks', icon: ClipboardList },
            { path: '/site/inspections', label: 'Inspections', icon: ClipboardList },
            { path: '/admin/sites', label: 'Sites', icon: Building2 },
        ],
        SITE_ENGINEER: [
            { path: '/site/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { path: '/pm/tasks', label: 'My Tasks', icon: ClipboardList },
            { path: '/site/inspections', label: 'Inspections', icon: ClipboardList },
            { path: '/store/requests', label: 'Material Requests', icon: Package },
        ],
        STORE_KEEPER: [
            { path: '/store/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { path: '/store/inventory', label: 'Inventory', icon: Package },
            { path: '/store/requests', label: 'Requests', icon: ClipboardList },
        ],
    };

    const filteredLinks = roleNavigation[role] || [];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <Building2 className={styles.logoIcon} />
                <span className={styles.logoText}>SiteOps</span>
            </div>

            <nav className={styles.nav}>
                {filteredLinks.map((link) => {
                    const IconComponent = link.icon;
                    return (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                isActive ? `${styles.link} ${styles.active}` : styles.link
                            }
                        >
                            <IconComponent size={20} />
                            <span className={styles.linkLabel}>{link.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className={styles.footer}>
                <button onClick={logout} className={styles.logoutButton}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
