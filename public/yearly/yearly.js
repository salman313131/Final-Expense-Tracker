const year = document.getElementById('year')
const button = document.getElementById('yearly')
const token  = localStorage.getItem('token')
const spending = document.getElementById('tabel-tbody-salary')
var ctx = document.getElementById('myChart').getContext('2d');

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
    const response = await axios.get(`/api/v1/yearly/?year=${year.value}`,{headers})
    spendingDisplay(response.data)
})
function spendingDisplay(data){
    let chartSalaryData = {'1':0,'2':0,'3':0,'4':0,'5':0,'6':0,'7':0,'8':0,'9':0,'10':0,'11':0,'12':0}
    let chartSpendingData = {'1':0,'2':0,'3':0,'4':0,'5':0,'6':0,'7':0,'8':0,'9':0,'10':0,'11':0,'12':0}
    let totalSalary=0
    let totalSpending=0 
  data.forEach(user => {
    chartSalaryData[user.month]+=parseInt(user.salary)
    chartSpendingData[user.month]+=parseInt(user.spending)
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
    displayChart(chartSalaryData,chartSpendingData)
}

function displayChart(salary,spending){
    const labels =['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']
    const salaryData = Object.values(salary)
    const spendingData = Object.values(spending)
    const comparisonChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [
            {
                label: 'Salary Data',
                data: salaryData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Spending Data',
                data: spendingData,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
}