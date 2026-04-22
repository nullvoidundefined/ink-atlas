import styles from './page.module.scss';

function ComingSoonPage() {
  return (
    <main className={styles.page} data-test-id='coming-soon-page'>
      <div className={styles.content}>
        <h1 className={styles.brand}>InkAtlas</h1>
        <p className={styles.tagline}>Coming soon.</p>
      </div>
    </main>
  );
}

ComingSoonPage.displayName = 'ComingSoonPage';

export default ComingSoonPage;
