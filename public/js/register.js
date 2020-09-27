// Function to sign user up
const signupBtn = document.getElementById('registerBtn');
signupBtn.addEventListener('click', function () {
            //e.preventDefault();

    let signUpEmail = document.getElementById('registerEmail').value;
    let signUpPass = document.getElementById('registerPass').value;

    console.log(signUpEmail, signUpPass);

    if (!signUpEmail && !signUpPass) {
        alert("Please enter an email address and password");
    } else {
        $.post('/register', {
                'password': signUpPass,
                'email': signUpEmail

            },
            function (results) {
                console.log(results);
                if (results == 'Ok') {
                    window.location.href = '../login/'
                } else {
                    alert(results);
                }
            })
    }
})