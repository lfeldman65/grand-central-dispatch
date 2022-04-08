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
