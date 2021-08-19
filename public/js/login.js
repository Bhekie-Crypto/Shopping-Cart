const firstName = document.querySelector("#first_name");
    const lastName = document.querySelector("#last_name");
    const loginUserEmail = document.querySelector("#login_user_email");
    const userEmail = document.querySelector("#user_email");
    const userPhone = document.querySelector("#phone_number");
    const loginPass = document.querySelector("#login_password");
    const userPassword = document.querySelector("#password");
    const submitBtn = document.querySelector(".submit")
    const loginBtn = document.querySelector("#submit")


function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add(`form__message--${type}`);
}
function setInputError(inputElement, message) {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}
function clearInputError(inputElement) {
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}
function validateRegisterInput() {
    if(firstName.value.trim() ==="") {
         onError(firstName, "User name can not be empty")
    } else {
            onSuccess(firstName)    
    }
    if(lastName.value.trim() ==="") {
        onError(lastName, "User last name can not be empty")
   } else {
           onSuccess(lastName)    
   }

    if(userEmail.value.trim() ==="") {
        onError(userEmail, "Email can not be empty")
   } else {
        if(!isValidEmail(userEmail.value.trim())) {
            onError(userEmail, "Email is not valid")
        } else {
                onSuccess(userEmail)    
        }    
   }
   if(userPhone.value.trim() ==="") {
    onError(userPhone, "Phone number can not be empty")
} else {
       onSuccess(userPhone)    
}
if(userPassword.value.trim() ==="") {
    onError(userPassword, "Password can not be empty")
} else {
       onSuccess(userPassword)    
}

}
function validateLoginInput() {
    if(loginUserEmail.value.trim() ==="") {
        onError(loginUserEmail, "Email/username can not be empty")
    } else {
           onSuccess(loginUserEmail)    
    }
    if(loginPass.value.trim() ==="") {
        onError(loginPass, "Password can not be empty")
    } else {
           onSuccess(loginPass)    
    }
}
submitBtn.addEventListener("click", e => {
    e.preventDefault();
    validateRegisterInput()
    
})

loginBtn.addEventListener("click", e => {
    e.preventDefault();
    validateLoginInput()
    
})
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");

    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
    })

    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
    })
    loginForm.addEventListener("submit", e => {
        e.preventDefault();
        



        setFormMessage(loginForm, "error", "Incorrect username/password combination");
    });

    loginBtn.onclick = function(e) {
        e.preventDefault();
                const email = loginUserEmail.value;
                const pass = loginPass.value;
                var LoggedUser = false;
    
                loginUserEmail.value = "";
                loginPass.value = "";
                
                
        fetch("/login", {
            headers: {
                "Content-type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ email: email, pass: pass})
        })
        .then(response => response.json())
        .then(data => {
            
            console.log([data])
            if(data === "undefined" || data.length === 0){
                window.location.href = '/';
            }
            window.location.href = '/home';  
            
        
        });
       
       


    };

submitBtn.onclick = function(e) {
        e.preventDefault();
                const name = firstName.value;
                const surname = lastName.value;
                const email = userEmail.value;
                const phone = userPhone.value;
                const pass = userPassword.value;
    
                firstName.value = "";
                lastName.value = "";
                userEmail.value = "";
                userPhone.value = "";
                userPassword.value = "";
                
                fetch("/register", {
                    headers: {
                        "Content-type": "application/json"
                    },
                    method: "POST",
                    body: JSON.stringify({  name: name, surname: surname, email: email, 
                        phone: phone, pass: pass})
                })
        .then(response => response.json())
        .then(data => console.log(data))
    };



    

    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("submit", e => {
            e.preventDefault();
            if(e.target.id== "signupUsername" && e.target.value.length > 0 && e.target.value.length < 4) {
                setInputError(inputElement, "Username must be at least 4 characters in length!")
            }
        });
    });
    // inputElement.addEventListener("input", e => {
    //     clearInputError(inputElement);
    // })
});

function onSuccess(input) {
    let parent = input.parentElement;
    let messageElem = parent.querySelector("small");
    messageElem.style.visibility = "hidden";
    parent.classList.remove("error");
    parent.classList.add("success");
}

function onError(input, message) {
    let parent = input.parentElement;
    let messageElem = parent.querySelector("small");
    messageElem.style.visibility = "visible";
    messageElem.innerText = message;
    parent.classList.add("error");
    parent.classList.remove("success");
}

function isValidEmail(userEmail) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(userEmail);
}