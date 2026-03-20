import { NextRequest, NextResponse } from 'next/server';
import { getInvoices, addInvoice } from '../store';
import { parseDescription } from '../generate';

export async function GET() {
  const invoices = getInvoices();
  return NextResponse.json(invoices);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientName, clientEmail, projectName, description, taxRate = 10, currency = 'USD' } = body;

    if (!clientName || !description) {
      return NextResponse.json({ error: 'Client name and description are required' }, { status: 400 });
    }

    const parsed = parseDescription(description, taxRate);

    const now = new Date();
    const due = new Date(now);
    due.setDate(due.getDate() + 30);

    const invoice = addInvoice({
      clientName,
      clientEmail: clientEmail || '',
      projectName: projectName || 'Untitled Project',
      description,
      lineItems: parsed.lineItems,
      subtotal: parsed.subtotal,
      taxRate,
      tax: parsed.tax,
      total: parsed.total,
      currency,
      status: 'draft',
      createdAt: now.toISOString(),
      dueDate: due.toISOString(),
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
