const request = require('request');
const cheerio = require('cheerio');
const scorecards =require('./scorecard');
function getAllMatchLinks(url){
    request(url,(error,response,html)=>{
        const $=cheerio.load(html);
        const scorecard =$("a[data-hover='Scorecard']");
        
        //extractAllMatchLinks(scorecard);
        for(let i=0;i<scorecard.length;i++){
            //console.log($(scorecard[i]).attr('href'));
            let matchLink="https://www.espncricinfo.com"+$(scorecard[i]).attr('href');
            scorecards.runScorecard(matchLink);
  
      }

    })
}

module.exports = {
    getAllMatchLinks
}