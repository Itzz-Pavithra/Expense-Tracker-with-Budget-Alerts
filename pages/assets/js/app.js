document.getElementById('expense-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const amount = document.getElementById('amount').value;

    await fetch('http://localhost:5000/expenses/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, amount, category: "General", date: new Date() })
    });

    alert('Expense added!');
    fetchExpenses();
});

async function fetchExpenses() {
    const response = await fetch('http://localhost:5000/expenses/all');
    const expenses = await response.json();

    const list = document.getElementById('expenses-list');
    list.innerHTML = expenses.map(exp => `<p>${exp.title}: $${exp.amount}</p>`).join('');
}

fetchExpenses();
