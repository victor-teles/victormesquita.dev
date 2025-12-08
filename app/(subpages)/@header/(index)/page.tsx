'use client';

import { useState } from 'react';
import styles from './home-header.module.css';
import Modal from '@/components/modal';
import CandyCrushGame from '@/components/candy-crush-game';

export default function HomeHeader() {
  const [isGameOpen, setIsGameOpen] = useState(false);

  return (
    <div className={styles.heading}>
      <h1 
        onClick={() => setIsGameOpen(true)} 
        style={{ cursor: 'pointer' }}
        title="Click to play a game!"
      >
        Victor Mesquita
      </h1>
      
      <Modal isOpen={isGameOpen} onClose={() => setIsGameOpen(false)}>
        <CandyCrushGame />
      </Modal>
    </div>
  );
}
