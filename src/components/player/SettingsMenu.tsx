// src/components/SettingsMenu.tsx

import React, { useEffect, useState } from 'react';
import styles from './SettingsMenu.module.css';
import Hls, { Level } from 'hls.js';

interface SettingsMenuProps {
  hls: Hls | null;
  onClose: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ hls, onClose }) => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(-1);

  useEffect(() => {
    if (!hls) return;

    const updateLevels = () => {
      setLevels(hls.levels);
      setCurrentLevel(hls.currentLevel);
    };

    hls.on(Hls.Events.MANIFEST_PARSED, updateLevels);
    updateLevels();

    return () => {
      hls.off(Hls.Events.MANIFEST_PARSED, updateLevels);
    };
  }, [hls]);

  const handleSelect = (index: number) => {
    if (hls) {
      hls.currentLevel = index;
      setCurrentLevel(index);
      onClose();
    }
  };

  return (
    <div className={styles.menu}>
      {levels.map((level, index) => (
        <button
          key={index}
          className={`${styles.option} ${index === currentLevel ? styles.active : ''}`}
          onClick={() => handleSelect(index)}
        >
          {level.height}p
        </button>
      ))}
    </div>
  );
};

export default SettingsMenu;