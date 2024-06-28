function Register_validate(){
    //getting data from the form
    debugger;
    var firstname = document.getElementById("firstname").value;
    var lastname = document.getElementById("lastname").value;
    var age = document.getElementById("age").value;
    var gender = document.getElementById("gender").value;
    var usn = document.getElementById("usn").value;
    var course = document.getElementById("course").value;
    var branch = document.getElementById("branch").value;
    var email = document.getElementById("email").value;
    var phoneno = document.getElementById("phoneno").value;
    var password = document.getElementById("password").value;
    var conf_pswd = document.getElementById("conf_pswd").value;

    // Check wheather all form Elements are empty or not and shows the alert
    if (firstname == '' && lastname == '' && age == '' && gender == 'Select Gender' && usn == '' && course == 'Select Course' && branch == 'Select Branch/Section' && email == '' && phoneno == '' && password == '' && conf_pswd == '') {
        alert("Please Enter the form Details");
        return false;
    }

    let age_value = parseInt(age);

    //regex check
    var regex_firstname = /^[a-zA-Z]+$/;
    var regex_lastname = /^[a-zA-Z]+$/;
    var regex_age = /^[0-9]{1,2}$/;    
    var regex_gender = /^Male|Female|Other$/;
    /*4MO18CS028*/
    var regex_usn = /^[0-9][a-zA-Z]{2}[0-9]{2}[a-zA-Z]{2}[0-9]{3}$/;
    var regex_course = /^B.E|BCA|Other$/
    var regex_branch = /^CSE|ISE|ECE|ME|CV|Other$/
    var regex_email = /^[A-Za-z0-9]+[\#\$\%\&\'\*\+\-\/\=\?\^\`\_\{\}\~\;A-Za-z0-9]+[\@].[A-za-z]+[\.].[A-Za-z]{1,2}$/;
    var regex_phoneno = /^[6-9][0-9]{9}$/;
    var regex_password = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_]{1,2})(?=.*\d{1,4}).{8,16}$/;

    // Validates First name 
    if (!regex_firstname.test(firstname)) {
        alert("Please enter valid First Name");
        return false;
    }
    
    // Validates LAst name 
    if (!regex_lastname.test(lastname)) {
        alert("Please enter valid Last Name");
        return false;
    }

    //If age is equal to zero
    if (age_value == 0) {
        alert("Age can not be zero");
        return false;
    }
    // Validation for age 
    if (!regex_age.test(age)) {
        alert("Please enter valid Age");
        return false;
    }

    // Validation for Gender selection 
    if (!regex_gender.test(gender) && gender == 'Select Gender') {
        alert("Please Select Gender");
        return false;
    }

    //Validation for USN
    if(!regex_usn.test(usn)){
        alert("Please Enter USN");
        return false;
    }

    // Validation for Course selection 
    if (!regex_course.test(course) && course == 'Select Course') {
        alert("Please Select Course");
        return false;
    }

    // Validation for Gender selection 
    if (!regex_branch.test(branch) && branch == 'Select branch') {
        alert("Please Select Branch/Section");
        return false;
    }

    // Validates Email 
    if (!regex_email.test(email)) {
        alert("Please enter valid Name");
        return false;
    }

    // Validates phone no 
    if (!regex_phoneno.test(phoneno)) {
        alert("Please enter valid Name");
        return false;
    }

    // Validates Passwoed 
    if (!regex_password.test(password)) {
        alert("Please enter valid Name");
        return false;
    }

    // Validates Confirm Password
    if (password !== conf_pswd) {
        alert("Passwords do not match");
        return false;
    }

    // It will Check all the form details are filled or not 
    if (firstname != '' && lastname != '' && age != '' && gender != 'Select Gender' && usn != '' && course != 'Select Course' && branch != 'Select Branch/Section'  && email != '' && phoneno != ''  && password != '' && conf_pswd != '') {
        alert("Form Submitted Succesfully");
        document.getElementById("myForm").reset();
        return true;
    }

    else{
        alert("Enter form details");
        return false;
    }
}