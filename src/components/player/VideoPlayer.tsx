import React, { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';
import ThumbnailBloom from './ThumbnailPreview/ThumbnailBloom';
import { useMediaMetadata } from './ThumbnailModal/useMediaMetadata';
import styles from './VideoPlayer.module.css';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  slug: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, slug }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [isHoveringTimeline, setIsHoveringTimeline] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelineWidth, setTimelineWidth] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isThumbnailVisible, setIsThumbnailVisible] = useState(false);
  const [isTimelineVisible, setIsTimelineVisible] = useState(true);

  const { metadata } = useMediaMetadata(slug);

  useEffect(() => {
    const updateWidth = () => {
      if (timelineRef.current) {
        setTimelineWidth(timelineRef.current.offsetWidth);
      }
    };
    updateWidth();

    window.addEventListener('resize', updateWidth);
    document.addEventListener('fullscreenchange', updateWidth);

    return () => {
      window.removeEventListener('resize', updateWidth);
      document.removeEventListener('fullscreenchange', updateWidth);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isNativeHLS = video.canPlayType('application/vnd.apple.mpegurl') !== '';
    if (isNativeHLS) {
      video.src = src;
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.attachMedia(video);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => hls.loadSource(src));
      return () => hls.destroy();
    }
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updatePlayState = () => setIsPlaying(!video.paused);
    const updateCurrentTime = () => setCurrentTime(video.currentTime);

    video.addEventListener('play', updatePlayState);
    video.addEventListener('pause', updatePlayState);
    video.addEventListener('timeupdate', updateCurrentTime);

    return () => {
      video.removeEventListener('play', updatePlayState);
      video.removeEventListener('pause', updatePlayState);
      video.removeEventListener('timeupdate', updateCurrentTime);
    };
  }, []);

  const getTimeFromClick = (clientX: number): number | null => {
    if (!timelineRef.current || !metadata) return null;
    const rect = timelineRef.current.getBoundingClientRect();
    const percent = (clientX - rect.left) / rect.width;
    return percent * metadata.duration;
  };

  const startInactivityTimer = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      setIsThumbnailVisible(false);
      setIsTimelineVisible(true);
    }, 4000);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const time = getTimeFromClick(e.clientX);
    if (time === null) return;

    setHoverTime(time);
    setIsHoveringTimeline(true);
    setIsThumbnailVisible(true);
    setIsTimelineVisible(false);

    startInactivityTimer();
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
    setIsHoveringTimeline(false);
    setIsThumbnailVisible(false);
    setIsTimelineVisible(true);

    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  };

  const handleTimelineClick = (e: React.MouseEvent) => {
    const time = getTimeFromClick(e.clientX);
    const video = videoRef.current;
    if (time !== null && video) {
      video.currentTime = time;
      if (video.paused) {
        video.play();
      }
    }
  };

  const handleFullscreen = () => {
    const wrapper = wrapperRef.current;
    if (wrapper?.requestFullscreen) wrapper.requestFullscreen();
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    video.paused ? video.play() : video.pause();
  };

  return (
    <div className={styles.container}>
      <div className={styles.playerWrapper} ref={wrapperRef}>
        <video
          ref={videoRef}
          poster={poster}
          className={styles.video}
          disablePictureInPicture
          controls={false}
        />

        <button onClick={handlePlayPause} className={styles.playPauseButton}>
          {isPlaying ? '⏸️' : '▶️'}
        </button>

        <button onClick={handleFullscreen} className={styles.fullscreenButton}>
          ⛶
        </button>

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

        {metadata && isTimelineVisible && (
          <div className={styles.visualTimeline}>
            <div
              className={styles.progressMarker}
              style={{
                left: `${(currentTime / metadata.duration) * 100}%`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;