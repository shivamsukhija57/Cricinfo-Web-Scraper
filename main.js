const request = require('request');
const cheerio = require('cheerio');
const match =require('./matches');
const fs =require("fs");
const path = require('path')
const iplPath = path.join(__dirname,"IPL");
createDirectory(iplPath);
const url ='https://www.espncricinfo.com/series/ipl-2020-21-1210595';
//const ipl =fs.mkdir();
request(url,cb);
function cb(error, response, html){
    
    //console.log(error.code);
    console.log(response && response.statusCode);
    
    extractLink(html);
}
function extractLink(html){
    const $= cheerio.load(html);
   const aelement= $("a[data-hover='View All Results']");
   console.log(aelement.attr("href"));
   let link ="https://www.espncricinfo.com"+aelement.attr("href");
   match.getAllMatchLinks(link);
   //console.log(link);
}
function createDirectory(filePath){
    if(fs.existsSync(filePath)== false){
        fs.mkdirSync(filePath);
    }
}

