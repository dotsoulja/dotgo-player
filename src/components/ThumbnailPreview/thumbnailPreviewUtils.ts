// src/components/player/ThumbnailPreview/thumbnailPreviewUtils.ts

/**
 * Snap hover time to the nearest segment-aligned timestamp,
 * clamped to avoid generating thumbnails beyond the last valid segment.
 */
export const getNearestSegmentTime = (
  hoverTime: number,
  segmentLength: number,
  duration: number
): number => {
  // Calculate the last valid segment index (exclude final segment if it lands exactly at duration)
  const maxIndex = Math.floor((duration - 0.001) / segmentLength); // Subtract tiny epsilon to avoid rounding up
  const index = Math.max(0, Math.min(maxIndex, Math.round(hoverTime / segmentLength)));
  const snappedTime = index * segmentLength;
  console.log(`📌 Snapped hoverTime=${hoverTime.toFixed(2)}s → index=${index} → segmentTime=${snappedTime}s`);
  return snappedTime;
};

/**
 * Generate thumbnail URL from slug and segment-aligned time.
 * Returns null if segmentTime is at or beyond duration.
 */
export const getSegmentThumbnailSrc = (
  slug: string,
  segmentTime: number,
  duration: number
): string | null => {
  const EPSILON = 0.5;

  // Guard: skip if segmentTime is within ±0.5s of duration
  if (Math.abs(duration - segmentTime) <= EPSILON || segmentTime > duration) {
    console.warn(`🚫 Skipping thumbnail: segmentTime=${segmentTime}s is too close to or beyond duration=${duration}s`);
    return null;
  }

  const seconds = Math.round(segmentTime);
  const padded = String(seconds).padStart(3, '0');
  const filename = `thumb_${padded}.jpg`;
  const url = `http://localhost:8000/media/output/${slug}/thumbnails/${filename}`;
  // console.log(`🖼️ getSegmentThumbnailSrc: time=${segmentTime}s → ${filename} → ${url}`);
  return url;
};