import { Injectable, signal, computed } from '@angular/core';
import { Payment, PaymentStats, PendingInvoice } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  // State
  private _payments = signal<Payment[]>([
    { id: '1', docNo: 'BP-0011', status: 'Approved', bookDate: '2023-03-11', postedDate: '2023-03-11', partyName: 'Acme Suppliers Ltd', partyType: 'Supplier', amount: 35000, paymentMode: 'Cash', bankAccount: '-' },
    { id: '2', docNo: 'BP-0010', status: 'Approved', bookDate: '2023-08-06', postedDate: '2023-08-06', partyName: 'Tech Supplies Inc', partyType: 'Supplier', amount: 6000, paymentMode: 'Bank', bankAccount: 'test' },
    { id: '3', docNo: 'BP-0009', status: 'Approved', bookDate: '2023-06-14', postedDate: '2023-06-14', partyName: 'Global Trading Co', partyType: 'Supplier', amount: 128, paymentMode: 'Bank', bankAccount: 'test' },
    { id: '4', docNo: 'BP-0008', status: 'Approved', bookDate: '2023-05-08', postedDate: '2023-05-08', partyName: 'City Vendors', partyType: 'Supplier', amount: 30000, paymentMode: 'Cheque', bankAccount: '-' },
    { id: '5', docNo: 'BP-0007', status: 'Pending', bookDate: '2023-08-07', postedDate: '2023-08-07', partyName: 'Metro Supplies', partyType: 'Supplier', amount: 30000, paymentMode: 'Bank', bankAccount: 'test' },
    { id: '6', docNo: 'BP-0006', status: 'Approved', bookDate: '2023-08-07', postedDate: '2023-08-07', partyName: 'Prime Distributors', partyType: 'Supplier', amount: 43000, paymentMode: 'Cheque', bankAccount: '-' },
    { id: '7', docNo: 'BP-0005', status: 'Approved', bookDate: '2023-08-07', postedDate: '2023-08-07', partyName: 'Eastern Traders', partyType: 'Supplier', amount: 1500, paymentMode: 'Bank', bankAccount: 'test' },
    { id: '8', docNo: 'BP-0004', status: 'Approved', bookDate: '2023-06-06', postedDate: '2023-06-06', partyName: 'Northern Wholesale', partyType: 'Supplier', amount: 60000, paymentMode: 'Cash', bankAccount: '-' },
  ]);

  private _stats = signal<PaymentStats>({
    totalPayments: 205628,
    totalPaymentsPercentage: 16.8,
    approvedCount: 7,
    approvedTotal: 8,
    pendingCount: 1,
    bankPaymentsAmount: 37628,
    bankPaymentsPercentage: 18,
    cashPaymentsAmount: 95000,
    cashPaymentsPercentage: 46
  });

  private _showPaymentModal = signal(false);

  // Computed state
  payments = computed(() => this._payments());
  stats = computed(() => this._stats());
  showPaymentModal = computed(() => this._showPaymentModal());

  // Actions
  togglePaymentModal(show: boolean): void {
    this._showPaymentModal.set(show);
  }

  // Mock API call to get pending invoices for a specific party
  getPendingInvoicesForParty(partyId: string): PendingInvoice[] {
    // Return mock data for any party to simulate progressive loading
    return [
      { id: 'inv1', invoiceNo: 'RIN-0012', bookDate: '16/06/2023', dueDate: '30/07/2023', dueAmount: 310, paymentAmount: 0, status: 'Unpaid' },
      { id: 'inv2', invoiceNo: 'PU-0030', bookDate: '12/06/2023', dueDate: '30/07/2023', dueAmount: 60, paymentAmount: 0, status: 'Unpaid' }
    ];
  }
}
