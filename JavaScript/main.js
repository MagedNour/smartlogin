
var nameInput = document.querySelector("#nameInput");
var emailInput = document.querySelector("#emailInput")
var passwordInput = document.querySelector("#passwordInput")
var loginbtn = document.querySelector("#loginbtn")
var signupbtn = document.querySelector("#signupbtn")

var loginEmailInput = document.querySelector("#loginEmailInput");
var loginPasswordInput = document.querySelector("#loginPasswordInput")
var incorrect = document.querySelector("#incorrect")
var signupFailed = document.querySelector("#signupFailed")

var cardViewer = document.querySelector("#cardViewer");

var loginSuccess = false;

var usersArray = JSON.parse(localStorage.getItem("users")) ?? [];

//signUp
signupbtn?.addEventListener("click", function () {
    var emailExist = false;
    if (nameInput.value == "" || emailInput.value == "" || passwordInput.value == "") {
        signupFailed.html = "All inputs is required"
        signupFailed.classList.remove("d-none")
    } else {
        var user = {
            name: nameInput.value,
            email: emailInput.value,
            password: passwordInput.value
        }

        //check if Email already exists
        for (let i = 0; i < usersArray.length; i++) {
            if (user.email == usersArray[i].email) {
                emailExist = true;
            }
        }


        if (emailExist) {
            signupFailed.innerHTML = "Email already Exists"
            signupFailed.classList.remove("d-none")
            emailExist = false;
        } else {

            if (validateEmail()) {
                usersArray.push(user);
                localStorage.setItem("users", JSON.stringify(usersArray));
                window.location.href = 'index.html';
            }

        }
    }

})




//Login
loginbtn?.addEventListener("click", function () {
    if (loginEmailInput.value == "" || loginPasswordInput.value == "") {
        incorrect.innerHTML = "All Inputs Required"
        incorrect.classList.remove("d-none")

    } else {
        var user = {
            email: loginEmailInput.value,
            password: loginPasswordInput.value
        }
        var found = false;

        for (let i = 0; i < usersArray.length; i++) {
            if (user.email == usersArray[i].email && user.password == usersArray[i].password) {
                localStorage.setItem("loggedInUser", JSON.stringify(usersArray[i])); // Store the logged-in user
                window.location.href = 'home.html'
                found = true
            }

        }
        if (!found) {
            incorrect.innerHTML = "Email or Password are Incorrect"
            incorrect.classList.remove("d-none")
        }
    }

})


//Validate Email Input
emailInput?.addEventListener("blur", validateEmail)

function validateEmail() {
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailInput.value)) {
        emailInput.classList.add("is-valid")
        emailInput.classList.remove("is-invalid")
        return true;
    } else {
        emailInput.classList.add("is-invalid")
        emailInput.classList.remove("is-valid")
        return false

    }
}


// Function to display user's name on home page
function displayWelcomeMessage() {
    var welcomeHeading = document.querySelector("#welcome");
    var loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (loggedInUser && loggedInUser.name) {
        welcomeHeading.innerHTML = `Welcome ${loggedInUser.name}`;
    } else {
        welcomeHeading.innerHTML = "Welcome, Guest";
    }
}

// Check which page is loaded
document.addEventListener("DOMContentLoaded", function () {
    var path = window.location.pathname;

    if (path === '/home.html') {
        displayWelcomeMessage();
        getData()
        console.log("success");
    }
});


function getData() {

    var data = []
    var httpsReq = new XMLHttpRequest();

    httpsReq.open("get", "http://forkify-api.herokuapp.com/api/search?q=pizza")
    httpsReq.send();

    httpsReq.addEventListener("readystatechange", function () {
        console.log(httpsReq.readyState);
        if (httpsReq.readyState == 4) {
            data = JSON.parse(httpsReq.response).recipes
            displayData(data)
        }
    })




}

function displayData(dataArray) {
    var allCards = ""
    for (let i = 0; i < dataArray.length; i++) {
        allCards += ` 
        <div class="col-sm-12 col-md-4">
        <div class="card">
            <div class="card-img overflow-hidden img-thumbnail">
                <img src= ${dataArray[i].image_url}
                    class="card-img-top" alt="work-1">
            </div>
            <div class="card-body d-flex flex-column justify-content-between align-items-center">

                <h4 class="card-title text-black">${dataArray[i].title}</h4>
                <div class="d-flex justify-content-between w-75">
                    <p class="">
                        <span class="fw-bold text-black"> Publisher: </span>

                        <a id="publisher" target="_blank" class="text-decoration-none text-secondary"
                            href="${dataArray[i].publisher_url}">${dataArray[i].publisher}</a>
                    </p>
                    <a href="${dataArray[i].source_url}"  target="_blank">
                        <i class="fa-brands fa-sourcetree text-info"></i>
                    </a>
                </div>



            </div>
        </div>

    </div>`
    }

    cardViewer.innerHTML = allCards;
    console.log(dataArray);
}
