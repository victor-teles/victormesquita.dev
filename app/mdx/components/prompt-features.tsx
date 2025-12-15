import styles from './prompt-features.module.css';

type Feature = {
  icon: string;
  title: string;
  description: string;
};

type PromptFeaturesProps = {
  features: Feature[];
};

export function PromptFeatures({ features }: PromptFeaturesProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <span>O que esse prompt faz?</span>
      </div>
      
      <div className={styles.list}>
        {features.map((feature, index) => (
          <div key={index} className={styles.feature}>
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
