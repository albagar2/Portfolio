export interface CreateExpenseDto {
  amount: number;
  description: string;
  category: string;
  date: string | Date;
  userId: string;
  familyId: string;
  propertyId?: string;
  paymentMethodId?: string;
  dueDate?: string | Date;
  receiptUrl?: string;
  isRecurring?: boolean;
  interval?: string;
}

export interface SyncExpenseDto extends CreateExpenseDto {
  syncKey: string;
}
