import { Request, Response } from 'express';
import { PrismaExpenseRepository } from '../../database/PrismaExpenseRepository';

export class UploadController {
  private expenseRepository = new PrismaExpenseRepository();

  async uploadReceipt(req: Request, res: Response) {
    try {
      const { expenseId } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      if (!expenseId) {
        return res.status(400).json({ message: 'Expense ID is required' });
      }

      const fileUrl = `http://localhost:3001/uploads/${req.file.filename}`;
      
      // Update the expense using the repository
      await this.expenseRepository.update(expenseId, { receiptUrl: fileUrl } as any);
      
      return res.status(200).json({ 
        message: 'Receipt linked to expense successfully',
        url: fileUrl 
      });
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ message: 'Error uploading file' });
    }
  }
}
