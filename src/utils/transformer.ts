import type { SimpleConfig } from '../types';
import type { ShotstackRenderPayload } from '../services/shotstack';

const CLIP_DURATION = 3; // seconds per image

export function transformToShotstackPayload(
  config: SimpleConfig
): ShotstackRenderPayload {
  const { images } = config;

  // Create text overlay clips
  const textClips = images.map((image, index) => ({
    asset: {
      type: 'title' as const,
      text: image.title,
      style: 'blockbuster' as const,
      color: '#ffffff',
      size: 'large' as const,
    },
    start: index * CLIP_DURATION,
    length: CLIP_DURATION,
    effect: 'slideLeft' as const,
    position: 'bottom' as const,
  }));

  // Create image clips with varying effects
  const imageClips = images.map((image, index) => ({
    asset: {
      type: 'image' as const,
      src: image.url,
    },
    start: index * CLIP_DURATION,
    length: CLIP_DURATION,
    effect: 'slideLeft' as 'slideRight',
    transition: {
      in: 'fade' as const,
      out: 'fade' as const,
    },
  }));

  return {
    timeline: {
      background: '#000000',
      tracks: [
        // Text overlay track (rendered on top)
        {
          clips: textClips,
        },
        // Image track (rendered below text)
        {
          clips: imageClips,
        },
      ],
    },
    output: {
      format: 'mp4',
      resolution: 'sd',
    },
  };
}
