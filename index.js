const express = require("express");
const app = express();
const port = 3000;

function calculateTax(income) {
  let tax = 0;
  if (income <= 300000) {
    return tax;
  }

  if (income > 300000 && income <= 700000) {
    tax += (income - 300000) * 0.05;
    return tax;
  }

  if (income > 700000 && income <= 1000000) {
    tax += (700000 - 300000) * 0.05;
    tax += (income - 700000) * 0.1;
    return tax;
  }

  if (income > 1000000 && income <= 1200000) {
    tax += (700000 - 300000) * 0.05;
    tax += (1000000 - 700000) * 0.1;
    tax += (income - 1000000) * 0.15;
    return tax;
  }

  if (income > 1200000 && income <= 1500000) {
    tax += (700000 - 300000) * 0.05;
    tax += (1000000 - 700000) * 0.1;
    tax += (1200000 - 1000000) * 0.15;
    tax += (income - 1200000) * 0.2;
    return tax;
  }

  if (income > 1500000) {
    tax += (700000 - 300000) * 0.05;
    tax += (1000000 - 700000) * 0.1;
    tax += (1200000 - 1000000) * 0.15;
    tax += (1500000 - 1200000) * 0.2;
    tax += (income - 1500000) * 0.3;
  }

  return tax;
}

function calculateTaxOld(income) {
  let tax = 0;

  if (income <= 300000) {
    return tax;
  }

  if (income > 300000 && income <= 600000) {
    tax += (income - 300000) * 0.05;
    return tax;
  }

  if (income > 600000 && income <= 900000) {
    tax += (600000 - 300000) * 0.05;
    tax += (income - 600000) * 0.1;
    return tax;
  }

  if (income > 900000 && income <= 1200000) {
    tax += (600000 - 300000) * 0.05;
    tax += (900000 - 600000) * 0.1;
    tax += (income - 900000) * 0.15;
    return tax;
  }

  if (income > 1200000 && income <= 1500000) {
    tax += (600000 - 300000) * 0.05;
    tax += (900000 - 600000) * 0.1;
    tax += (1200000 - 900000) * 0.15;
    tax += (income - 1200000) * 0.2;
    return tax;
  }

  if (income > 1500000) {
    tax += (600000 - 300000) * 0.05;
    tax += (900000 - 600000) * 0.1;
    tax += (1200000 - 900000) * 0.15;
    tax += (1500000 - 1200000) * 0.2;
    tax += (income - 1500000) * 0.3;
  }

  return tax;
}

app.get("/:income", (req, res) => {
  const total = parseInt(req.params.income);
  const pf = 3800 * 12;
  const sd_new = 75000;
  const sd_old = 50000;

  const old_tax = calculateTaxOld(total - sd_old - pf);
  const new_tax = calculateTax(total - sd_new - pf);

  const oldSalary = ((total - pf - old_tax) / 12).toFixed(2);
  const newSalary = ((total - pf - new_tax) / 12).toFixed(2);

  const totalSavings = (calculateTaxOld(total) - calculateTax(total)).toFixed(
    2
  );
  const savingsPerMonth = (
    (calculateTaxOld(total) - calculateTax(total)) /
    12
  ).toFixed(2);

  const response = `
    <html>
    <head>
      <title>Tax Calculation</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-family: Arial, sans-serif;
        }
        .container {
          text-align: center;
          border: 1px solid #ccc;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Tax Calculation Results</h2>
        <p><strong>Old Tax:</strong> ${old_tax}</p>
        <p><strong>New Tax:</strong> ${new_tax}</p>
        <hr>
        <p><strong>Old Salary:</strong> ${oldSalary}</p>
        <p><strong>New Salary:</strong> ${newSalary}</p>
        <hr>
        <p><strong>Total Savings:</strong> ${totalSavings}</p>
        <p><strong>Savings per Month:</strong> ${savingsPerMonth}</p>
      </div>
    </body>
    </html>
  `;

  res.send(response);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
