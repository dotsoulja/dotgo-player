import React, { useEffect } from 'react';
import styles from './ThumbnailPreview.module.css';
import { getNearestSegmentTime, getSegmentThumbnailSrc } from '../../src/components/ThumbnailPreview/thumbnailPreviewUtils';
import type { MediaMetadata } from '../../src/components/ThumbnailModal/useMediaMetadata';

interface ThumbnailPreviewProps {
  hoverTime: number;
  visible: boolean;
  x: number;
  metadata: MediaMetadata;
  slug: string;
}

const THUMB_WIDTH = 128;

const ThumbnailPreview: React.FC<ThumbnailPreviewProps> = ({
  hoverTime,
  visible,
  x,
  metadata,
  slug,
}) => {
  if (
    !metadata ||
    typeof metadata.duration !== 'number' ||
    typeof metadata.segmentLength !== 'number'
  ) {
    console.warn(`⚠️ Metadata malformed`, metadata);
    return null;
  }

  const { duration, segmentLength } = metadata;
  const snappedTime = getNearestSegmentTime(hoverTime, segmentLength, duration);
  const src = getSegmentThumbnailSrc(slug, snappedTime, duration);

  useEffect(() => {
    if (visible && src) {
      console.log(`👁️ ThumbnailPreview: hover=${hoverTime.toFixed(2)}s → snapped=${snappedTime}s → src=${src}`);
    }
  }, [hoverTime, visible, x]);

  if (!visible || !src) return null;

  return (
    <div
      className={styles.preview}
      style={{
        left: `${x - THUMB_WIDTH / 2}px`,
      }}
    >
      <img
        src={src}
        alt={`Preview at ${snappedTime}s`}
        onError={() => console.warn(`🚫 Failed to load thumbnail: ${src}`)}
      />
    </div>
  );
};

export default ThumbnailPreview;