document.addEventListener('DOMContentLoaded', function () {
  // Declaring variables
  let bankBalance = 0; // Initial bank balance
  let outstandingLoan = 0; // Initial outstanding loan value
  let paySalary = 0; // Initial pay/salary amount
  let laptops = [];
  let cart = [];
  let totalDue = 0.0;

  // DOM Manipulation 
  const bankBalanceElement = document.getElementById('bank-balance');
  const outstandingLoanElement = document.getElementById('outstanding-loan');
  const paySalaryElement = document.getElementById('pay-salary');
  const workButton = document.getElementById('work-button');
  const bankButton = document.getElementById('bank-button');
  const getLoanButton = document.getElementById('get-loan-button');
  const repayLoanButton = document.getElementById('repay-loan-button');
  const laptopSelect = document.getElementById('laptops');
  const buyNowButton = document.getElementById('buynow-button');
  const laptopsElement = document.getElementById("laptops");
  const priceElement = document.getElementById("price");
  const addElement = document.getElementById("add");
  const CartElement = document.getElementById("cart");
  const quantityElement = document.getElementById("quantity")
  const payButtonElement = document.getElementById("pay");
  const totalDueElement = document.getElementById("totalDue");

  // Updating displayed values
  bankBalanceElement.textContent = bankBalance;
  outstandingLoanElement.textContent = outstandingLoan;
  paySalaryElement.textContent = paySalary;

  // Loan button function
  getLoanButton.addEventListener('click', function () {
    var loanAmount = prompt('Enter loan amount:');
    if (loanAmount !== null) {
      loanAmount = Number(loanAmount);
      if (loanAmount > 0 && loanAmount <= bankBalance * 2 && outstandingLoan === 0) {
        outstandingLoan = loanAmount;
        outstandingLoanElement.textContent = outstandingLoan;
        getLoanButton.disabled = true;
        repayLoanButton.style.display = 'inline-block';
      } else {
        alert('Invalid loan amount!');
      }
    }
  });

  // Bank button function
  bankButton.addEventListener('click', function () {
    if (outstandingLoan > 0) {
      var loanRepayment = paySalary * 0.1;
      outstandingLoan -= loanRepayment;
      outstandingLoanElement.textContent = outstandingLoan.toFixed(2);
      paySalary -= loanRepayment;
    }
    bankBalance += paySalary;
    bankBalanceElement.textContent = bankBalance.toFixed(2);
    paySalary = 0;
    paySalaryElement.textContent = paySalary;
  });

  // Work button function
  workButton.addEventListener('click', function () {
    paySalary += 100;
    paySalaryElement.textContent = paySalary;
  });

  // Repay Loan button function
  repayLoanButton.addEventListener('click', function () {
    if (paySalary > 0 && outstandingLoan > 0) {
      if (paySalary >= outstandingLoan) {
        paySalary -= outstandingLoan;
        outstandingLoan = 0;
        repayLoanButton.style.display = 'none';
        getLoanButton.disabled = false;
      } else {
        outstandingLoan -= paySalary;
        paySalary = 0;
      }
      outstandingLoanElement.textContent = outstandingLoan.toFixed(2);
      paySalaryElement.textContent = paySalary.toFixed(2);
    }
  });

  // API + Menu functions.
  fetch("https://hickory-quilled-actress.glitch.me/computers")
    .then(response => response.json())
    .then(data => laptops = data)
    .then(laptops => addLaptopsToMenu(laptops));

  const addLaptopsToMenu = (laptops) => {
    laptops.forEach(x => addLaptopToMenu(x));
    priceElement.innerText = laptops[0].price;
  }

  const addLaptopToMenu = (laptop) => {
    const laptopElement = document.createElement("option");
    laptopElement.value = laptop.id;
    laptopElement.appendChild(document.createTextNode(laptop.description));
    laptopsElement.appendChild(laptopElement);
  }

  const handleLaptopMenuChange = e => {
    const selectedLaptop = laptops[e.target.selectedIndex];
    priceElement.innerText = selectedLaptop.price;
  }

  const handleAddLaptop = () => {
    const selectedLaptop = laptops[laptopsElement.selectedIndex];
    const quantity = parseInt(quantityElement.value);

    const cartItem = document.createElement("li");
    const lineTotal = quantity * selectedLaptop.price;

    cartItem.innerText = `${selectedLaptop.description} ${selectedLaptop.price} ${quantity} ${lineTotal.toFixed(2)}`;
    CartElement.appendChild(cartItem);

    totalDue += lineTotal;
    totalDueElement.innerHTML = `Total Due: ${totalDue.toFixed(2)}`;
  }

  const handlePay = () => {
    const totalPaid = prompt("Please enter the amount of money you wish to pay:");
    const change = parseFloat(totalPaid) - totalDue;
    alert(`Total change due: ${change.toFixed(2)}`);
  }

  laptopsElement.addEventListener("change", handleLaptopMenuChange);
  addElement.addEventListener("click", handleAddLaptop);
  payButtonElement.addEventListener('click', handlePay);
});