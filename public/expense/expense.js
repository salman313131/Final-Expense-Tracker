const myForm  = document.getElementById('myForm')
const spendingSalarySelect = document.getElementById('spending')
const subCategoryContainer = document.getElementById('subCategoryContainer')
const categorySelect = document.getElementById('categorySelect')
const hiddenMessage = document.getElementById('hidden_message')
const tbody = document.getElementById('tabel-tbody')
const premiumMessage = document.getElementById('premiumMessage')
const premiumFeatureDisplay = document.getElementById('premiumFeatureDisplay')

function populateCategory(selectSalary){
    categorySelect.innerHTML = ''
    const categories = (selectSalary === 'salary')?['daily','hourly','weekly','monthly']:['food','entertainment','study','hobbies','travel','others']
    for(const category of categories){
        const option = document.createElement('option')
        option.value = category
        option.textContent = category
        categorySelect.appendChild(option)
    }
}

//Populating category
spendingSalarySelect.addEventListener('change', ()=>{
    const spendingSalary = spendingSalarySelect.value;
    populateCategory(spendingSalary)
})

//Displaying data
function showOutput(user){
    const row = document.createElement('tr');
    const delBtn = document.createElement('button')
    const td = document.createElement('td')
    const total = Number(user.salary)-Number(user.spending)
    delBtn.textContent = 'delete'
    delBtn.classList.add('delete')
    delBtn.dataset.id = user.id
    td.appendChild(delBtn)
    row.innerHTML = `
        <td>${user.date}-${user.month}-${user.year}</td>
        <td>${user.category}</td>
        <td>${user.salary}</td>
        <td>${user.spending}</td>
        <td>${total}</td>
      `;
    row.appendChild(td)
    tbody.appendChild(row);
}

//Showing Expense
async function showAll(){
    try {
        const token = localStorage.getItem('token')
        const headers = {
  'Content-Type': 'application/json',
  'Authorization': token 
};
        const response = await axios.get('/api/v1/expense',{headers})
        const user = response.data.users
        if(response.data.ispremium === true){
            buttonDisplay()
        }
        for (i=0;i<user.length;i++){
            showOutput(user[i])
        }
    } catch (error) {
        console.log(error)
    }
}

//Adding Expense
myForm.addEventListener('submit',onSubmit)
async function onSubmit(e){
    e.preventDefault();
    const dateData = document.getElementById('datePicker')
    const salaryData = document.getElementById('salSpe')
    let salary = salaryData.value
    let spending = salaryData.value
    if(spendingSalarySelect.value === 'salary'){
        spending = 0
    }
    else{
        salary = 0
    }
    try {
        const selectedDate = new Date(dateData.value);
        const dayOfWeek = selectedDate.getDay();
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const sendData = {
            day: daysOfWeek[dayOfWeek],
            date: selectedDate.getDate(),
            month: selectedDate.getMonth() + 1, 
            year: selectedDate.getFullYear(),
            salary: salary,
            spending: spending,
            category: categorySelect.value
        };
        const token = localStorage.getItem('token')
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token 
        };
        await axios.post('/api/v1/expense/add',sendData,{headers})
        showAll()
        salaryData.value=''
    } catch (error) {
        console.log(error)
    }
}

//onload
document.addEventListener('DOMContentLoaded',async (e)=>{
    e.preventDefault();
    showAll()
})

//delete
tbody.addEventListener('click',onDelete)
async function onDelete(e){
    if(e.target.classList.contains('delete')){
        try {
            const id = e.target.dataset.id
            const token = localStorage.getItem('token')
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': token,

            };
            await axios.delete(`/api/v1/expense/${id}`,{headers})
            tbody.innerHTML=''
            showAll()
        } catch (error) {
            console.log(error)
        }
    }
}

//premium User features
function buttonDisplay(){
    const rzpButton1 = document.getElementById('rzp-button1')
    rzpButton1.style.display = 'none';
    premiumMessage.textContent = 'You are a Premium User!!!'
    const dailyButton = document.createElement('button')
    dailyButton.textContent = 'Daily'
    const monthlyButton = document.createElement('button')
    monthlyButton.textContent = 'Monthly'
    const yearlyButton = document.createElement('button')
    yearlyButton.textContent = 'Yearly'
    const pmessage = document.createElement('p')
    pmessage.textContent = 'Click the button to see advance features(Only for premium users)'
    premiumFeatureDisplay.innerHTML=''
    premiumFeatureDisplay.appendChild(pmessage)
    premiumFeatureDisplay.appendChild(dailyButton)
    premiumFeatureDisplay.appendChild(monthlyButton)
    premiumFeatureDisplay.appendChild(yearlyButton)
}

//premium User
document.getElementById('rzp-button1').onclick = async function(e){
    const token1 = localStorage.getItem('token')
    try {
         const headers = {
  'Content-Type': 'application/json',
  'Authorization': token1 
};
        const rzpResponse = await axios.get('/purchase/premium',{headers})
   
    var options={
        "key":rzpResponse.data.key_id,
        "order_id":rzpResponse.data.order.id,
        "handler": async function(rzpResponse){
            await axios.post('/purchase/update',{
                order_id : options.order_id,
                payment_id : rzpResponse.razorpay_payment_id
            },{headers:{"Authorization":token1}})
        
            alert('you are a premium user now!!!')
            buttonDisplay()
        }
    }
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault()
    rzp1.on('payment.failed', function(rzpResponse){
        console.log(rzpResponse)
        alert('Something went wrong!!!')
    })
    } catch (error) {
        console.log(error)
    }
}