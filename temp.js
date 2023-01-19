const url = "http://localhost:3000/allJobs";

async function fetchData(){
    let data = await fetch(url);
    data = await data.json();
    console.log(data);
}

fetchData();