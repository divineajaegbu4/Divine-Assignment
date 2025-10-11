const transactions = [
    { id: 't1', type: 'debit', status: 'success', amount: 150 },
    { id: 't2', type: 'credit', status: 'success', amount: 200 },
    { id: 't3', type: 'debit', status: 'failed', amount: 100 },
    { id: 't4', type: 'debit', status: 'success', amount: 35 },
    { id: 't5', type: 'debit', status: 'success', amount: 120 },
];


const finalReport = transactions
.filter(transaction => transaction.type === "debit" )