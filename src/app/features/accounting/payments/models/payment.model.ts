export interface Payment {
  id: string;
  docNo: string;
  status: 'Approved' | 'Pending' | 'Draft';
  bookDate: string;
  postedDate: string;
  partyName: string;
  partyType: 'Supplier' | 'Customer' | 'Employee' | 'Other';
  amount: number;
  paymentMode: 'Cash' | 'Bank' | 'Cheque';
  bankAccount: string;
}

export interface PaymentStats {
  totalPayments: number;
  totalPaymentsPercentage: number;
  approvedCount: number;
  approvedTotal: number;
  pendingCount: number;
  bankPaymentsAmount: number;
  bankPaymentsPercentage: number;
  cashPaymentsAmount: number;
  cashPaymentsPercentage: number;
}

export interface PendingInvoice {
  id: string;
  invoiceNo: string;
  bookDate: string;
  dueDate: string;
  dueAmount: number;
  paymentAmount: number;
  status: 'Unpaid' | 'Partial' | 'Paid';
}

export interface PaymentCharge {
  id: string;
  accountId: string;
  costCenterId: string;
  amount: number;
  description: string;
}
