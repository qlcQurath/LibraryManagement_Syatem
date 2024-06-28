function login_validate(){
    debugger;
    var email = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (email == '' || password == '') {
        alert("Please enter form details");
        return false;
    }

    //regex
    regex_email = /^[A-Za-z0-9]+[\#\$\%\&\'\*\+\-\/\=\?\^\`\_\{\}\~\;A-Za-z0-9]+[\@].[A-za-z]+[\.].[A-Za-z]{1,2}$/;
    regex_pswd = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_]{1,2})(?=.*\d{1,4}).{8,16}$/;


    //validation
    if (!regex_email.test(email)) {
        alert("Please enter valid email");
        return false;
    }

    if (!regex_pswd.test(password)) {
        alert("Please enter valid password");
        return false;
    }

    if(email == "admin@gmail.com" && password == "Admin@123"){
        alert("Login Succesfully");
        //redirect to the admin page
        window.location.href = "admin";
        //revent from submission
        return false;
    }
    else if(email != '' && password != ''){
        alert("Login succesfully");
        window.location.href = "studentboard";
        return false;
    }
    else{
        alert("Please enter valid details");
        return false;
    }

}