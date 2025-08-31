import type { RefObject } from 'react';
import type { MediaMetadata } from '../ThumbnailModal/useMediaMetadata';

export const useVisualTimelineClick = (
    timelineRef: RefObject<HTMLDivElement | null>,
    videoRef: RefObject<HTMLVideoElement | null>,
    metadata: MediaMetadata | null
) => {
    const handleClick = (e: React.MouseEvent<Element, MouseEvent>) => {
     if (!timelineRef.current || !videoRef.current || !metadata) return;

     const rect = timelineRef.current.getBoundingClientRect();
       const clickX = e.clientX - rect.left;
       const timelineWidth = rect.width;

       const percent = Math.min(Math.max(clickX / timelineWidth, 0), 1);
       const newTime = percent * metadata.duration;
        
       videoRef.current.currentTime = newTime;

       if (videoRef.current.paused) {
           videoRef.current.play();
       }
    };

    return { handleClick };
};