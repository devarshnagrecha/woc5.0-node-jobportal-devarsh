async function sendData() {
    var user, pass;
    var myForm = document.getElementById("companyLogin");
    var formData = new FormData(myForm);

    user = formData.get("email");
    pass = formData.get("password");

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("email", user);
    urlencoded.append("password", pass);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    await fetch("http://localhost:3000/companyLogin", requestOptions)
}