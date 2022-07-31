const fs = require("fs");
const http = require("http");
const url = require("url");
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `this is what we know about the avocado ${textIn}.\m created on ${Date.now()}`;

// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("file has been Written");
// console.log(fs.readFileSync("./txt/output.txt", "utf-8"));

// /////// asynchronous
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       fs.writeFile("./txt/final.txt", `${data2}\n ${data3}`, "utf-8", (err) =>
//         fs.readFile("./txt/final.txt", "utf-8", (err, data4) =>
//           console.log(data4)
//         )
//       );
//     });
//   });
// });
// console.log();
////// creating our first web server
const replaceTemplate = (template, product) => {
  let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGES%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%PRODUCTQUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%COUNTRY%}/g, product.from);
  output = output.replace(/{%id%}/g, product.id);
  if (!product.organic)
    output = output.replace(/{%NOTORGANIC%}/g, "not-organic");

  return output;
};
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
const server = http.createServer((req, res) => {
  const pathData = url.parse(req.url, true);
  const { pathname, query } = pathData;
  /////overview Page
  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, {
      "content-type": "text/html",
      myOwnHeader: "hello world",
    });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCTSCARDS}", cardsHtml);
    res.end(output);

    ///products page
  } else if (pathname === "/product") {
    const product = dataObj[query.id];
    res.writeHead(200, {
      "content-type": "text/html",
      myOwnHeader: "hello world",
    });
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    //// api
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "content-type": "application/json",
    });
    res.end(data);
    ////error page
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
      myOwnHeader: "hello world",
    });
    res.end("<h1>page not found</h1>");
  }
});
server.listen(8000, "127.0.0.1", () => {
  console.log("listening to request on port 8000");
});
