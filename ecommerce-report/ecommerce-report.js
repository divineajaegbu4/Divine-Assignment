const transactions = [
  { id: 'tr_1', customerId: 'c_1', items: [{ productId: 'p_1', price: 50, quantity: 2 }, { productId: 'p_2', price: 25, quantity: 1 }], status: 'completed' },
  { id: 'tr_2', customerId: 'c_2', items: [{ productId: 'p_3', price: 120, quantity: 1 }], status: 'completed' },
  { id: 'tr_3', customerId: 'c_1', items: [{ productId: 'p_2', price: 25, quantity: 3 }], status: 'pending' },
  { id: 'tr_4', customerId: 'c_3', items: [{ productId: 'p_4', price: 80, quantity: 1 }], status: 'completed' },
  { id: 'tr_5', customerId: 'c_1', items: [{ productId: 'p_1', price: 50, quantity: 1 }], status: 'completed' },
];




const report = transactions
.filter(transaction => transaction.status === "completed")
.reduce((summary, transaction) => {
 const totalPrice = transaction.items.reduce((total, product) => {

 return total + (product.price * product.quantity)
}, 0)




if (summary.customers[transaction.customerId]) {
  summary.customers[transaction.customerId] += totalPrice;
} else {
  summary.customers[transaction.customerId] = totalPrice;
}

summary.totalRevenue += totalPrice;

return summary;
 

}, {totalRevenue: 0, customers: {}})


console.log(report)