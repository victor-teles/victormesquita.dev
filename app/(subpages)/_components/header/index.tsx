import { PropsWithChildren } from 'react';

import ThemeSwitcher from '@components/theme-switcher';
import styles from './header.module.css';

const Header = ({ children }: PropsWithChildren) => {
  return (
    <div className={styles.nav}>
      <div className={styles.header}>{children}</div>
      <div>
        <ThemeSwitcher hideTooltip />
      </div>
    </div>
  );
};

export default Header;
