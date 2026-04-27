import { PrismaClient } from '@prisma/client';
import { IExpenseRepository } from '../../domain/repositories/IExpenseRepository';
import { Expense } from '../../domain/entities/Expense';

export class PrismaExpenseRepository implements IExpenseRepository {
  private prisma = new PrismaClient();

  async findAllByFamily(familyId: string): Promise<Expense[]> {
    const expenses = await this.prisma.expense.findMany({
      where: { familyId },
      orderBy: { date: 'desc' }
    });
    return expenses.map(e => this.mapToDomain(e));
  }

  async save(expense: Expense): Promise<Expense> {
    const saved = await this.prisma.expense.create({
      data: {
        amount: expense.amount,
        description: expense.description,
        category: expense.category,
        date: expense.date,
        dueDate: expense.dueDate,
        receiptUrl: expense.receiptUrl,
        isRecurring: expense.isRecurring,
        interval: expense.interval,
        userId: expense.userId,
        familyId: expense.familyId,
        propertyId: expense.propertyId,
        paymentMethodId: expense.paymentMethodId
      }
    });
    return this.mapToDomain(saved);
  }

  async update(id: string, data: Partial<Expense>): Promise<Expense> {
    const updated = await this.prisma.expense.update({
      where: { id },
      data: {
        amount: data.amount,
        description: data.description,
        category: data.category,
        date: data.date,
        dueDate: data.dueDate,
        receiptUrl: data.receiptUrl,
        isRecurring: data.isRecurring,
        interval: data.interval,
        propertyId: data.propertyId,
        paymentMethodId: data.paymentMethodId
      }
    });
    return this.mapToDomain(updated);
  }

  private mapToDomain(p: any): Expense {
    return new Expense(
      p.id,
      p.amount,
      p.description,
      p.category as any,
      p.date,
      p.userId,
      p.familyId,
      p.dueDate || undefined,
      p.receiptUrl || undefined,
      p.isRecurring,
      p.interval || undefined,
      p.propertyId || undefined,
      p.paymentMethodId || undefined
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.expense.delete({ where: { id } });
  }
}
