// Shotstack API (Edit v1) types + helpers

export type HexColor = `#${string}`;
export type NinePosition =
  | 'top'
  | 'topRight'
  | 'right'
  | 'bottomRight'
  | 'bottom'
  | 'bottomLeft'
  | 'left'
  | 'topLeft'
  | 'center';

export interface Offset {
  x?: number;
  y?: number;
}
export interface Crop {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export interface ChromaKey {
  color: HexColor;
  threshold?: number;
  halo?: number;
}

type TransitionBase =
  | 'fade'
  | 'reveal'
  | 'wipeLeft'
  | 'wipeRight'
  | 'slideLeft'
  | 'slideRight'
  | 'slideUp'
  | 'slideDown'
  | 'carouselLeft'
  | 'carouselRight'
  | 'carouselUp'
  | 'carouselDown'
  | 'shuffleTopRight'
  | 'zoom';
export type TransitionName =
  | TransitionBase
  | `${TransitionBase}Slow`
  | `${TransitionBase}Fast`;

export interface Transition {
  in?: TransitionName;
  out?: TransitionName;
}

type MotionEffectBase =
  | 'zoomIn'
  | 'zoomOut'
  | 'slideLeft'
  | 'slideRight'
  | 'slideUp'
  | 'slideDown';
export type MotionEffect =
  | MotionEffectBase
  | `${MotionEffectBase}Slow`
  | `${MotionEffectBase}Fast`;

export type Filter =
  | 'blur'
  | 'boost'
  | 'contrast'
  | 'darken'
  | 'greyscale'
  | 'lighten'
  | 'muted'
  | 'negative';

export interface VideoAsset {
  type: 'video';
  src: string;
  transcode?: boolean;
  trim?: number;
  volume?: number;
  volumeEffect?: 'fadeIn' | 'fadeOut' | 'fadeInFadeOut';
  speed?: number;
  crop?: Crop;
  chromaKey?: ChromaKey;
}

export interface ImageAsset {
  type: 'image';
  src: string;
  crop?: Crop;
}

export interface TextFont {
  family?: string;
  size?: number;
  color?: HexColor;
  lineHeight?: number;
  weight?: number;
}
export interface TextStroke {
  color: HexColor;
  width: number;
}
export interface TextBackground {
  color?: HexColor;
  opacity?: number;
  padding?: number;
  borderRadius?: number;
}
export interface TextAlignment {
  horizontal?: 'left' | 'center' | 'right';
  vertical?: 'top' | 'center' | 'bottom';
}

export interface TextAsset {
  type: 'text';
  text: string;
  font?: TextFont;
  stroke?: TextStroke;
  width?: number;
  height?: number;
  background?: TextBackground;
  alignment?: TextAlignment;
}

export interface TitleAsset {
  type: 'title';
  text: string;
  style?:
    | 'minimal'
    | 'blockbuster'
    | 'vogue'
    | 'sketchy'
    | 'skinny'
    | 'chunk'
    | 'chunkLight'
    | 'marker'
    | 'future'
    | 'subtitle';
  color?: HexColor;
  size?:
    | 'xx-small'
    | 'x-small'
    | 'small'
    | 'medium'
    | 'large'
    | 'x-large'
    | 'xx-large';
  background?: HexColor;
  position?: NinePosition;
  offset?: Offset;
}

export interface HtmlAsset {
  type: 'html';
  html: string;
  css?: string;
  width?: number;
  height?: number;
  background?: 'transparent' | HexColor;
  position?: NinePosition;
}

export interface AudioAsset {
  type: 'audio';
  src: string;
  trim?: number;
  speed?: number;
  effect?: 'fadeIn' | 'fadeOut' | 'fadeInFadeOut';
}

export interface LumaAsset {
  type: 'luma';
  src: string;
  trim?: number;
}

export type Asset =
  | VideoAsset
  | ImageAsset
  | TextAsset
  | TitleAsset
  | HtmlAsset
  | AudioAsset
  | LumaAsset;

export interface Clip {
  asset: Asset;
  start: number | 'auto';
  length: number | 'auto' | 'end';
  fit?: 'cover' | 'contain' | 'crop' | 'none';
  scale?: number;
  position?: NinePosition;
  offset?: Offset;
  transition?: Transition;
  effect?: MotionEffect;
  filter?: Filter;
  opacity?: number;
  transform?: {
    rotate?: { angle: number };
    skew?: { x?: number; y?: number };
    flip?: { horizontal?: boolean; vertical?: boolean };
  };
}

export interface Track {
  clips: Clip[];
}
export interface FontRef {
  src: string;
}
export interface Soundtrack {
  src: string;
  effect?: 'fadeIn' | 'fadeOut' | 'fadeInFadeOut';
  volume?: number;
}

export interface Timeline {
  soundtrack?: Soundtrack;
  background?: HexColor;
  fonts?: FontRef[];
  tracks: Track[];
  cache?: boolean;
}

export interface Output {
  format: 'mp4' | 'gif' | 'jpg' | 'png' | 'bmp' | 'mp3';
  resolution?: 'preview' | 'mobile' | 'sd' | 'hd' | '1080' | '4k';
  aspectRatio?: '16:9' | '9:16' | '1:1' | '4:5' | '4:3';
  size?: { width?: number; height?: number };
  fps?: number;
  scaleTo?: 'preview' | 'mobile' | 'sd' | 'hd' | '1080';
  quality?: 'verylow' | 'low' | 'medium' | 'high' | 'veryhigh';
  repeat?: boolean;
  mute?: boolean;
}

export interface ShotstackRenderPayload {
  timeline: Timeline;
  output: Output;
}

export interface RenderResponse {
  success: boolean;
  message: string;
  response: { message: string; id: string };
}

export interface RenderStatusResponse {
  success: boolean;
  message: string;
  response: {
    status: 'queued' | 'fetching' | 'rendering' | 'saving' | 'done' | 'failed';
    id: string;
    url?: string;
    error?: string;
  };
}

// ---- HTTP helpers (from previous version) ----

const API_KEY = import.meta.env.VITE_SHOTSTACK_API_KEY as string;
const ENV = (import.meta.env.VITE_SHOTSTACK_ENV as string) || 'stage';
const BASE_URL = `https://api.shotstack.io/edit/${ENV}`;

export async function createRender(
  config: ShotstackRenderPayload
): Promise<string> {
  const response = await fetch(`${BASE_URL}/render`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
    body: JSON.stringify(config),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to create render: ${response.statusText} - ${errorText}`
    );
  }
  const data: RenderResponse = await response.json();
  return data.response.id;
}

export async function getRenderStatus(
  renderId: string
): Promise<RenderStatusResponse['response']> {
  const response = await fetch(`${BASE_URL}/render/${renderId}`, {
    headers: { 'x-api-key': API_KEY },
  });
  if (!response.ok)
    throw new Error(`Failed to get render status: ${response.statusText}`);
  const data: RenderStatusResponse = await response.json();
  return data.response;
}

export async function pollRenderStatus(
  renderId: string,
  onProgress?: (status: RenderStatusResponse['response']['status']) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const status = await getRenderStatus(renderId);
        if (onProgress) onProgress(status.status);
        if (status.status === 'done') {
          clearInterval(interval);
          if (status.url) resolve(status.url);
          else reject(new Error('Render completed but no URL provided'));
        } else if (status.status === 'failed') {
          clearInterval(interval);
          reject(new Error(status.error || 'Render failed'));
        }
      } catch (err) {
        clearInterval(interval);
        reject(err);
      }
    }, 3000);
  });
}
