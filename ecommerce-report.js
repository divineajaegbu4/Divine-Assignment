const transactions = [
  { id: 'tr_1', customerId: 'c_1', items: [{ productId: 'p_1', price: 50, quantity: 2 }, { productId: 'p_2', price: 25, quantity: 1 }], status: 'completed' },

  { id: 'tr_2', customerId: 'c_2', items: [{ productId: 'p_3', price: 120, quantity: 1 }], status: 'completed' },

  { id: 'tr_3', customerId: 'c_1', items: [{ productId: 'p_2', price: 25, quantity: 3 }], status: 'pending' },

  { id: 'tr_4', customerId: 'c_3', items: [{ productId: 'p_4', price: 80, quantity: 1 }], status: 'completed' },

  { id: 'tr_5', customerId: 'c_1', items: [{ productId: 'p_1', price: 50, quantity: 1 }], status: 'completed' },
];


// console.log(transactions[0].items[0].price * transactions[0].items[0].quantity);


const report = transactions
.filter(transaction => transaction.status === "completed")
.map(transaction => transaction.items)


// .reduce((acc, value) => {
//     let price = value.price
//     console.log(price)

//     acc *= price

//     return acc
// }, 1)
// .filter(item => item.price && item.quantity)
// .reduce((acc, currentValue) => {
  
// }, { totalRevenue: 0, customers: {} })

// const itemsValue = report.filter((item, index) => item.items.price)

// console.log("items", itemsValue)

console.log(report)




