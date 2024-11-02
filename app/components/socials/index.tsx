import { SocialButton } from './social-button';
import styles from './socials.module.css';
import { GitHub, Twitter, Mail, RSS } from '@components/icons';

const Socials = (props: Omit<React.HTMLProps<HTMLDivElement>, 'className'>) => {
  return (
    <div className={styles.socials} {...props}>
      <SocialButton href="https://github.com/victor-teles" icon={<GitHub strokeWidth={2} />} tooltip="GitHub" />
      <SocialButton href="https://twitter.com/XVictorMesquita" icon={<Twitter strokeWidth={2} />} tooltip="Twitter" />
      <SocialButton href="mailto:contato@victormesquita.dev" icon={<Mail strokeWidth={2} />} tooltip="Email" />
      <SocialButton href="/feed.xml" icon={<RSS strokeWidth={2} />} tooltip="RSS" />
      {/* <ThemeSwitcher /> */}
    </div>
  );
};

export default Socials;
