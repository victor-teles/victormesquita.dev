'use client';

import Link from '@components/link';
import Tooltip from '@components/tooltip';
import { track } from '@vercel/analytics/react';
import styles from './socials.module.css';

type SocialButtonProps = {
  href: string;
  icon: React.ReactNode;
  tooltip: string;
};

export const SocialButton = ({ tooltip, href, icon }: SocialButtonProps) => {
  return (
    <Tooltip text={tooltip} direction="top">
      <Link
        href={href}
        className={styles.icon}
        external
        onClick={() =>
          track('clicked social link', {
            type: tooltip.toLowerCase(),
          })
        }
      >
        {icon}
      </Link>
    </Tooltip>
  );
};
