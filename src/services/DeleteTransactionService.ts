import { getCustomRepository } from 'typeorm';

import TransactionRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface RequestDTO {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: RequestDTO): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const selectedTransaction = await transactionRepository.findOne({
      where: { id },
    });

    if (!selectedTransaction) {
      throw new AppError('Transaction not found');
    }

    await transactionRepository.remove(selectedTransaction);
  }
}

export default DeleteTransactionService;
