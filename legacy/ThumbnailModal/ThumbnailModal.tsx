import React, { useRef, useEffect, useState } from 'react';
import styles from './ThumbnailModal.module.css';
import {
  getThumbnailTimes,
  getThumbnailSrc,
  getScrollOffset,
} from './thumbnailUtils';
import { useMediaMetadata } from './useMediaMetadata';

interface ThumbnailModalProps {
  slug: string;
  currentTime: number;
  isPlaying: boolean;
}

const THUMB_WIDTH = 128;
const THUMB_GAP = 16;

const ThumbnailModal: React.FC<ThumbnailModalProps> = ({
  slug,
  currentTime,
  isPlaying,
}) => {
  const { metadata, loading } = useMediaMetadata(slug);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [animatedOffset, setAnimatedOffset] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    let frameId: number;

    const animate = () => {
      if (!metadata) return;

      const pacingUnit = metadata.segmentLength;
      const baseOffset = (containerWidth / 2) - (THUMB_WIDTH / 2);
      const scrollOffset = getScrollOffset(currentTime, pacingUnit, THUMB_WIDTH, THUMB_GAP);
      const targetOffset = baseOffset + scrollOffset;

      setAnimatedOffset((prev) => {
        const diff = targetOffset - prev;

        if (!isPlaying || Math.abs(diff) > 100) return targetOffset;

        const step = diff * 0.25;
        return Math.abs(diff) < 0.5 ? targetOffset : prev + step;
      });

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [currentTime, isPlaying, containerWidth, metadata]);

  if (loading || !metadata) return null;

  const { duration, segmentLength } = metadata;
  const times = getThumbnailTimes(duration, segmentLength);

  return (
    <div className={styles.modal} ref={containerRef}>
      <div
        className={styles.strip}
        style={{
          transform: `translateX(${-animatedOffset}px)`,
          transition: 'none',
        }}
      >
        {times.map((time) => (
          <img
            key={time}
            src={getThumbnailSrc(slug, time)}
            alt={`Thumbnail at ${time}s`}
            className={styles.thumbnail}
          />
        ))}
      </div>
    </div>
  );
};

export default ThumbnailModal;