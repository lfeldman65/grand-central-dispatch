import { http } from '../../utils/http';
import {
  TransactionDataResponse,
  TxChangeStatusResponse,
  TransactionDetails,
  TransactionDeleteResponse,
  TransactionTypeDataResponse,
} from './interfaces';

export function getTransactionData(status: string, type: string): Promise<TransactionDataResponse> {
  return http.get(`deals?filter=${status}&lastItem=0&batchSize=100&dealType=${type}`);
} // back tick (`) only necessary for string interpolation

export function getTransactionDetails(dealID: string): Promise<TransactionDetails> {
  return http.get(`deal?id=${dealID}`);
} // back tick (`) only necessary for string interpolation

export function changeTxStatus(idDeal: number, newStatus: string): Promise<TxChangeStatusResponse> {
  console.log(idDeal);
  console.log(newStatus);
  return http.post('dealChangeStatus', {
    body: { idDeal, newStatus },
  });
}

export function deleteTx(dealID: number): Promise<TransactionDeleteResponse> {
  console.log(dealID);
  return http.delete(`dealDelete?id=${dealID}`);
}

export function getDealOptions(): Promise<TransactionTypeDataResponse> {
  return http.get(`dealOptions`);
} // back tick (`) only necessary for string interpolation
