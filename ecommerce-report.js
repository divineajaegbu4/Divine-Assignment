const transactions = [
  { id: 'tr_1', customerId: 'c_1', items: [{ productId: 'p_1', price: 50, quantity: 2 }, { productId: 'p_2', price: 25, quantity: 1 }], status: 'completed' },
  { id: 'tr_2', customerId: 'c_2', items: [{ productId: 'p_3', price: 120, quantity: 1 }], status: 'completed' },
  { id: 'tr_3', customerId: 'c_1', items: [{ productId: 'p_2', price: 25, quantity: 3 }], status: 'pending' },
  { id: 'tr_4', customerId: 'c_3', items: [{ productId: 'p_4', price: 80, quantity: 1 }], status: 'completed' },
  { id: 'tr_5', customerId: 'c_1', items: [{ productId: 'p_1', price: 50, quantity: 1 }], status: 'completed' },
];


// The your solution should be returned in this very format:

// {
//     totalRevenue: 350,
//     customers: {
//         c_1: 150,
//         c_2: 120,
//         c_3: 80
//     }
// }