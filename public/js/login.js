
//Function to log user in
const loginBtn = document.getElementById('loginBtn');
loginBtn.addEventListener('click', function () {
    let loginEmail = document.getElementById('loginEmail').value;
    let loginPass = document.getElementById('loginPass').value;

    console.log(loginEmail, loginPass);

    if (!loginEmail && !loginPass) {
        alert("Please enter an email address and password");
    } else {
        $.post('/login', {
                "password": loginPass,
                "email": loginEmail
            },
            function (results) {
                console.log(results);
                if (results == 'Ok') {
                    window.location.href = '../landing/'
                } else {
                    window.location.href = '../login/'
                }

            })

    }
})