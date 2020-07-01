import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && total <= 0) {
      throw new AppError('You cannot make an outcome without money!');
    }

    const searchedCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!searchedCategory) {
      const newCategory = await categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(newCategory);
    }

    const transaction = await transactionRepository.create({
      title,
      type,
      value,
      category: searchedCategory,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
