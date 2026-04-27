import { Expense } from '../entities/Expense';

export interface IExpenseRepository {
  findAllByFamily(familyId: string): Promise<Expense[]>;
  save(expense: Expense): Promise<Expense>;
  update(id: string, data: Partial<Expense>): Promise<Expense>;
  delete(id: string): Promise<void>;
}
