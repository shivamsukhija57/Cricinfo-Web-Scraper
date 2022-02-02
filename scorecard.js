//const url="https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
const request=require('request');
const cheerio=require('cheerio');
const fs =require("fs");
const path = require('path');
const xlsx = require("xlsx");
function runScorecard(url){
    request(url,cb);
}
function cb(error,response,html){
    if(error){

    }else{
        extractAllDetails(html);
    }
}
 const extractAllDetails =html =>{

     const $=cheerio.load(html);
     //venue and date;
     let eventd =$('.header-info .description');
     let arrvenue= eventd.text().split(",");
     let venue =arrvenue[1].trim();
     let date=arrvenue[2].trim();
     //result
     let res =$('.event .status-text');
     let result=res.text();
     console.log(date,result);
     let innings=$('.card.content-block.match-scorecard-table .Collapsible');
     for(let i=0;i<innings.length ;i++){
         let teamName=$(innings[i]).find("h5").text();
         teamName = teamName.split("INNINGS")[0].trim();
         let opponentIndex = i == 0 ? 1 : 0;
        let opponentName = $(innings[opponentIndex]).find("h5").text();
        opponentName = opponentName.split("INNINGS")[0].trim();
        let cInning = $(innings[i]);
        console.log(`${venue}| ${date} |${teamName}| ${opponentName} |${result}`);
        let allRows = cInning.find(".table.batsman tbody tr");
        for (let j = 0; j < allRows.length; j++) {
            let allCols = $(allRows[j]).find("td");
            let isWorthy = $(allCols[0]).hasClass("batsman-cell");
            if (isWorthy == true) {
                // console.log(allCols.text());
                //       Player  runs balls fours sixes sr 
                let playerName = $(allCols[0]).text().trim();
                let runs = $(allCols[2]).text().trim();
                let balls = $(allCols[3]).text().trim();
                let fours = $(allCols[5]).text().trim();
                let sixes = $(allCols[6]).text().trim();
                let sr = $(allCols[7]).text().trim();
                // console.log(`${playerName} ${runs} ${balls} ${fours} ${sixes} ${sr}`);
                processPlayerdetails(playerName,runs,balls,fours,sixes,sr,venue,date,result,teamName,opponentName);
            }
        }
     }

 }
 function processPlayerdetails(playerName,runs,balls,fours,sixes,sr,venue,date,result,teamName,opponentName){
     let teamPath= path.join(__dirname,"ipl",teamName);
     createDirectory(teamPath);
     let filePath = path.join(teamPath,playerName +".xlsx");
     let playerDetails ={
        teamName,
        playerName,
        runs,
        balls,
        fours,
        sixes,
        sr,
        opponentName,
        venue,
        date,
        result
     };
     let data =excelReader(filePath,playerName);//returns data in json format
     data.push(playerDetails);
     excelWriter(filePath,playerName,data);
 }
 function excelReader(filePath,sheetName){
    if (fs.existsSync(filePath) == false) {
        return [];
    }
    let workbook = xlsx.readFile(filePath); 
    let worksheet=workbook.Sheets[sheetName];
    let data =xlsx.utils.sheet_to_json(worksheet);
    return data;
 }
 function excelWriter(filePath,sheetName,data){
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, filePath);


    
 }
 function createDirectory(filePath){
    if(fs.existsSync(filePath)== false){
        fs.mkdirSync(filePath);
    }
}
module.exports ={
    runScorecard
}
 