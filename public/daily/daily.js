var ctx = document.getElementById('myChart').getContext('2d');
var ctg = document.getElementById('myGraph').getContext('2d');
const token = localStorage.getItem('token')
const spending = document.getElementById('tabel-tbody-spending')
const salary = document.getElementById('tabel-tbody-salary')
const total = document.getElementById('tabel-tbody-total')

const colors = [
    'rgba(255, 99, 132, 0.2)', 
    'rgba(54, 162, 235, 0.2)', 
    'rgba(255, 206, 86, 0.2)', 
    'rgba(75, 192, 192, 0.2)', 
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 165, 0, 0.2)',
    'rgba(0, 128, 128, 0.2)',
    'rgba(255, 105, 180, 0.2)'
];

function domGraph(label,value){
  console.log(label,value)
   const data = {
    labels: label,
    datasets: [{
      label: 'Savings/Spending',
      data: value,
      backgroundColor: colors, // Bar fill color
      borderColor: 'rgba(75, 192, 192, 1)', // Bar border color
      borderWidth: 1 // Bar border width
    }]
  };
  
  const myChart = new Chart(ctg, {
    type: 'pie',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function domDisplay(label,value){
   const data = {
    labels: label,
    datasets: [{
      label: 'Spending data',
      data: value,
      backgroundColor: colors, // Bar fill color
      borderColor: 'rgba(75, 192, 192, 1)', // Bar border color
      borderWidth: 1 // Bar border width
    }]
  };
  
  const myChart = new Chart(ctx, {
    type: 'pie',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function displayGraph(data,totalData){
  const categoryOverall = ['spendings','income']
  const spendingData = {'food':0,'entertainment':0,'study':0,'hobbies':0,'travel':0,'others':0}
  for(let i=0;i<data.length;i++){
    spendingData[data[i].category]+=data[i].spending
  }
  domDisplay(Object.keys(spendingData),Object.values(spendingData))
  domGraph(categoryOverall,[totalData.data.spending,totalData.data.salary])
}
  
document.addEventListener('DOMContentLoaded',async ()=>{
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token
        };
    const responseData = await axios.get('/api/v1/expense/all',{headers})
    const data = responseData.data
    data.sort((a,b)=> new Date(`${a.date}-${a.month}-${a.year}`)-new Date(`${b.date}-${b.month}-${b.year}`))
    const spendingData = data.filter(item=>item.salary == 0)
    const salaryData = data.filter(item=>item.spending == 0)
    spendingDisplay(spendingData)
    salaryDisplay(salaryData)
    const totalResponse = await axios.get('/api/v1/premium',{headers})
    totalDisplay(totalResponse.data)
    displayGraph(data,totalResponse)
})

//add to spending
function spendingDisplay(data){
  data.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${user.date}-${user.month}-${user.year}</td>
        <td>${user.category}</td>
        <td>${user.spending}</td>
      `;
    spending.appendChild(row);
  });
}

//add to salary
function salaryDisplay(data){
  data.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${user.date}-${user.month}-${user.year}</td>
        <td>${user.category}</td>
        <td>${user.salary}</td>
      `;
    salary.appendChild(row);
  });
}

//totalDisplay
function totalDisplay(data){
    const row = document.createElement('tr');
    const total1 = Number(data.salary)-Number(data.spending)
    row.innerHTML = `
        <td>${data.salary}</td>
        <td>${data.spending}</td>
        <td>${total1}</td>
      `;
    total.appendChild(row);
}