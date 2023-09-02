const form = document.getElementById('signup-form')
const userName = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const errorMessage = document.getElementById('error-message');

form.addEventListener('submit', async function(event) {
        event.preventDefault();
        if (!userName.value || !email.value || !password.value) {
            errorMessage.textContent = 'Please fill in all fields.';
            setTimeout(()=>{
                errorMessage.textContent = '';
            },3000)
        }
        else{

            try {
                const data={
                    name:userName.value,
                    email:email.value,
                    password:password.value
                }
                const response = await axios.post('/api/v1/signup',data)
                if(response.data.message){
                  errorMessage.style.color = 'red'
                  errorMessage.textContent = response.data.message
                  setTimeout(()=>{
                    errorMessage.textContent = '';
                },3000) 
                }
                else{
                    window.location.href = '../login/login.html'
                }  
            } catch (error) {
                console.log(error)
            }
        }
});