const url = "http://localhost:3000/companyHome";

async function fetchData() {
    let data = await fetch(url);
    data = await data.json();
    console.log(data);
    if (data.length === 0) {
        alert("Incorrect username/password");
        window.location.href = "file:///D:/WOC%205.0/Node.JS/job-portal/companyLogin.html"
    }

    else{
        printData(data);
    }
}

fetchData();

function printData(data) {
    const jobContainer = document.getElementById("company");
    //jobContainer.innerHTML += data;
    data.forEach(function (job) {
        let jobCard;
        jobCard = document.createElement("job-card")

        for (let key in job) {

            if (key=="_id" || key=="__v")
                continue;
            jobCard.innerHTML += `<h4> ${key} : ${job[key]}</h4> <br>`;
        }
        jobContainer.innerHTML+="<hr><br>";
        jobContainer.appendChild(jobCard);
    })
}