const url = "http://localhost:3000/allJobs";

async function fetchData() {
    let data = await fetch(url);
    data = await data.json();
    console.log(data);
    printData(data);
}

fetchData();

function printData(data) {
    const jobContainer = document.getElementById("job");
    //jobContainer.innerHTML += data;
    data.forEach(function (job) {
        let jobCard;
        jobCard = document.createElement("job-card")

        for (let key in job) {

            if (key=="_id" || key=="__v")
                continue;
            jobCard.innerHTML += `<h4> ${key} : ${job[key]}</h4> <br>`;
        }
        jobContainer.innerHTML+="<hr><br>"
        jobContainer.appendChild(jobCard);
    })
}