import { parseDescription, formatCurrency } from './app/api/generate';
import { getInvoices, getInvoiceById, addInvoice, Invoice } from './app/api/store';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  PASS: ${message}`);
    passed++;
  } else {
    console.error(`  FAIL: ${message}`);
    failed++;
  }
}

console.log('\n=== InvoiceAI Tests ===\n');

// Test 1: Invoice generation from description
console.log('Test 1: Invoice generation from description');
{
  const result = parseDescription('20 hours of frontend development at $150/hr', 10);
  assert(result.lineItems.length >= 1, 'Should produce at least 1 line item');
  assert(result.subtotal > 0, 'Subtotal should be positive');
  assert(result.total > result.subtotal, 'Total should include tax');
  assert(result.tax > 0, 'Tax should be calculated');
}

// Test 2: Line item parsing with multiple items
console.log('\nTest 2: Line item parsing with multiple items');
{
  const result = parseDescription(
    'Logo design as a fixed $2500 package; 15 hours of brand guidelines at $100/hr; 500 business cards at $0.50 each',
    0
  );
  assert(result.lineItems.length === 3, `Should produce 3 line items (got ${result.lineItems.length})`);
  assert(result.subtotal === result.total, 'With 0% tax, subtotal should equal total');
}

// Test 3: Tax calculation
console.log('\nTest 3: Tax calculation');
{
  const result = parseDescription('Fixed project setup $1000', 20);
  const expectedTax = Math.round(result.subtotal * 0.2 * 100) / 100;
  assert(result.tax === expectedTax, `Tax should be 20% of subtotal (expected ${expectedTax}, got ${result.tax})`);
  const expectedTotal = Math.round((result.subtotal + result.tax) * 100) / 100;
  assert(result.total === expectedTotal, `Total should be subtotal + tax (expected ${expectedTotal}, got ${result.total})`);
}

// Test 4: Currency formatting
console.log('\nTest 4: Currency formatting');
{
  assert(formatCurrency(1234.56, 'USD') === '$1,234.56', 'USD formatting');
  assert(formatCurrency(1000, 'EUR') === '\u20ac1,000.00', 'EUR formatting');
  assert(formatCurrency(500.5, 'GBP') === '\u00a3500.50', 'GBP formatting');
  assert(formatCurrency(250, 'CAD') === 'CA$250.00', 'CAD formatting');
}

// Test 5: Invoice CRUD operations
console.log('\nTest 5: Invoice CRUD operations');
{
  const initialCount = getInvoices().length;
  assert(initialCount === 3, `Should have 3 pre-seeded invoices (got ${initialCount})`);

  const newInvoice = addInvoice({
    clientName: 'Test Client',
    clientEmail: 'test@test.com',
    projectName: 'Test Project',
    description: 'Test work',
    lineItems: [{ description: 'Test item', quantity: 1, rate: 100, amount: 100, type: 'fixed' }],
    subtotal: 100,
    taxRate: 10,
    tax: 10,
    total: 110,
    currency: 'USD',
    status: 'draft',
    createdAt: new Date().toISOString(),
    dueDate: new Date().toISOString(),
  });

  assert(newInvoice.id.startsWith('INV-'), 'New invoice should have auto-generated ID');
  assert(getInvoices().length === initialCount + 1, 'Invoice count should increase by 1');

  const fetched = getInvoiceById(newInvoice.id);
  assert(fetched !== undefined, 'Should be able to retrieve invoice by ID');
  assert(fetched!.clientName === 'Test Client', 'Retrieved invoice should have correct data');
}

// Test 6: Pricing type detection
console.log('\nTest 6: Pricing type detection and edge cases');
{
  const hourlyResult = parseDescription('8 hours of consulting at $200/hr', 0);
  assert(hourlyResult.lineItems[0].type === 'hourly', 'Should detect hourly pricing');

  const fixedResult = parseDescription('One-time setup fee $500', 0);
  assert(fixedResult.lineItems[0].type === 'fixed', 'Should detect fixed pricing');

  const unitResult = parseDescription('25 page designs at $150 each', 0);
  assert(unitResult.lineItems[0].type === 'per-unit', 'Should detect per-unit pricing');

  // Zero tax rate
  const zeroTax = parseDescription('Development work 10 hours', 0);
  assert(zeroTax.tax === 0, 'Zero tax rate should produce zero tax');
  assert(zeroTax.subtotal === zeroTax.total, 'With zero tax, subtotal equals total');
}

// Summary
console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
if (failed > 0) process.exit(1);
