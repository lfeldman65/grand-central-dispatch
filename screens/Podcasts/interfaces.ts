// Podcasts in Postman

export interface PodcastDataProps {
  id: number;
  title: string;
  url: string;
  imageUrl: string;
  duration: number;
  authorName: string;
  type: string;
}

export interface PodcastDataResponse {
  data: PodcastDataProps[];
  error: string;
  status: string;
}

// Not API

export interface PlayerStatus {
  muted?: boolean;
  playbackInstancePosition?: any;
  playbackInstanceDuration?: any;
  shouldPlay?: boolean;
  isPlaying?: boolean;
  isBuffering?: boolean;
  volume?: number;
}
