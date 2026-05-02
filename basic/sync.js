// const fs = require('fs');


// fs.writeFileSync("./contact.txt", "Contact us at", "Parth +91132131131")

// const result = fs.readFileSync("./contact.txt", "utf-8");
// console.log(result);

// const fs = require('fs');

// fs.writeFileSync("./contact.txt", "Contact us at\nParth +91132131131\nJay +91999999999");

// const result = fs.readFileSync("./contact.txt", "utf-8");
// console.log(result);

const fs = require('fs');
// const os = require('os');


console.log("1");

// console.log(os.cpus().length);

fs.writeFileSync("./contact.txt", "Contact us at\n");  // creates file
fs.appendFileSync("./contact.txt", "Parth +91132131131\n");  // adds line
fs.appendFileSync("./contact.txt", "Jay +91999999999\n");   // adds another line

fs.readFile("./contact.txt", "utf-8" ,(err, result) => {
   console.log(result);

});

console.log("3");
