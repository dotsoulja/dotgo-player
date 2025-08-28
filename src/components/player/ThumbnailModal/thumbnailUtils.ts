/**
 * Generate an array of thumbnail timestamps based on duration and segment length.
 * @param duration - Total video duration in seconds
 * @param segmentLength - Segment length in seconds (e.g. 4)
 */
export const getThumbnailTimes = (duration: number, segmentLength: number): number[] => {
  const count = Math.floor(duration / segmentLength);
  const times = Array.from({ length: count }, (_, i) => Math.round(i * segmentLength));
  console.log(`🧮 getThumbnailTimes: duration=${duration}s, segmentLength=${segmentLength}s → ${times.length} timestamps`);
  return times;
};

/**
 * Construct thumbnail image path from slug and timestamp.
 * Format: /media/output/<slug>/thumbnails/thumb_XXX.jpg
 * Where XXX is zero-padded seconds (e.g. 016 for 16s)
 * @param slug - Media slug (e.g. 'thelostboys')
 * @param time - Timestamp in seconds
 */
export const getThumbnailSrc = (slug: string, time: number): string => {
  const seconds = Math.round(time);
  const padded = String(seconds).padStart(3, '0');
  const filename = `thumb_${padded}.jpg`;
  const url = `http://localhost:8000/media/output/${slug}/thumbnails/${filename}`;
  console.log(`🖼️ getThumbnailSrc: time=${time}s → ${filename} → ${url}`);
  return url;
};

/**
 * Calculate scroll offset to center the thumbnail strip based on current playback time.
 * Movement is slowed by treating each thumbnail as covering 2× segmentLength.
 * @param currentTime - Current video time in seconds
 * @param segmentLength - Segment duration in seconds
 * @param thumbnailWidth - Width of each thumbnail in pixels
 * @param containerWidth - Width of the scroll container in pixels
 */
export function getScrollOffset(
  currentTime: number,
  segmentLength: number,
  thumbWidth: number,
  gap: number
): number {
  const index = Math.floor(currentTime / segmentLength);
  return index * (thumbWidth + gap) + thumbWidth / 2;
}

/**
 * Calculate scale factor for a thumbnail based on its distance from current playback time.
 * @param currentTime - Current video time in seconds
 * @param thumbTime - Timestamp of the thumbnail
 * @param segmentLength - Segment duration in seconds
 */
export const getThumbnailScale = (
  currentTime: number,
  thumbTime: number,
  segmentLength: number
): number => {
  const distance = Math.abs(currentTime - thumbTime);
  const normalized = Math.min(distance / segmentLength, 1);
  const scale = 1 + Math.cos(normalized * Math.PI) * 0.5; // Dock-style easing
  return parseFloat(scale.toFixed(3));
};