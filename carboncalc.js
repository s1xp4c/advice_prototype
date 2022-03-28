const adviceAPIkey = 'AIzaSyA3T3lU6NyXFlEjJMt739iXmn-GBT_B7qk'
const inputForm = document.getElementById("siteinput");

inputForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let URLvalue = inputForm.elements.urlname.value;
    calcMyCarbon(URLvalue);
})

function calcMyCarbon(URLvalue) {
    fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${URLvalue}&key=${adviceAPIkey}`, {
            "method": "GET",
            "headers": {}
        })
        .then(data => data.json())
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.error(err);
        });

}