import React, { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';
import { useMediaMetadata } from '../ThumbnailModal/useMediaMetadata';
import { useVisualTimelineClick } from './hooks/useVisualTimelineClick';
import ControlBar from './ControlBar';
import SettingsMenu from './SettingsMenu';
import styles from './VideoPlayer.module.css';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  slug: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, slug }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [isHoveringTimeline, setIsHoveringTimeline] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isThumbnailVisible, setIsThumbnailVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hlsInstance, setHlsInstance] = useState<Hls | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [lastMouseMove, setLastMouseMove] = useState(Date.now());

  const { metadata } = useMediaMetadata(slug);

  const { handleClick: handleVisualTimelineClick } = useVisualTimelineClick(
    timelineRef,
    videoRef,
    metadata
  )

  useEffect(() => {
    const updateWidth = () => {
      if (timelineRef.current) {
        setTimelineWidth(timelineRef.current.offsetWidth);
        console.log(`[UI] Timeline width updated: ${timelineRef.current.offsetWidth}px`);
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
      console.log(`[HLS] Native HLS supported. Source set directly: ${src}`);
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.attachMedia(video);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log('[HLS] Media attached. Loading source...');
        hls.loadSource(src);
      });
      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        console.log(`[HLS] Manifest parsed. Available levels: ${data.levels.length}`);
      });
      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        const level = hls.levels[data.level];
        console.log(`[HLS] Switched to level ${data.level}: ${level.width}x${level.height}`);
      });
      setHlsInstance(hls);

      return () => {
        hls.destroy();
        console.log('[HLS] Instance destroyed.');
      };
    } else {
      console.warn('[HLS] HLS not supported in this environment.');
    }
  }, [src]);

  useEffect(() => {
   const handleFullscreenChange = () => {
    const isNowFullscreen = !!document.fullscreenElement;
    setIsFullscreen(isNowFullscreen);
    console.log(`[UI] Fullscreen state updated: ${isNowFullscreen}`);
   };

   document.addEventListener('fullscreenchange', handleFullscreenChange);
   return () => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
   };
 }, []);


  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updatePlayState = () => {
      setIsPlaying(!video.paused);
      console.log(`[Playback] ${video.paused ? 'Paused' : 'Playing'} at ${video.currentTime.toFixed(2)}s`);
    };
    const updateCurrentTime = () => {
      setCurrentTime(video.currentTime);
    };

    const logResolution = () => {
      console.log(`[Playback] Resolution: ${video.videoWidth}x${video.videoHeight}`);
    };

    video.addEventListener('play', updatePlayState);
    video.addEventListener('pause', updatePlayState);
    video.addEventListener('timeupdate', updateCurrentTime);
    video.addEventListener('canplay', logResolution);

    return () => {
      video.removeEventListener('play', updatePlayState);
      video.removeEventListener('pause', updatePlayState);
      video.removeEventListener('timeupdate', updateCurrentTime);
      video.removeEventListener('canplay', logResolution);
    };
  }, []);

  const getTimeFromClick = (clientX: number): number | null => {
    if (!timelineRef.current || !metadata) return null;
    const rect = timelineRef.current.getBoundingClientRect();
    const percent = (clientX - rect.left) / rect.width;
    const time = percent * metadata.duration;
    // console.log(`[Timeline] Hover/click at ${percent.toFixed(3)} → ${time.toFixed(2)}s`);
    return time;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setLastMouseMove(Date.now());
    if (isIdle) setIsIdle(false);
    
    const time = getTimeFromClick(e.clientX);
    if (time === null) return;

    setHoverTime(time);
    setIsHoveringTimeline(true);
    setIsThumbnailVisible(true);
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
    setIsHoveringTimeline(false);
    setIsThumbnailVisible(false);
  };

  const handleTimelineClick = (e: React.MouseEvent) => {
    const time = getTimeFromClick(e.clientX);
    const video = videoRef.current;
    if (time !== null && video) {
      video.currentTime = time;
      console.log(`[Timeline] Seeked to ${time.toFixed(2)}s`);
      if (video.paused) {
        video.play();
        console.log('[Playback] Auto-play triggered after seek.');
      }
    }
  };

  const handleFullscreen = () => {
  const wrapper = wrapperRef.current;
  if (!wrapper) return;

  const isFullscreenActive = !!document.fullscreenElement;

  try {
    if (isFullscreenActive) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else {
        console.warn('[UI] No supported method to exit fullscreen.');
      }
      console.log('[UI] Fullscreen exit requested');
    } else {
      if (wrapper.requestFullscreen) {
        wrapper.requestFullscreen();
      } else if ((wrapper as any).webkitRequestFullscreen) {
        (wrapper as any).webkitRequestFullscreen();
      } else {
        console.warn('[UI] No supported method to enter fullscreen.');
      }
      console.log('[UI] Fullscreen enter requested');
    }
  } catch (err) {
    console.warn('[UI] Fullscreen toggle failed:', err);
  }
};

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      console.log('[Playback] Play triggered manually.');
    } else {
      video.pause();
      console.log('[Playback] Pause triggered manually.');
    }
  };

  const toggleSettings = () => {
    setShowSettings((prev) => !prev);
    console.log(`[UI] Settings menu ${!showSettings ? 'opened' : 'closed'}.`);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastMouseMove > 2000) {
        setIsIdle(true);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [lastMouseMove]);

  return (
    <div className={styles.container}>
      <div className={styles.playerWrapper} ref={wrapperRef}>
        <div className={styles.aspectBox}>
          <div className={styles.videoFrameContainer}
               onClick={handlePlayPause}
          >
            <video
              ref={videoRef}
              poster={poster}
              className={styles.video}
              disablePictureInPicture
              controls={false}
              onDoubleClick={handleFullscreen}
            />
          </div>
        </div>
        <div className={styles.controlContainer}>
          <ControlBar
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onFullscreen={handleFullscreen}
            isFullscreen={isFullscreen}
            timelineRef={timelineRef}
            handleMouseMove={handleMouseMove}
            handleMouseLeave={handleMouseLeave}
            handleTimelineClick={handleTimelineClick}
            hoverTime={hoverTime}
            metadata={metadata}
            slug={slug}
            timelineWidth={timelineWidth}
            isThumbnailVisible={isThumbnailVisible}
            isHoveringTimeline={isHoveringTimeline}
            currentTime={currentTime}
            showSettings={showSettings}
            toggleSettings={toggleSettings}
            handleVisualTimelineClick={handleVisualTimelineClick}
          />
          {showSettings && (
            <SettingsMenu hls={hlsInstance} onClose={() => setShowSettings(false)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;