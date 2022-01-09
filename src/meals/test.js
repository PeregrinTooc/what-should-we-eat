const csv = require('csvtojson')
let jsonArray
const promise = csv()
    .fromString('mealName\nSpaghetti mit Spinatesauce')
    .then((jsonObj) => {
        jsonArray = jsonObj;
    })

// Async / await usage
// const jsonArray = await csv().fromFile(csvFilePath);
console.log(promise)