import styles from './Avatar.module.css';

export default function Avatar({ alt, src, text = null }) {
  return (
    <div className={styles.container}>
      <img alt={alt} src={src} title={src} className={styles.avatar} />
      {text && <strong>{text}</strong>}
    </div>
  );
}
