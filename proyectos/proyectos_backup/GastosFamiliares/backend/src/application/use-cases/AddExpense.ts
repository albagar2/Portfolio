import { IExpenseRepository } from '../../domain/repositories/IExpenseRepository';
import { Expense, Category } from '../../domain/entities/Expense';
import { CreateExpenseDto } from '../dtos/ExpenseDto';

export class AddExpenseUseCase {
  constructor(private expenseRepository: IExpenseRepository) {}

  async execute(data: CreateExpenseDto) {
    const expense = new Expense(
      '',
      Number(data.amount),
      data.description,
      data.category as Category,
      data.date ? new Date(data.date) : new Date(),
      data.userId,
      data.familyId,
      data.dueDate ? new Date(data.dueDate) : undefined,
      data.receiptUrl,
      data.isRecurring || false,
      data.interval,
      data.propertyId,
      data.paymentMethodId
    );

    return await this.expenseRepository.save(expense);
  }
}
