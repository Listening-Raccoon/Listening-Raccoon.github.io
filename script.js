"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
	owner: "Jonas Schmedtmann",
	movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
	interestRate: 1.2, // %
	login: "schmed",
	pin: "1111",
	currencie: "GBP",
};

const account2 = {
	owner: "Jessica Davis",
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
	interestRate: 1.5,
	login: "davis",
	pin: "2222",
	currencie: "USD",
};

const account3 = {
	owner: "Steven Thomas Williams",
	movements: [200, -200, 340, -300, -20, 50, 400, -460],
	interestRate: 0.7,
	login: "willi",
	pin: "3333",
	currencie: "GBP",
};

const account4 = {
	owner: "Sarah Smith",
	movements: [430, 1000, 700, 50, 90],
	interestRate: 1,
	login: "smith",
	pin: "4444",
	currencie: "EUR",
};

const accounts = [account1, account2, account3, account4];

// let currentUser = account2;
let currentUser;

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");
const containerLogin = document.querySelector(".login");
const containerLogout = document.querySelector(".logout");

const btnLogin = document.querySelector(".login__btn");
const btnLogout = document.querySelector(".logout__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const currencies = new Map([
	[
		"USD",
		{
			fullName: "United States dollar",
			exchangeRate: 1,
			symbol: "$",
		},
	],
	[
		"EUR",
		{
			fullName: "Euro",
			exchangeRate: 0.89,
			symbol: "€",
		},
	],
	[
		"GBP",
		{
			fullName: "British Pound",
			exchangeRate: 0.76,
			symbol: "£",
		},
	],
]);

////////////////////////////////////////////////////////////////////////////////

const validateLogin = function (user, pin) {
	let validLogin = false;
	let validUser = undefined;
	accounts.forEach((account) => {
		if (account.login === user && account.pin === pin) {
			validLogin = true;
			validUser = account;
		}
	});
	return [validLogin, validUser];
};

const sanitizeInput = function (string) {
	return string.trim().toLowerCase();
};

const toggleApp = function () {
	containerApp.classList.contains("hidden")
		? containerApp.classList.remove("hidden")
		: containerApp.classList.add("hidden");

	containerLogin.classList.contains("gone")
		? containerLogin.classList.remove("gone")
		: containerLogin.classList.add("gone");

	containerLogout.classList.contains("gone")
		? containerLogout.classList.remove("gone")
		: containerLogout.classList.add("gone");
};

const displayMovements = function (user) {
	containerMovements.innerHTML = "";
	user.movements.forEach((movement, index) => {
		const type = movement > 0 ? "deposit" : "withdrawal";
		const movementAfterExchange = movement * currencies.get(user.currencie).exchangeRate;
		const htmlElement = `
			<div class="movements__row">
				<div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
				<div class="movements__date">3 days ago</div>
				<div class="movements__value">${movementAfterExchange.toFixed(2)}${currencies.get(user.currencie).symbol}</div>
			</div>
		`;
		containerMovements.insertAdjacentHTML("afterbegin", htmlElement);
	});
};

const displayBalance = function (user) {
	const balance =
		user.movements.reduce((sum, movement) => sum + movement, 0) * currencies.get(user.currencie).exchangeRate;
	labelBalance.textContent = `${balance.toFixed(2)}${currencies.get(user.currencie).symbol}`;
};

const displayStats = function (user) {
	const sumIn =
		user.movements.filter((movement) => movement > 0).reduce((sum, movement) => (sum += movement), 0) *
		currencies.get(user.currencie).exchangeRate;
	const sumOut =
		user.movements.filter((movement) => movement < 0).reduce((sum, movement) => (sum += movement), 0) *
		currencies.get(user.currencie).exchangeRate;
	const sumInterest =
		user.movements.reduce((sum, movement) => (sum += movement), 0) *
		currencies.get(user.currencie).exchangeRate *
		(user.interestRate / 100);

	labelSumIn.textContent = `${sumIn.toFixed(2)}${currencies.get(user.currencie).symbol}`;
	labelSumOut.textContent = `${sumOut.toFixed(2)}${currencies.get(user.currencie).symbol}`;
	labelSumInterest.textContent = `${sumInterest.toFixed(2)}${currencies.get(user.currencie).symbol}`;
};

