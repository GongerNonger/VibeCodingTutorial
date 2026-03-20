export interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  type: 'hourly' | 'fixed' | 'per-unit';
}

export interface Invoice {
  id: string;
  clientName: string;
  clientEmail: string;
  projectName: string;
  description: string;
  lineItems: LineItem[];
  subtotal: number;
  taxRate: number;
  tax: number;
  total: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid';
  createdAt: string;
  dueDate: string;
}

const invoices: Invoice[] = [
  {
    id: 'INV-001',
    clientName: 'Acme Corp',
    clientEmail: 'billing@acme.com',
    projectName: 'Website Redesign',
    description: 'Complete redesign of corporate website including 10 pages, responsive design, and SEO optimization.',
    lineItems: [
      { description: 'UI/UX Design (10 pages)', quantity: 40, rate: 125, amount: 5000, type: 'hourly' },
      { description: 'Frontend Development', quantity: 60, rate: 150, amount: 9000, type: 'hourly' },
      { description: 'SEO Optimization', quantity: 1, rate: 2000, amount: 2000, type: 'fixed' },
    ],
    subtotal: 16000,
    taxRate: 10,
    tax: 1600,
    total: 17600,
    currency: 'USD',
    status: 'paid',
    createdAt: '2026-03-01T10:00:00Z',
    dueDate: '2026-03-31T10:00:00Z',
  },
  {
    id: 'INV-002',
    clientName: 'StartupXYZ',
    clientEmail: 'finance@startupxyz.io',
    projectName: 'Mobile App MVP',
    description: 'Built a React Native mobile app MVP with authentication, dashboard, and push notifications.',
    lineItems: [
      { description: 'React Native Development', quantity: 80, rate: 140, amount: 11200, type: 'hourly' },
      { description: 'Authentication System', quantity: 1, rate: 3000, amount: 3000, type: 'fixed' },
      { description: 'Push Notification Integration', quantity: 1, rate: 1500, amount: 1500, type: 'fixed' },
    ],
    subtotal: 15700,
    taxRate: 8,
    tax: 1256,
    total: 16956,
    currency: 'USD',
    status: 'sent',
    createdAt: '2026-03-10T14:00:00Z',
    dueDate: '2026-04-10T14:00:00Z',
  },
  {
    id: 'INV-003',
    clientName: 'Design Studio Berlin',
    clientEmail: 'accounts@dsberlin.de',
    projectName: 'Brand Identity Package',
    description: 'Logo design, brand guidelines document, and 500 business cards printed.',
    lineItems: [
      { description: 'Logo Design', quantity: 1, rate: 2500, amount: 2500, type: 'fixed' },
      { description: 'Brand Guidelines Document', quantity: 15, rate: 100, amount: 1500, type: 'hourly' },
      { description: 'Business Cards', quantity: 500, rate: 0.50, amount: 250, type: 'per-unit' },
    ],
    subtotal: 4250,
    taxRate: 19,
    tax: 807.50,
    total: 5057.50,
    currency: 'EUR',
    status: 'draft',
    createdAt: '2026-03-18T09:00:00Z',
    dueDate: '2026-04-18T09:00:00Z',
  },
];

let nextId = 4;

export function getInvoices(): Invoice[] {
  return [...invoices].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getInvoiceById(id: string): Invoice | undefined {
  return invoices.find((inv) => inv.id === id);
}

export function addInvoice(invoice: Omit<Invoice, 'id'>): Invoice {
  const newInvoice: Invoice = {
    ...invoice,
    id: `INV-${String(nextId++).padStart(3, '0')}`,
  };
  invoices.push(newInvoice);
  return newInvoice;
}
