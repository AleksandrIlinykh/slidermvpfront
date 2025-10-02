const API_KEY = import.meta.env.VITE_SHOTSTACK_API_KEY
const ENV = import.meta.env.VITE_SHOTSTACK_ENV || 'stage'
const BASE_URL = `https://api.shotstack.io/${ENV}`

// Shotstack API Types
interface Asset {
  type: 'video' | 'image' | 'title' | 'html' | 'audio' | 'luma'
  src?: string
  // Title asset properties
  text?: string
  style?: 'minimal' | 'blockbuster' | 'vogue' | 'sketchy' | 'skinny' | 'chunk' | 'chunkLight' | 'marker' | 'future' | 'subtitle'
  color?: string
  size?: 'x-small' | 'small' | 'medium' | 'large' | 'x-large'
  background?: string
  // Video/Image properties
  trim?: number
  volume?: number
  volumeEffect?: string
  speed?: number
  crop?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
  }
}

interface Transition {
  in?: 'fade' | 'reveal' | 'wipeLeft' | 'wipeRight' | 'slideLeft' | 'slideRight' | 'slideUp' | 'slideDown' | 'carouselLeft' | 'carouselRight' | 'carouselUp' | 'carouselDown' | 'shuffleTopRight' | 'zoom'
  out?: 'fade' | 'reveal' | 'wipeLeft' | 'wipeRight' | 'slideLeft' | 'slideRight' | 'slideUp' | 'slideDown' | 'carouselLeft' | 'carouselRight' | 'carouselUp' | 'carouselDown' | 'shuffleTopRight' | 'zoom'
}

interface Clip {
  asset: Asset
  start: number
  length: number
  fit?: 'cover' | 'contain' | 'crop' | 'none'
  scale?: number
  position?: 'top' | 'topRight' | 'right' | 'bottomRight' | 'bottom' | 'bottomLeft' | 'left' | 'topLeft' | 'center'
  offset?: {
    x?: number
    y?: number
  }
  transition?: Transition
  effect?: 'zoomIn' | 'zoomOut' | 'slideLeft' | 'slideRight' | 'slideUp' | 'slideDown'
  filter?: 'boost' | 'contrast' | 'darken' | 'greyscale' | 'lighten' | 'muted' | 'negative'
  opacity?: number
}

interface Track {
  clips: Clip[]
}

interface Soundtrack {
  src: string
  effect?: 'fadeIn' | 'fadeOut' | 'fadeInFadeOut'
  volume?: number
}

interface Timeline {
  soundtrack?: Soundtrack
  background?: string
  tracks: Track[]
  cache?: boolean
}

interface Output {
  format: 'mp4' | 'gif' | 'jpg' | 'png' | 'bmp' | 'mp3'
  resolution?: 'preview' | 'mobile' | 'sd' | 'hd' | '1080'
  aspectRatio?: '16:9' | '9:16' | '1:1' | '4:5' | '4:3'
  size?: {
    width?: number
    height?: number
  }
  fps?: number
  scaleTo?: 'preview' | 'mobile' | 'sd' | 'hd' | '1080'
  quality?: 'low' | 'medium' | 'high'
  repeat?: boolean
  mute?: boolean
}

export interface ShotstackRenderPayload {
  timeline: Timeline
  output: Output
}

interface RenderResponse {
  success: boolean
  message: string
  response: {
    message: string
    id: string
  }
}

interface RenderStatusResponse {
  success: boolean
  message: string
  response: {
    status: 'queued' | 'fetching' | 'rendering' | 'saving' | 'done' | 'failed'
    id: string
    url?: string
    error?: string
  }
}

export async function createRender(config: ShotstackRenderPayload): Promise<string> {
  const response = await fetch(`${BASE_URL}/render`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify(config),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to create render: ${response.statusText} - ${errorText}`)
  }

  const data: RenderResponse = await response.json()
  return data.response.id
}

export async function getRenderStatus(renderId: string): Promise<RenderStatusResponse['response']> {
  const response = await fetch(`${BASE_URL}/render/${renderId}`, {
    headers: {
      'x-api-key': API_KEY,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get render status: ${response.statusText}`)
  }

  const data: RenderStatusResponse = await response.json()
  return data.response
}

export async function pollRenderStatus(
  renderId: string,
  onProgress?: (status: string) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const status = await getRenderStatus(renderId)

        if (onProgress) {
          onProgress(status.status)
        }

        if (status.status === 'done') {
          clearInterval(interval)
          if (status.url) {
            resolve(status.url)
          } else {
            reject(new Error('Render completed but no URL provided'))
          }
        } else if (status.status === 'failed') {
          clearInterval(interval)
          reject(new Error(status.error || 'Render failed'))
        }
      } catch (error) {
        clearInterval(interval)
        reject(error)
      }
    }, 3000) // Poll every 3 seconds
  })
}
