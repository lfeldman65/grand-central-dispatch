import { http } from '../../utils/http';
import { TransactionDataResponse } from './interfaces';

export function getTransactionData(status: string, type: string): Promise<TransactionDataResponse> {
  return http.get(`deals?filter=${status}&lastItem=0&batchSize=100&dealType=${type}`);
} // back tick (`) only necessary for string interpolation

//return http.get(`contacts?sortType=${type}&lastItem=0&batchSize=100`);
