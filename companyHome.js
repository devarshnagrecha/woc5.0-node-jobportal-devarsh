async function myFunc() {
    const url = "http://localhost:3000";
    let res = await fetch(url);

    let resJson = await res.json();

    console.log(resJson.name);
}

myFunc();