export interface PaymentRow {
  id: number;
  invoiceReceipt: string;
  relatedInvoice: string;
  date: string;
  transactionType: 'Payment' | 'Refund' | 'Credit';
  amount: number;
  documentType: 'Invoice' | 'Receipt' | 'Credit Note';
  status: 'Paid' | 'Pending' | 'Failed' | 'Cancelled';
}

export const paymentRows: PaymentRow[] = [
  {
    id: 1,
    invoiceReceipt: 'INV-2024-001',
    relatedInvoice: 'INV-2024-001',
    date: '2024-01-15',
    transactionType: 'Payment',
    amount: 1250.00,
    documentType: 'Invoice',
    status: 'Paid',
  },
  {
    id: 2,
    invoiceReceipt: 'REC-2024-002',
    relatedInvoice: 'INV-2024-002',
    date: '2024-01-18',
    transactionType: 'Payment',
    amount: 850.50,
    documentType: 'Receipt',
    status: 'Paid',
  },
  {
    id: 3,
    invoiceReceipt: 'CRN-2024-003',
    relatedInvoice: 'INV-2024-003',
    date: '2024-01-20',
    transactionType: 'Credit',
    amount: 200.00,
    documentType: 'Credit Note',
    status: 'Pending',
  },
  {
    id: 4,
    invoiceReceipt: 'INV-2024-004',
    relatedInvoice: 'INV-2024-004',
    date: '2024-01-22',
    transactionType: 'Payment',
    amount: 1750.75,
    documentType: 'Invoice',
    status: 'Failed',
  },
  {
    id: 5,
    invoiceReceipt: 'REC-2024-005',
    relatedInvoice: 'INV-2024-005',
    date: '2024-01-25',
    transactionType: 'Refund',
    amount: 450.00,
    documentType: 'Receipt',
    status: 'Paid',
  },
  {
    id: 6,
    invoiceReceipt: 'INV-2024-006',
    relatedInvoice: 'INV-2024-006',
    date: '2024-01-28',
    transactionType: 'Payment',
    amount: 3200.00,
    documentType: 'Invoice',
    status: 'Cancelled',
  },
  {
    id: 7,
    invoiceReceipt: 'CRN-2024-007',
    relatedInvoice: 'INV-2024-007',
    date: '2024-01-30',
    transactionType: 'Credit',
    amount: 150.25,
    documentType: 'Credit Note',
    status: 'Pending',
  },
  {
    id: 8,
    invoiceReceipt: 'REC-2024-008',
    relatedInvoice: 'INV-2024-008',
    date: '2024-02-01',
    transactionType: 'Payment',
    amount: 950.00,
    documentType: 'Receipt',
    status: 'Paid',
  },
  {
    id: 9,
    invoiceReceipt: 'INV-2024-009',
    relatedInvoice: 'INV-2024-009',
    date: '2024-02-03',
    transactionType: 'Payment',
    amount: 2100.50,
    documentType: 'Invoice',
    status: 'Paid',
  },
  {
    id: 10,
    invoiceReceipt: 'REC-2024-010',
    relatedInvoice: 'INV-2024-010',
    date: '2024-02-05',
    transactionType: 'Refund',
    amount: 300.00,
    documentType: 'Receipt',
    status: 'Paid',
  },
]; 