import React, { useEffect, useState } from 'react';
import styles from './ThumbnailBloom.module.css';
import { getSegmentThumbnailSrc } from './thumbnailPreviewUtils';
import type { MediaMetadata } from '../ThumbnailModal/useMediaMetadata';

interface ThumbnailBloomProps {
  hoverTime: number | null;
  metadata: MediaMetadata;
  slug: string;
  timelineWidth: number;
  isHoveringTimeline: boolean;
}

const ThumbnailBloom: React.FC<ThumbnailBloomProps> = ({
  hoverTime,
  metadata,
  slug,
  timelineWidth,
  isHoveringTimeline,
}) => {
  const { duration, segmentLength } = metadata;
  const totalSegments = Math.floor(duration / segmentLength);
  const hoveredIndex =
    hoverTime != null && hoverTime >= 0
      ? Math.round(hoverTime / segmentLength)
      : null;

  const [lastHoveredIndex, setLastHoveredIndex] = useState<number | null>(null);
  const [exitingIndices, setExitingIndices] = useState<number[]>([]);

  useEffect(() => {
    if (
      hoveredIndex !== lastHoveredIndex &&
      lastHoveredIndex !== null &&
      hoveredIndex !== null
    ) {
      setExitingIndices((prev) => [...prev, lastHoveredIndex]);

      setTimeout(() => {
        setExitingIndices((prev) => prev.filter((i) => i !== lastHoveredIndex));
      }, 400);
    }

    setLastHoveredIndex(hoveredIndex);
  }, [hoveredIndex]);

  const indices = Array.from({ length: totalSegments }, (_, i) => i);

  return (
    <div className={styles.bloomContainer}>
      {indices.map((index) => {
        const segmentTime = index * segmentLength;
        const src = getSegmentThumbnailSrc(slug, segmentTime, duration);
        if (!src) return null;

        const left = (index * segmentLength / duration) * timelineWidth;
        const THUMB_WIDTH = 128; // defined in css
        const offsetLeft = left - THUMB_WIDTH / 2;

        const isActive = index === hoveredIndex;
        const isExiting = exitingIndices.includes(index);
        const shouldGrow = isActive && isHoveringTimeline;

        const className = [
          styles.thumb,
          isActive ? styles.entering : isExiting ? styles.exiting : '',
          shouldGrow ? styles.hoverGrow : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <img
            key={segmentTime}
            src={src}
            alt={`Preview at ${segmentTime}s`}
            className={className}
            style={{ left: `${offsetLeft}px` }}
          />
        );
      })}
    </div>
  );
};

export default ThumbnailBloom;