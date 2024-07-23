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

const total = 1320000;
const pf = 3800 * 12;

const sd_new = 75000;
const sd_old = 50000;

const old_tax = calculateTaxOld(total - sd_old - pf);
const new_tax = calculateTax(total - sd_new - pf);

console.log("Old: ", old_tax);
console.log("New: ", new_tax);
console.log("----------------------------------------------------------------");

console.log("Old Salary: ", ((total - pf - old_tax) / 12).toFixed(2));
console.log("New Salary: ", ((total - pf - new_tax) / 12).toFixed(2));

console.log("----------------------------------------------------------------");

console.log(
  "Total Savings: ",
  (calculateTaxOld(total) - calculateTax(total)).toFixed(2)
);

console.log(
  "Savings per month: ",
  ((calculateTaxOld(total) - calculateTax(total)) / 12).toFixed(2)
);
