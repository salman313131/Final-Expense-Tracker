const loginForm = document.getElementById('logIn-form')
const email = document.getElementById('emailLogin')
const password = document.getElementById('passwordLogin')
const errorLoginMessage = document.getElementById('errorLogin-message')
const forgotPasswordForm = document.getElementById('forgotPasswordForm')
const loginButton = document.getElementById('loginButton')

loginForm.addEventListener('submit', async function(event){
    event.preventDefault()
    try {
      const response = await axios.get(`/api/v1/?email=${email.value}&password=${password.value}`)
      if(!response.data.message){
        localStorage.setItem('token',response.data.token)
        window.location.href = '../expense/expense.html'
      }
    } catch (error) {
        if (error.response){
            if (error.response.status == 400){
                errorLoginMessage.style.color = 'red'
                errorLoginMessage.textContent = error.response.data.message
            setTimeout(()=>{
                errorLoginMessage.textContent = '';
                errorLoginMessage.style.color = 'red'
            },3000)
                }
            else {
               errorLoginMessage.style.color = 'red'
                errorLoginMessage.textContent = error.response.data.message
                setTimeout(()=>{
                errorLoginMessage.textContent = '';
                errorLoginMessage.style.color = 'red'
        },3000) 
            }
        }
        else{
            console.log(error)
        }
    }
})

//start
document.addEventListener('DOMContentLoaded',()=>{
    forgotPasswordForm.style.display = 'none'
    loginButton.style.display = 'none'
})

//Forgot password
forgotPasswordForm.addEventListener('submit',resetOldPassword)
const passwordButton = document.getElementById('forgotPassword')
passwordButton.addEventListener('click',resetPassword)
const forgotEmail = document.getElementById('forgotEmail')
const forgotPasswordMessage = document.getElementById('forgotPasswordMessage')

//forgot form
function resetPassword(e){
    e.preventDefault();
    loginForm.style.display = 'none'
    forgotPasswordForm.style.display = ''
    passwordButton.style.display = 'none'
    loginButton.style.display = ''
}

//loginbutton
loginButton.addEventListener('click',()=>{
    forgotPasswordForm.style.display = 'none'
    loginForm.style.display = ''
    loginButton.style.display = 'none'
    passwordButton.style.display = ''
})

//resetold
async function resetOldPassword(e){
    e.preventDefault();
    try {
        await axios.post('/password/forgotpassword',{email:forgotEmail.value})
        forgotPasswordMessage.textContent = 'Email has been sent to you, Please check!!!'
    } catch (error) {
        console.log(error)
    }
}