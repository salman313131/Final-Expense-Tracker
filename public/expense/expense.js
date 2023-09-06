const myForm  = document.getElementById('myForm')
const spendingSalarySelect = document.getElementById('spending')
const subCategoryContainer = document.getElementById('subCategoryContainer')
const categorySelect = document.getElementById('categorySelect')
const hiddenMessage = document.getElementById('hidden_message')
const tbody = document.getElementById('tabel-tbody')
const premiumMessage = document.getElementById('premiumMessage')
const premiumFeatureDisplay = document.getElementById('premiumFeatureDisplay')
const buttonList = document.getElementById('buttonList')

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

//hide downloadbutton for non-premium users
const downloadbutton = document.getElementById('downloadButton')
const previousDownload = document.getElementById('previosDownload')
downloadbutton.style.display = 'none'
previousDownload.style.display = 'none'

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

//add button
function showButton(data){
    buttonList.innerHTML = ''
    if(data.previous){
        const newBtn = document.createElement('button')
        newBtn.classList.add('pagination')
        newBtn.id = data.previous.page
        newBtn.textContent = 'previous'
        buttonList.appendChild(newBtn)
    }else{
        const newBtn = document.createElement('button')
        newBtn.classList.add('noPagination')
        newBtn.textContent = 'previous'
        buttonList.appendChild(newBtn)
    }
    if(data.next){
        const newBtn = document.createElement('button')
        newBtn.classList.add('pagination')
        newBtn.id = data.next.page
        newBtn.textContent = 'next'
        buttonList.appendChild(newBtn)
    }else{
        const newBtn = document.createElement('button')
        newBtn.classList.add('noPagination')
        newBtn.textContent = 'next'
        buttonList.appendChild(newBtn)
    }
}

//Showing Expense
async function showAll(page,limit){
    tbody.innerHTML = '';
    try {
        const token = localStorage.getItem('token')
        const headers = {
  'Content-Type': 'application/json',
  'Authorization': token 
};
        const response = await axios.get(`/api/v1/expense/?page=${page}&limit=${limit}`,{headers})
        const user = response.data.finalresult.users
        if(response.data.ispremium === true){
            buttonDisplay()
        }
        for (let i=0;i<user.length;i++){
            showOutput(user[i])
        }
        showButton(response.data.finalresult)
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
        hiddenMessage.style.display = '';
        setTimeout(()=>{
            hiddenMessage.style.display='none'
        },2000)
        showAll(1,2)
        salaryData.value=''
    } catch (error) {
        console.log(error)
    }
}

//onload
document.addEventListener('DOMContentLoaded',async (e)=>{
    e.preventDefault();
    const limit = localStorage.getItem('limit')
    if(limit){
        showAll(1,limit)

    }
    else{
        showAll(1,2)
    }
    populateCategory('spending')
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
            const limit = localStorage.getItem('limit')
            if(limit){
                showAll(1,limit)
            }
            else{

                showAll(1,2)
            }
        } catch (error) {
            console.log(error)
        }
    }
}

//premium User features
function buttonDisplay(){
    downloadbutton.style.display = ''
    previousDownload.style.display = ''
    const rzpButton1 = document.getElementById('rzp-button1')
    rzpButton1.style.display = 'none';
    premiumMessage.textContent = 'You are a Premium User!!!'
    const dailyButton = document.getElementById('dailyBtn')
    dailyButton.style.display =''
    const monthlyButton = document.getElementById('monthlyBtn')
    monthlyButton.style.display =''
    const yearlyButton = document.getElementById('yearlyBtn')
    yearlyButton.style.display =''
    const pmessage = document.getElementById('pmessage')
    pmessage.textContent = 'Click the button to see advance features(Only for premium users)'
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

//download file
downloadbutton.addEventListener('click',onDownload)
async function onDownload(e){
    e.preventDefault();
    try {
        const token1 = localStorage.getItem('token')
        const headers = {
        'Content-Type': 'application/json',
        'Authorization': token1 
        };
        const response = await axios.get('/api/v1/expense/download',{headers})
        if(response.status == 200){
            const a = document.createElement('a')
            a.href = response.data.fileUrl
            a.download = 'myexpense.csv'
            a.click()
        }
        else{
            throw new Error(response.data.message)
        }
    } catch (error) {
        console.log(error)
    }
}

//previous download
previousDownload.addEventListener('click',()=>{
    window.location.href = '../previouslink.html'
})

//button-toggle
buttonList.addEventListener('click',buttonToggle)
async function buttonToggle(e){
    e.preventDefault();
    if(e.target.classList.contains('pagination')){
        const page = parseInt(e.target.id)
        const limit = localStorage.getItem('limit')
        if(limit){

            showAll(page,limit)
        }
        else{
            showAll(page,2)
        }
    }
    if(e.target.classList.contains('noPagination')){
        const pageing = document.getElementById('noPagination-message')
        pageing.style.display = ''
        setTimeout(()=>{
            pageing.style.display = 'none';
        },2000)
    }
}

//limit selection
const limitSelect = document.getElementById('limitSelection')
limitSelect.addEventListener('change',()=>{
    const limit = parseInt(limitSelect.value)
    localStorage.setItem('limit',limit)
    tbody.innerHTML=''
    showAll(1,limit)
})

//button command
document.getElementById('dailyBtn').addEventListener('click',()=>{
    window.location.href='../daily/daily.html'
})
document.getElementById('monthlyBtn').addEventListener('click',()=>{
    window.location.href='../monthly/monthly.html'
})
document.getElementById('yearlyBtn').addEventListener('click',()=>{
    window.location.href='../yearly/yearly.html'
})