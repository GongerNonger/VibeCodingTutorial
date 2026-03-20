'use client';

import { useState, useEffect } from 'react';

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  type: 'hourly' | 'fixed' | 'per-unit';
}

interface Invoice {
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

function formatCurrency(amount: number, currency: string): string {
  const symbols: Record<string, string> = { USD: '$', EUR: '\u20ac', GBP: '\u00a3', CAD: 'CA$' };
  const symbol = symbols[currency] || '$';
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    draft: 'bg-gray-700 text-gray-300',
    sent: 'bg-blue-900/50 text-blue-400',
    paid: 'bg-emerald-900/50 text-emerald-400',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${colors[status] || colors.draft}`}>
      {status}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = { hourly: 'Hourly', fixed: 'Fixed', 'per-unit': 'Per Unit' };
  return (
    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 font-medium uppercase tracking-wider">
      {labels[type] || type}
    </span>
  );
}

export default function Home() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'form' | 'preview' | 'history'>('form');

  // Form state
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [taxRate, setTaxRate] = useState('10');
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    fetchInvoices();
  }, []);

  async function fetchInvoices() {
    const res = await fetch('/api/invoices');
    const data = await res.json();
    setInvoices(data);
  }

  async function generateInvoice() {
    if (!clientName.trim() || !description.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim(),
          projectName: projectName.trim() || 'Untitled Project',
          description: description.trim(),
          taxRate: parseFloat(taxRate) || 0,
          currency,
        }),
      });
      const invoice = await res.json();
      setSelectedInvoice(invoice);
      setView('preview');
      fetchInvoices();
      // Reset form
      setClientName('');
      setClientEmail('');
      setProjectName('');
      setDescription('');
      setTaxRate('10');
      setCurrency('USD');
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="no-print border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-violet-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">InvoiceAI</h1>
            <span className="text-xs text-gray-500 hidden sm:inline">Smart Invoice Generator</span>
          </div>
          <nav className="flex gap-1">
            <button
              onClick={() => setView('form')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === 'form' ? 'bg-violet-500/20 text-violet-400' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              New Invoice
            </button>
            <button
              onClick={() => setView('history')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === 'history' ? 'bg-violet-500/20 text-violet-400' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              History ({invoices.length})
            </button>
            {selectedInvoice && (
              <button
                onClick={() => setView('preview')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === 'preview' ? 'bg-violet-500/20 text-violet-400' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Preview
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Creation Form */}
        {view === 'form' && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Create New Invoice</h2>
              <p className="text-gray-400">Describe the work you did in plain English. We&apos;ll generate a professional invoice with itemized line items automatically.</p>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Client Name *</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Acme Corp"
                    className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Client Email</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="billing@acme.com"
                    className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Website Redesign"
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Work Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  placeholder={"Designed and developed a new landing page (20 hours of design, 35 hours of development at $150/hr). Also did SEO optimization as a fixed $2000 package, and created 12 custom icons at $50 each."}
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors resize-none"
                />
                <p className="text-xs text-gray-600 mt-1.5">Tip: Include quantities, rates, and pricing types for best results. Separate items with commas, semicolons, or new lines.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (&euro;)</option>
                    <option value="GBP">GBP (&pound;)</option>
                    <option value="CAD">CAD (CA$)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={generateInvoice}
                disabled={loading || !clientName.trim() || !description.trim()}
                className="w-full py-3 px-6 bg-violet-500 hover:bg-violet-600 disabled:bg-gray-800 disabled:text-gray-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating Invoice...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Invoice
                  </>
                )}
              </button>
            </div>

            {/* Pricing info */}
            <div className="mt-10 p-4 rounded-lg border border-gray-800 bg-gray-900/50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200">Free: 3 invoices/month</p>
                  <p className="text-sm text-gray-500">Upgrade to Pro for $12/mo for unlimited invoices, custom branding, and recurring invoices.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Preview */}
        {view === 'preview' && selectedInvoice && (
          <div>
            <div className="no-print flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Invoice Preview</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setView('form')}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg transition-colors"
                >
                  New Invoice
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 text-sm bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print / Download
                </button>
              </div>
            </div>

            <div className="invoice-preview max-w-3xl mx-auto bg-gray-900 border border-gray-800 rounded-xl p-8 sm:p-10">
              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h3 className="text-2xl font-bold text-violet-400">INVOICE</h3>
                  <p className="text-gray-400 text-sm mt-1">{selectedInvoice.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-white">Your Company</p>
                  <p className="text-sm text-gray-400">123 Business Ave</p>
                  <p className="text-sm text-gray-400">New York, NY 10001</p>
                  <p className="text-sm text-gray-400">hello@yourcompany.com</p>
                </div>
              </div>

              {/* Client & Dates */}
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Bill To</p>
                  <p className="text-white font-medium">{selectedInvoice.clientName}</p>
                  {selectedInvoice.clientEmail && (
                    <p className="text-sm text-gray-400">{selectedInvoice.clientEmail}</p>
                  )}
                  <p className="text-sm text-gray-400 mt-1">{selectedInvoice.projectName}</p>
                </div>
                <div className="text-right">
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Date Issued</p>
                    <p className="text-sm text-gray-300">{formatDate(selectedInvoice.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Due Date</p>
                    <p className="text-sm text-gray-300">{formatDate(selectedInvoice.dueDate)}</p>
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Description</th>
                      <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Type</th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Qty</th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Rate</th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.lineItems.map((item, i) => (
                      <tr key={i} className="border-b border-gray-800/50">
                        <td className="py-3 text-sm text-gray-200 pr-4">{item.description}</td>
                        <td className="py-3 text-center"><TypeBadge type={item.type} /></td>
                        <td className="py-3 text-sm text-gray-300 text-right">{item.quantity}</td>
                        <td className="py-3 text-sm text-gray-300 text-right">{formatCurrency(item.rate, selectedInvoice.currency)}</td>
                        <td className="py-3 text-sm text-white text-right font-medium">{formatCurrency(item.amount, selectedInvoice.currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-gray-200">{formatCurrency(selectedInvoice.subtotal, selectedInvoice.currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tax ({selectedInvoice.taxRate}%)</span>
                    <span className="text-gray-200">{formatCurrency(selectedInvoice.tax, selectedInvoice.currency)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-700">
                    <span className="text-white">Total</span>
                    <span className="text-violet-400">{formatCurrency(selectedInvoice.total, selectedInvoice.currency)}</span>
                  </div>
                </div>
              </div>

              {/* Footer note */}
              <div className="mt-10 pt-6 border-t border-gray-800">
                <p className="text-xs text-gray-500">Payment is due within 30 days. Thank you for your business.</p>
              </div>
            </div>
          </div>
        )}

        {/* Invoice History */}
        {view === 'history' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Invoice History</h2>
            {invoices.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No invoices yet. Create your first one!</p>
                <button
                  onClick={() => setView('form')}
                  className="mt-4 px-6 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-sm transition-colors"
                >
                  Create Invoice
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {invoices.map((inv) => (
                  <button
                    key={inv.id}
                    onClick={() => { setSelectedInvoice(inv); setView('preview'); }}
                    className="w-full text-left p-4 bg-gray-900 border border-gray-800 rounded-lg hover:border-violet-500/50 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm font-mono text-gray-500">{inv.id}</p>
                          <p className="text-white font-medium group-hover:text-violet-400 transition-colors">{inv.clientName}</p>
                          <p className="text-sm text-gray-500">{inv.projectName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-semibold text-white">{formatCurrency(inv.total, inv.currency)}</p>
                          <p className="text-xs text-gray-500">{formatDate(inv.createdAt)}</p>
                        </div>
                        <StatusBadge status={inv.status} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">InvoiceAI - Smart Invoice Generator</p>
          <p className="text-sm text-gray-600">Free: 3/mo &middot; Pro: $12/mo unlimited</p>
        </div>
      </footer>
    </div>
  );
}
