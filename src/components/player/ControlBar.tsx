// src/components/player/ControlBar.tsx

import React, { useRef, } from 'react';
import IconButton from '../icons/IconButton';
import ThumbnailBloom from './ThumbnailPreview/ThumbnailBloom';
import styles from './ControlBar.module.css';
import type { MediaMetadata } from './ThumbnailModal/useMediaMetadata';

interface ControlBarProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onFullscreen: () => void;
  timelineRef: React.RefObject<HTMLDivElement | null>;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseLeave: () => void;
  handleTimelineClick: (e: React.MouseEvent) => void;
  hoverTime: number | null;
  metadata: MediaMetadata | null;
  slug: string;
  timelineWidth: number;
  isThumbnailVisible: boolean;
  isHoveringTimeline: boolean;
  currentTime: number;
}

const ControlBar: React.FC<ControlBarProps> = ({
  isPlaying,
  onPlayPause,
  onFullscreen,
  timelineRef,
  handleMouseMove,
  handleMouseLeave,
  handleTimelineClick,
  hoverTime,
  metadata,
  slug,
  timelineWidth,
  isThumbnailVisible,
  isHoveringTimeline,
  currentTime,
}) => {
  const markerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };

  const handleDragMove = (e: MouseEvent) => {
    if (!metadata || !timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const clampedPercent = Math.max(0, Math.min(1, percent));
    const newTime = clampedPercent * metadata.duration;

    const video = document.querySelector('video');
    if (video) {
      (video as HTMLVideoElement).currentTime = newTime;
    }
  };

  const handleDragEnd = () => {
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
  };

  return (
    <div className={styles.controlBar}>
      <IconButton
        icon={isPlaying ? 'pause' : 'play'}
        onClick={onPlayPause}
        label={isPlaying ? 'Pause video' : 'Play video'}
        className={styles.playPauseButton}
      />

      <IconButton
        icon="fullscreen"
        onClick={onFullscreen}
        label="Enter fullscreen"
        className={styles.fullscreenButton}
      />

      <div
        ref={timelineRef}
        className={styles.timeline}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleTimelineClick}
      >
        {hoverTime !== null && metadata && isThumbnailVisible && (
          <ThumbnailBloom
            hoverTime={hoverTime}
            metadata={metadata}
            slug={slug}
            timelineWidth={timelineWidth}
            isHoveringTimeline={isHoveringTimeline}
          />
        )}
      </div>

      {metadata && (
        <div className={styles.visualTimeline}>
          <div
            ref={markerRef}
            className={styles.progressMarker}
            style={{
              left: `${(currentTime / metadata.duration) * 100}%`,
            }}
            onMouseDown={handleDragStart}
          />
        </div>
      )}
    </div>
  );
};

export default ControlBar;
