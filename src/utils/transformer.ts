import type { ImageItem } from '../types';
import type { ShotstackRenderPayload, HexColor } from '../services/shotstack';

const CLIP_DURATION = 4;

const BLACK: HexColor = '#000000';

export function transformToShotstackPayload(
  config: ImageItem[]
): ShotstackRenderPayload {
  const textClips = config.map((image, index) => ({
    asset: {
      type: 'html' as const,
      html: `<p>${image.title}</p>`,
      css: `p {
        font-family: 'Arial', sans-serif;
        font-weight: bold;
        color: #ffffff;
        font-size: 46px;
        text-align: left;
        background-color: rgba(0, 0, 0, 0.7);
        padding: 10px 20px;
        border-radius: 6px;
        margin: 0;
        display: inline-block;
      }`,
      width: 960,
      height: 120,
    },
    start: index * CLIP_DURATION,
    length: CLIP_DURATION,
    position: 'bottomLeft' as const,
    offset: {
      x: 0.03,
      y: 0.135,
    },
    transition: {
      in: 'slideRight' as const,
      out: 'slideLeft' as const,
    },
  }));

  const imageClips = config.map((image, index) => ({
    asset: { type: 'image' as const, src: image.url },
    start: index * CLIP_DURATION,
    length: CLIP_DURATION,
    transition: { in: 'fade' as const, out: 'fade' as const },
    fit: 'contain' as const,
  }));

  return {
    timeline: {
      background: BLACK,
      tracks: [{ clips: textClips }, { clips: imageClips }],
    },
    output: {
      format: 'mp4',
      resolution: 'sd' as const,
    },
  };
}
