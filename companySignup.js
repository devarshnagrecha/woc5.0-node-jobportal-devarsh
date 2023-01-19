
async function sendData() {
    alert("node mc");
    var name, email, password, website, description;
    var myForm = document.getElementById("companySignup");
    var formData = new FormData(myForm);

    name = formData.get("name");
    email = formData.get("email");
    password = formData.get("password");
    website = formData.get("website");
    description = formData.get("description");

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("email", email);
    urlencoded.append("password", password);
    urlencoded.append("name", name);
    urlencoded.append("website", website);
    urlencoded.append("description", description);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/companySignup", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}