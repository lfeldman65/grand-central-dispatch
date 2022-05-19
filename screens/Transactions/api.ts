import { http } from '../../utils/http';
import { TransactionDataResponse, TxChangeStatusResponse } from './interfaces';

export function getTransactionData(status: string, type: string): Promise<TransactionDataResponse> {
  return http.get(`deals?filter=${status}&lastItem=0&batchSize=100&dealType=${type}`);
} // back tick (`) only necessary for string interpolation

export function changeTxStatus(idDeal: number, newStatus: string): Promise<TxChangeStatusResponse> {
  console.log(idDeal);
  console.log(newStatus);
  return http.post('dealChangeStatus', {
    body: { idDeal, newStatus },
  });
}
