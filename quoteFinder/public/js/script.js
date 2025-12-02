//alert("Script file successfully accessed!");
//Event Listeners
let authorLinks = document.querySelectorAll("a");
for (authorLink of authorLinks) {
    authorLink.addEventListener("click", getAuthorInfo);
}


async function getAuthorInfo() {
    var myModal = new bootstrap.Modal(document.getElementById('authorModal'));
    myModal.show();
    let url = `/api/author/${this.id}`;
    let response = await fetch(url);
    let data = await response.json();
    //console.log(data);
    let authorInfo = document.querySelector("#authorInfo");
    authorInfo.innerHTML = `<h1> ${data[0].firstName}
                                 ${data[0].lastName} </h1>`;
    authorInfo.innerHTML += `<img src="${data[0].portrait}" width="200"><br>`;
    authorInfo.innerHTML += `<div>
                                <strong>Date of Birth:</strong> ${data[0].dob}<br>
                                <strong>Date of Death:</strong> ${data[0].dod}<br>
                                <strong>Sex:</strong> ${data[0].sex}<br>
                                <strong>Profession:</strong> ${data[0].profession}<br>
                                <strong>Country:</strong> ${data[0].country}<br>
                                <strong>Biography:</strong> ${data[0].biography}<br>
                            </div>`;
}