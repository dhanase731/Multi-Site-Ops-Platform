import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ClipboardCheck, Users, ShieldCheck, Truck, BarChart3 } from 'lucide-react';
import styles from './About.module.css';

const highlights = [
  {
    icon: Building2,
    title: 'One platform for every site',
    description: 'Track sites, tasks, inspections, inventory, and user activity from a single operations dashboard.',
  },
  {
    icon: ShieldCheck,
    title: 'Role-based access',
    description: 'Give super admins, project managers, engineers, and store teams the exact tools they need.',
  },
  {
    icon: BarChart3,
    title: 'Built for visibility',
    description: 'Keep an eye on progress, status, approvals, and stock levels without bouncing between systems.',
  },
];

const stats = [
  { value: '4', label: 'Role-specific workflows' },
  { value: '6+', label: 'Core modules' },
  { value: '100%', label: 'Mock demo-ready' },
];

const steps = [
  {
    icon: Users,
    title: 'Assign the right people',
    description: 'Project teams can quickly connect engineers, managers, and store staff to the same project context.',
  },
  {
    icon: ClipboardCheck,
    title: 'Keep work moving',
    description: 'Tasks and inspections flow through statuses that make it easy to spot blockers and approvals.',
  },
  {
    icon: Truck,
    title: 'Support site operations',
    description: 'Inventory requests and transactions help teams stay stocked and keep construction moving.',
  },
];

const About = () => {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.kicker}>About SiteOps</p>
          <h1>Built to make construction operations feel a lot less chaotic.</h1>
          <p className={styles.lead}>
            SiteOps is a lightweight demo platform for managing construction sites, teams, tasks,
            inspections, and inventory from one place. It is designed to give each role a focused
            workspace while keeping leadership informed.
          </p>

          <div className={styles.actions}>
            <Link to="/login" className={styles.primaryButton}>Go to Login</Link>
            <Link to="/signup" className={styles.secondaryButton}>Create Account</Link>
          </div>
        </div>

        <aside className={styles.heroCard}>
          <span className={styles.heroCardLabel}>What the platform covers</span>
          <ul className={styles.featureList}>
            <li>Site planning and progress tracking</li>
            <li>Task assignment and workflow visibility</li>
            <li>Inspection management and approvals</li>
            <li>Inventory stock and material requests</li>
          </ul>
        </aside>
      </section>

      <section className={styles.statsGrid} aria-label="Platform summary">
        {stats.map((stat) => (
          <article key={stat.label} className={styles.statCard}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>Why teams use it</p>
          <h2>Simple workflows, clearer handoffs.</h2>
        </div>

        <div className={styles.highlightGrid}>
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className={styles.highlightCard}>
                <div className={styles.iconWrap}>
                  <Icon size={22} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>How it helps</p>
          <h2>Designed for real-world site coordination.</h2>
        </div>

        <div className={styles.stepsGrid}>
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article key={step.title} className={styles.stepCard}>
                <div className={styles.stepTop}>
                  <div className={styles.stepNumber}>{index + 1}</div>
                  <Icon size={20} className={styles.stepIcon} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default About;