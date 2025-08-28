import React from 'react';
import styles from './ThumbnailWave.module.css';
import { getSegmentThumbnailSrc } from '../../ThumbnailPreview/thumbnailPreviewUtils';
import type { MediaMetadata } from '../ThumbnailModal/useMediaMetadata';

interface ThumbnailWaveProps {
  hoverTime: number;
  x: number;
  metadata: MediaMetadata;
  slug: string;
  visible: boolean;
  timelineWidth: number;
}

const THUMB_WIDTH = 128;

const ThumbnailWave: React.FC<ThumbnailWaveProps> = ({
  hoverTime,
  x,
  metadata,
  slug,
  visible,
  timelineWidth,
}) => {
  const { duration, segmentLength } = metadata;
  const centerIndex = Math.round(hoverTime / segmentLength);

  // Dynamically calculate how many thumbnails can fit
  const maxThumbs = Math.floor(timelineWidth / THUMB_WIDTH);
  const half = Math.floor(maxThumbs / 2);

  const indices = Array.from({ length: maxThumbs }, (_, i) => centerIndex - half + i)
    .filter((index) => index >= 0 && index * segmentLength < duration);

  return (
    <div
      className={styles.waveContainer}
      style={{
        left: `${x - THUMB_WIDTH / 2}px`,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }}
    >
      {indices.map((index, i) => {
        const time = index * segmentLength;
        const src = getSegmentThumbnailSrc(slug, time, duration);
        if (!src) return null;

        const distanceFromCenter = Math.abs(i - half);
        const scale = 1 - distanceFromCenter * 0.15;

        // Position relative to center thumbnail
        const offsetX = (i - half) * THUMB_WIDTH;

        // Fade thumbnails near edges
        const thumbX = x + offsetX;
        const distanceFromEdge = Math.min(thumbX, timelineWidth - thumbX);
        const fade = Math.max(0, Math.min(1, distanceFromEdge / 100));

        return (
          <img
            key={time}
            src={src}
            alt={`Preview at ${time}s`}
            className={styles.thumb}
            style={{
              transform: `scale(${scale})`,
              left: `${offsetX}px`,
              opacity: fade,
              zIndex: 20 - distanceFromCenter,
            }}
          />
        );
      })}
    </div>
  );
};

export default ThumbnailWave;