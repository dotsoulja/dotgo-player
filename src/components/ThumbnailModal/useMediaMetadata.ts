import { useEffect, useState } from 'react';

export interface MediaMetadata {
  duration: number;
  segmentLength: number;
}

/**
 * Fetches media metadata from backend and normalizes keys.
 * @param slug - Media slug (e.g. 'legendofthelost')
 */
export const useMediaMetadata = (slug: string) => {
  const [metadata, setMetadata] = useState<MediaMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await fetch(`http://localhost:8000/media/output/${slug}/metadata.json`);
        if (!res.ok) throw new Error(`Failed to fetch metadata for ${slug}`);
        const data = await res.json();

        // Normalize backend keys to frontend naming
        setMetadata({
          duration: data.duration,
          segmentLength: data.segment_length,
        });
      } catch (err) {
        console.error(`🧨 Metadata fetch error:`, err);
        setMetadata(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [slug]);

  return { metadata, loading };
};