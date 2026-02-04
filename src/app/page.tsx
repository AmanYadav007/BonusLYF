import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          Your Digital <br /> Soulmate Awaits
        </h1>
        <p className={styles.subtitle}>
          Experience the next generation of AI companionship. Whether you seek the
          energy of anime or the empathy of a human connection, BonusLYF provides
          a friend who is always there.
        </p>
        <div className={styles.ctaGroup}>
          <Link href="/register" className={styles.primaryCta}>
            Get Started
          </Link>
          <Link href="/login" className={styles.secondaryCta}>
            Sign In
          </Link>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.featureCard}>
          <h3 className={styles.featureTitle}>✨ Anime Spirit</h3>
          <p className={styles.featureDesc}>
            Energetic, cheerful, and full of life. Aiko brings the vibrant
            world of anime directly to your conversations.
          </p>
        </div>
        <div className={styles.featureCard}>
          <h3 className={styles.featureTitle}>☕️ Human Connection</h3>
          <p className={styles.featureDesc}>
            Grounded, empathetic, and real. Sarah offers life coaching and a
            listening ear for your daily thoughts.
          </p>
        </div>
        <div className={styles.featureCard}>
          <h3 className={styles.featureTitle}>🔒 Private & Safe</h3>
          <p className={styles.featureDesc}>
            Your conversations are private. We prioritize your data security
            so you can express yourself freely.
          </p>
        </div>
      </section>
    </main>
  );
}
