import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { PrismaExpenseRepository } from '../../database/PrismaExpenseRepository';
import { AddExpenseUseCase } from '../../../application/use-cases/AddExpense';
import { Logger } from '../../logging/Logger';

export class ExpenseController {
  private expenseRepository = new PrismaExpenseRepository();
  private addExpenseUseCase = new AddExpenseUseCase(this.expenseRepository);

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { amount, description, category, date, userId, familyId, propertyId, paymentMethodId } = req.body;
      
      const finalUserId = req.user?.id || userId;
      const finalFamilyId = req.user?.familyId || familyId;

      if (!finalUserId || !finalFamilyId) {
        throw new Error('User ID and Family ID are required');
      }

      Logger.info(`Creating expense: ${description} for family ${finalFamilyId}`);

      const expense = await this.addExpenseUseCase.execute({
        amount,
        description,
        category,
        userId: finalUserId,
        familyId: finalFamilyId,
        date,
        propertyId,
        paymentMethodId
      });
      res.status(201).json(expense);
    } catch (error: any) {
      next(error);
    }
  }

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      Logger.info(`Fetching all expenses for family ${req.user!.familyId}`);
      const expenses = await this.expenseRepository.findAllByFamily(req.user!.familyId);
      res.json(expenses);
    } catch (error: any) {
      next(error);
    }
  }
}
