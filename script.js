'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Shakur Ademola',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// movements.sort((a, b) => {
//   if (a < b) return -1;
//   if (b < a) return 1;
// });
movements.sort((a, b) => a - b);
console.log(movements);

/////////////////////////////////////////////////

//To display the movement i.e transaction history///

const display = function (movements, sort = false) {
  const movs = sort
    ? currentAccount.movements.slice().sort((a, b) => a - b)
    : movements;
  containerMovements.innerHTML = '';
  movs.forEach(function (mov, i) {
    const transaction = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${transaction}">${
      i + 1
    } ${transaction}</div>
          <div class="movements__value">${mov}€</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

display(account1.movements);

//To Compute usernames by getting the first letters
const user = 'Salman Abdulshakur Sademola';

// const username = user
//   .toLowerCase()
//   .split(' ')
//   .map(name => {
//     return name[0];
//   })
//   .join('');
// console.log(username);

const createusernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => {
        return name[0];
      })
      .join('');
  });
};

createusernames(accounts);
console.log(accounts);

//Update the UI
const updateUI = function (acc) {
  //display balance
  displayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
  //display movements
  display(acc.movements);
};

//To display the balance///

const displayBalance = function (acct) {
  acct.balance = acct.movements.reduce(function (acc, cur) {
    return acc + cur;
  }, 0);
  labelBalance.textContent = `${acct.balance}€`;
};

//TO display the total  number of withdrwaw)(- ), deposit(+) and Interest
const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(movs => movs > 0)
    .reduce((acc, curr) => acc + curr, 0);

  const outcome = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);
  const interest = acc.movements
    .filter(movs => movs > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = `${income}€`;
  labelSumOut.textContent = `${Math.abs(outcome)}€`;
  console.log(interest);
  labelSumInterest.textContent = `${interest}€`;
};

//Implementing Login
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    //display UI
    containerApp.style.opacity = 100;
    //clear data
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //update UI
    updateUI(currentAccount);
  }
});

//Implementing the transfers
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  //transfer money
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
  }
  //Update UI
  updateUI(currentAccount);
});

//Implementing close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const user = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);

  if (currentAccount.username === user && currentAccount.pin === pin) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //Delete account
    accounts.splice(index, 1);

    //hide UI
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = '';
  }
});

//Taking Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov > amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  //update UI

  inputLoanAmount.value = '';
});

//sorting...................
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  display(currentAccount.movements, !sorted);
  sorted = !sorted;
});

///CHALLENGE
// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsKate = [4, 1, 15, 8, 3];

// const checkDogs = function (dogsJulia, dogsKate) {
//   const juliaCopy = dogsJulia.slice(1, -2);
//   const dogs = juliaCopy.concat(dogsKate);
//   dogs.forEach(function (age, i) {
//     const dogAge =
//       age < 3
//         ? `Dog number ${i + 1} is still a puppy🐶`
//         : `Dog number ${i + 1} is an adult, and is ${age} years old`;
//     console.log(dogAge);
//   });
// };

// checkDogs(dogsJulia, dogsKate);

// //CHALLANGE-2..............................................................
const calcAverageHumanAge = function (ages) {
  const dogInHumanYears = ages.map(function (dogAge) {
    if (dogAge <= 2) {
      const humanAge = 2 * dogAge;
      return humanAge;
    } else {
      const humanAge = 16 + dogAge * 4;
      return humanAge;
    }
  });
  const matureAge = dogInHumanYears.filter(function (ageDog) {
    return ageDog >= 18;
  });
  console.log(matureAge);
  const averageAge = matureAge.reduce(function (acc, curr) {
    return acc + curr / matureAge.length;
  }, 0);
  return averageAge;
};

const calcAverageHumanAge2 = ages => {
  return ages
    .map(dogAge => (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4))
    .filter(ageDog => ageDog >= 18)
    .reduce((acc, curr, i, arr) => acc + curr / arr.length, 0);
};

const data1 = [5, 2, 4, 1, 15, 8, 3];
const data2 = [16, 6, 10, 5, 6, 1, 4];
const check = calcAverageHumanAge2(data1);
const check2 = calcAverageHumanAge2(data2);

console.log(check, check2);

// // PIPELINE PRACTICE
// const dollarDeposit = function (movs) {
//   return movs
//     .filter(mov => mov > 0)
//     .map(deposit => deposit * 1.1)
//     .reduce((acc, curr) => acc + curr, 0);
// };

// console.log(dollarDeposit(movements));

//PRACTICE............................
// const EuroToUsd = 1.1;
// const saveMovement = movements.map(function (mov) {
//   return mov * EuroToUsd;
// });

// console.log(saveMovement);

// const arrowSaveMovement = movements.map(mov => mov * EuroToUsd);

// console.log(arrowSaveMovement);

// const deposited = movements.filter(function (mov) {
//   return mov > 0;
// });

// console.log(deposited);

// const withdrawal = movements.filter(mov => mov < 0);

// console.log(withdrawal);

// const balance = movements.reduce(function (acc, cur) {
//   return acc + cur;
// });

// console.log(balance);

///Final challenge in this section
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

const dogLoop = dogs.map(function (dog) {
  //added recommendedfood
  dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
  console.log(dog);

  //find sarah's dog
  // const sarahDog = dog.owners.filter(dog => {
  //   console.log(dog);
  //   return dog === 'Sarah';
  // });
});

//  const foodAmount =
//    dog.curFood > dog.recommendedFood * 0.1 ? 'Eat too much' : 'Eat little';

const sarahs = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(sarahs);
if (sarahs.curFood > sarahs.recommendedFood) {
  console.log('Sarah is eating too much');
} else if (sarahs.curFood < sarahs.recommendedFood) {
  console.log('Sarah is eating too less');
} else if (
  sarahs.curFood > sarahs.recommendedFood * 0.9 &&
  sarahs.curFood < sarahs.recommendedFood * 1.1
) {
  console.log('Sarah dog is eating okay');
}

const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .map(dog => dog.owners)
  .flat();
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

//4.
const loopowners = `${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`;
console.log(loopowners);

const loopowners2 = `${ownersEatTooLittle.join(
  ' and '
)}'s dogs eat too little!`;
console.log(loopowners2);

const dogequal = dogs.some(dog => dog.curFood === dog.recommendedFood);
console.log(dogequal);

const dogokay = dogs.some(dog => {
  if (
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
  ) {
    console.log(dog);
  }
});
console.log(dogokay);

// let copy = [];
// const shallow = dogs.map(dog => {
//   console.log(dog.recommendedFood);
//   copy.push(dog.recommendedFood);
// });

// console.log(
//   copy.sort((a, b) => {
//     if (a < b) {
//       return -1;
//     } else if (a > b) {
//       return 1;
//     }
//   })
// );

const shallow = dogs.slice().sort((a, b) => {
  if (a.recommendedFood < b.recommendedFood) {
    return -1;
  } else if (a.recommendedFood > b.recommendedFood) {
    return 1;
  }
});
console.log(shallow);
