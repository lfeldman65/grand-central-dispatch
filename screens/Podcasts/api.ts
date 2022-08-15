import { http } from '../../utils/http';
import { PodcastDataResponse } from './interfaces';

export function getPodcastData(): Promise<PodcastDataResponse> {
  return http.get('media?batchSize=50&lastItem=0&type=audio');
}
