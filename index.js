const express = require("express");
const app = express();
const port = 3000;

// Constants
const CONSTANTS = {
  PF_MONTHLY: 3600,
  STANDARD_DEDUCTION: {
    2023: 50000,
    2024: 75000,
    2025: 75000,
  },
};

// Tax calculation functions
function calculateTax2025(income) {
  if (income <= 400000) {
    return 0;
  }

  let tax = 0;

  // 5% for 4,00,001 to 8,00,000
  if (income > 400000) {
    const slab1 = Math.min(income - 400000, 400000);
    tax += slab1 * 0.05;
  }

  // 10% for 8,00,001 to 12,00,000
  if (income > 800000) {
    const slab2 = Math.min(income - 800000, 400000);
    tax += slab2 * 0.1;
  }

  // 15% for 12,00,001 to 16,00,000
  if (income > 1200000) {
    const slab3 = Math.min(income - 1200000, 400000);
    tax += slab3 * 0.15;
  }

  // 20% for 16,00,001 to 20,00,000
  if (income > 1600000) {
    const slab4 = Math.min(income - 1600000, 400000);
    tax += slab4 * 0.2;
  }

  // 25% for 20,00,001 to 24,00,000
  if (income > 2000000) {
    const slab5 = Math.min(income - 2000000, 400000);
    tax += slab5 * 0.25;
  }

  // 30% above 24,00,000
  if (income > 2400000) {
    const slab6 = income - 2400000;
    tax += slab6 * 0.3;
  }

  return Math.round(tax);
}

function calculateTax2024(income) {
  if (income <= 0) return 0;
  let tax = 0;
  const slabs = [
    { limit: 300000, rate: 0 },
    { limit: 700000, rate: 0.05 },
    { limit: 1000000, rate: 0.1 },
    { limit: 1200000, rate: 0.15 },
    { limit: 1500000, rate: 0.2 },
    { limit: Infinity, rate: 0.3 },
  ];

  let remainingIncome = income;
  let previousLimit = 0;

  for (const slab of slabs) {
    if (remainingIncome <= 0) break;
    const taxableAmount = Math.min(remainingIncome, slab.limit - previousLimit);
    tax += taxableAmount * slab.rate;
    remainingIncome -= taxableAmount;
    previousLimit = slab.limit;
  }

  return Math.round(tax);
}

function calculateTax2023(income) {
  if (income <= 0) return 0;
  let tax = 0;
  const slabs = [
    { limit: 300000, rate: 0 },
    { limit: 600000, rate: 0.05 },
    { limit: 900000, rate: 0.1 },
    { limit: 1200000, rate: 0.15 },
    { limit: 1500000, rate: 0.2 },
    { limit: Infinity, rate: 0.3 },
  ];

  let remainingIncome = income;
  let previousLimit = 0;

  for (const slab of slabs) {
    if (remainingIncome <= 0) break;
    const taxableAmount = Math.min(remainingIncome, slab.limit - previousLimit);
    tax += taxableAmount * slab.rate;
    remainingIncome -= taxableAmount;
    previousLimit = slab.limit;
  }

  return Math.round(tax);
}

function calculateNetSalary(grossIncome, year) {
  const pf = CONSTANTS.PF_MONTHLY * 12;
  const standardDeduction = CONSTANTS.STANDARD_DEDUCTION[year];
  const taxableIncome = grossIncome - standardDeduction - pf;

  let tax;
  switch (year) {
    case "2023":
      tax = calculateTax2023(taxableIncome);
      break;
    case "2024":
      tax = calculateTax2024(taxableIncome);
      break;
    case "2025":
      tax = calculateTax2025(taxableIncome);
      break;
    default:
      throw new Error("Invalid year");
  }

  return {
    grossIncome,
    taxableIncome,
    tax,
    netAnnual: grossIncome - pf - tax,
    netMonthly: (grossIncome - pf - tax) / 12,
  };
}

// Express route handler
app.get("/:income", (req, res) => {
  try {
    const grossIncome = parseInt(req.params.income);

    if (isNaN(grossIncome) || grossIncome < 0) {
      throw new Error("Invalid income value");
    }

    const result2023 = calculateNetSalary(grossIncome, "2023");
    const result2024 = calculateNetSalary(grossIncome, "2024");
    const result2025 = calculateNetSalary(grossIncome, "2025");

    const savings = {
      total: result2024.tax - result2025.tax,
      monthly: (result2024.tax - result2025.tax) / 12,
    };

    const response = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tax Calculation</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .year-section {
            margin-bottom: 24px;
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
          }
          .savings-section {
            margin-top: 24px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
          }
          h2 {
            color: #2c3e50;
            margin-bottom: 20px;
          }
          .amount {
            font-weight: bold;
            color: #2c3e50;
          }
          .label {
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Tax Calculation Results</h2>
          
          <div class="year-section">
            <h3>Financial Year 2023-24</h3>
            <p><span class="label">Taxable Income:</span> <span class="amount">₹${result2023.taxableIncome.toLocaleString()}</span></p>
            <p><span class="label">Annual Tax:</span> <span class="amount">₹${result2023.tax.toLocaleString()}</span></p>
            <p><span class="label">Monthly Net Salary:</span> <span class="amount">₹${result2023.netMonthly
              .toFixed(2)
              .toLocaleString()}</span></p>
          </div>

          <div class="year-section">
            <h3>Financial Year 2024-25</h3>
            <p><span class="label">Taxable Income:</span> <span class="amount">₹${result2024.taxableIncome.toLocaleString()}</span></p>
            <p><span class="label">Annual Tax:</span> <span class="amount">₹${result2024.tax.toLocaleString()}</span></p>
            <p><span class="label">Monthly Net Salary:</span> <span class="amount">₹${result2024.netMonthly
              .toFixed(2)
              .toLocaleString()}</span></p>
          </div>

          <div class="year-section">
            <h3>Financial Year 2025-26</h3>
            <p><span class="label">Taxable Income:</span> <span class="amount">₹${result2025.taxableIncome.toLocaleString()}</span></p>
            <p><span class="label">Annual Tax:</span> <span class="amount">₹${result2025.tax.toLocaleString()}</span></p>
            <p><span class="label">Monthly Net Salary:</span> <span class="amount">₹${result2025.netMonthly
              .toFixed(2)
              .toLocaleString()}</span></p>
          </div>

          <div class="savings-section">
            <h3>Savings (2025 vs 2024)</h3>
            <p><span class="label">Total Annual Savings:</span> <span class="amount">₹${savings.total
              .toFixed(2)
              .toLocaleString()}</span></p>
            <p><span class="label">Monthly Savings:</span> <span class="amount">₹${savings.monthly
              .toFixed(2)
              .toLocaleString()}</span></p>
          </div>
        </div>
      </body>
      </html>
    `;

    res.send(response);
  } catch (error) {
    res.status(400).send(`
      <html>
        <body>
          <h2>Error</h2>
          <p>${error.message}</p>
        </body>
      </html>
    `);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
