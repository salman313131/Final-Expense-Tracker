const year = document.getElementById('year')
const month = document.getElementById('month')
const button = document.getElementById('monthly')
const token  = localStorage.getItem('token')
const spending = document.getElementById('tabel-tbody-salary')

//options filling
function fillVoid(){
    for(let i=1990;i<2031;i++){
        const option = document.createElement('option')
        option.textContent = i
        year.appendChild(option)
    }
}

document.addEventListener('DOMContentLoaded',()=>{
    fillVoid()
})

button.addEventListener('click',async ()=>{
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token
        };
    const response = await axios.get(`/api/v1/monthly/?year=${year.value}&month=${month.value}`,{headers})
    spendingDisplay(response.data)
})

function spendingDisplay(data){
    let totalSalary=0
    let totalSpending=0 
  data.forEach(user => {
    totalSalary+=parseInt(user.salary)
    totalSpending+=parseInt(user.spending)
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${user.date}-${user.month}-${user.year}</td>
        <td>${user.category}</td>
        <td>${user.salary}</td>
        <td>${user.spending}</td>
      `;
    spending.appendChild(row);
  });
  const row = document.createElement('tr');
    row.innerHTML = `
        <td> </td>
        <td><h3>Total</h3></td>
        <td>${totalSalary}</td>
        <td>${totalSpending}</td>
      `;
    spending.appendChild(row);
}