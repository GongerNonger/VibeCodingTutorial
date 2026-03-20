import { NextRequest, NextResponse } from 'next/server';
import { getInvoiceById } from '../../store';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const invoice = getInvoiceById(params.id);
  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }
  return NextResponse.json(invoice);
}