const displayTodayDate = function () {
	const now = new Date();
	const day = String(now.getDate()).padStart(2, "0");
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const year = now.getFullYear();
	const hours = String(now.getHours()).padStart(2, "0");
	const minutes = String(now.getMinutes()).padStart(2, "0");
	const seconds = String(now.getSeconds()).padStart(2, "0");

	labelDate.textContent = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const populateAppElements = function () {
	displayMovements(currentUser);
	displayBalance(currentUser);
	displayStats(currentUser);

	displayTodayDate();
};

btnLogin.addEventListener("click", (event) => {
	event.preventDefault();
	let flag = false;
	[flag, currentUser] = validateLogin(sanitizeInput(inputLoginUsername.value), sanitizeInput(inputLoginPin.value));

	if (flag) {
		labelWelcome.textContent = `Hello ${currentUser.owner}. Welcome back!`;
		populateAppElements();
		toggleApp();
		inputLoginUsername.value = "";
		inputLoginPin.value = "";
	} else {
		alert("Either User or PIN are incorect");
	}
});

btnLogout.addEventListener("click", (event) => {
	event.preventDefault();
	labelWelcome.textContent = `Log in to get started`;
	currentUser = undefined;
	toggleApp();
});

btnSort.addEventListener("click", () => {
	currentUser.movements.reverse();
	displayMovements(currentUser);
	btnSort.textContent === "↓ SORT" ? (btnSort.textContent = "↑ SORT") : (btnSort.textContent = "↓ SORT");
});

btnTransfer.addEventListener("click", (event) => {
	event.preventDefault();
	const amount = inputTransferAmount.value;
	const recipiant = sanitizeInput(inputTransferTo.value);
	let validRevipiant = false;

	if (!amount || !recipiant) {
		alert("Both fields have to be filled out!");
		return;
	}

	if (Number(amount) <= 0) {
		alert("Cannot transfer a non-positive amount!");
		inputTransferAmount.value = "";
		return;
	}

	accounts.forEach((account) => {
		if (account.login === recipiant) validRevipiant = true;
	});

	if (recipiant === currentUser.login) validRevipiant = false;

	if (!validRevipiant) {
		alert("Invalide recipiant!");
		inputTransferTo.value = "";
		return;
	}

	currentUser.movements.push((-1 * Number(amount)) / currencies.get(currentUser.currencie).exchangeRate);

	accounts.forEach((account) => {
		if (account.login === recipiant) {
			account.movements.push(Number(amount) / currencies.get(currentUser.currencie).exchangeRate);
		}
	});

	inputTransferAmount.value = "";
	inputTransferTo.value = "";
	populateAppElements();
});

btnLoan.addEventListener("click", (event) => {
	event.preventDefault();
	const amount = inputLoanAmount.value;

	if (!amount) {
		alert("Loan amount have to be filled out!");
		return;
	}

	if (amount <= 0) {
		alert("Cannot borrow a non-positive amount!");
		inputLoanAmount.value = "";
		return;
	}

	if (
		amount >
		currentUser.movements.reduce((sum, movement) => sum + movement, 0) *
			currencies.get(currentUser.currencie).exchangeRate *
			5
	) {
		alert("Loan amount cannot exceed 5 times the current balance!");
		inputLoanAmount.value = "";
		return;
	}

	currentUser.movements.push(Number(amount) / currencies.get(currentUser.currencie).exchangeRate);

	inputLoanAmount.value = "";
	populateAppElements();
});

btnClose.addEventListener("click", (event) => {
	event.preventDefault();
	let flag = false;
	if (
		sanitizeInput(inputCloseUsername.value) === currentUser.login &&
		sanitizeInput(inputClosePin.value) === currentUser.pin
	)
		flag = true;

	if (flag) {
		accounts.splice(accounts.indexOf(currentUser), 1);
		labelWelcome.textContent = `Log in to get started`;
		currentUser = undefined;
		toggleApp();
		inputCloseUsername.value = "";
		inputClosePin.value = "";
	} else {
		alert("Either User or PIN are incorect");
	}
});
