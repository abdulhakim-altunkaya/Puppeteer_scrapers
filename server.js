const express = require ("express");
const puppeteer = require ("puppeteer");
const connectDB = require ("./DB/connection");
const ModelMovie = require("./DB/ModelMovie");
const ModelJobs = require("./DB/ModelJobs");


const app = express ();
connectDB();


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use("/assets", express.static("static"));

app.get("/general", function(req, res){
  (async ()=>{
    let movieURL= "https://www.imdb.com/title/tt0411008/?ref_=fn_al_tt_1";
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await page.goto(movieURL, {waitUntil: "networkidle2"});
    const movieData = await page.evaluate(() => {
      let movieTitle = document.querySelector('div[class="TitleBlock__TitleContainer-sc-1nlhx7j-1 jxsVNt"] > h1').innerText;
      let movieRating = document.querySelector('span[class="AggregateRatingButton__RatingScore-sc-1ll29m0-1 iTLWoV"]').innerText;
      let movieVotes = document.querySelector('div[class="AggregateRatingButton__TotalRatingAmount-sc-1ll29m0-3 jkCVKJ"]').innerText;
      return{movieTitle, movieRating, movieVotes}
    });
    await browser.close();
    await res.render("index2", {movieData});
    await ModelMovie.create(movieData);
    await console.log(movieData);
    await console.log(movieData.movieTitle);
  })()
  .catch(() => {
    console.log("error happened");
    res.status(404);/*This must be place before res.render*/
    res.render("index");
  });
});


app.get("/asdf", function(req, res){
  (async ()=>{
    const movieURL= ["https://www.imdb.com/title/tt0234215/?ref_=hm_tpks_tt_i_2_pd_tp1_cp", "https://www.imdb.com/title/tt0411008/?ref_=fn_al_tt_1"];
    for (var i = 0; i < movieURL.length; i++) {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(movieURL[i], {waitUntil: "networkidle2"});
      const movieData = await page.evaluate(() => {
        let movieTitle = document.querySelector('div[class="TitleBlock__TitleContainer-sc-1nlhx7j-1 jxsVNt"] > h1').innerText;
        let movieRating = document.querySelector('span[class="AggregateRatingButton__RatingScore-sc-1ll29m0-1 iTLWoV"]').innerText;
        let movieVotes = document.querySelector('div[class="AggregateRatingButton__TotalRatingAmount-sc-1ll29m0-3 jkCVKJ"]').innerText;
        return{movieTitle, movieRating, movieVotes}
      });
      await page.close();
      await browser.close();
      await console.log(movieData);
    }
    await res.render("index");
  })()
  .catch(() => {
    console.log("error happened");
    res.status(404);/*This must be place before res.render*/
    res.render("index");
  });
});

app.get("/qwer", function(req, res){
  (async ()=>{
    const movieURL= ["https://www.imdb.com/title/tt0234215/?ref_=hm_tpks_tt_i_2_pd_tp1_cp", "https://www.imdb.com/title/tt0411008/?ref_=fn_al_tt_1"];
    for (var i = 0; i < movieURL.length; i++) {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(movieURL[i], {waitUntil: "networkidle2"});
      const movieData = await page.evaluate(() => {
        let movieTitle = document.querySelector('div[class="TitleBlock__TitleContainer-sc-1nlhx7j-1 jxsVNt"] > h1').innerText;
        let movieRating = document.querySelector('span[class="AggregateRatingButton__RatingScore-sc-1ll29m0-1 iTLWoV"]').innerText;
        let movieVotes = document.querySelector('div[class="AggregateRatingButton__TotalRatingAmount-sc-1ll29m0-3 jkCVKJ"]').innerText;
        return{movieTitle, movieRating, movieVotes}
      });
      const word1 = movieData.movieTitle;
      const word2 = `\"${word1}\"`;
      const searchResult = await ModelMovie.find({$text:{$search: word2}});
      if (searchResult == 0) {
        await ModelMovie.create(movieData);
        await console.log("new data created")
      } else {
        await ModelMovie.updateOne({searchResult}, {movieData})
        await console.log("existing updated");
      }
      await browser.close();
    }
    await res.render("index");
  })()
  .catch(() => {
    console.log("error happened");
    res.status(404);/*This must be place before res.render*/
    res.render("index");
  });
});

app.get("/goog", function(req, res){
  (async ()=>{
    let movieURL= "https://www.google.de/";
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await page.goto(movieURL, {waitUntil: "networkidle2"});
    await console.log("google page opened");
    await page.type("*[name='q']", "Mercedes kaufen", {delay: 2000});
    await page.click("*[name='btnK']");
    await page.waitForSelector('#rso');
    await page.waitForNavigation({ waitUntil: 'networkidle0' })
    await page.screenshot({path: "./screenshots/Screenshot7.png", fullPage: true})
    await page.close();
    await browser.close();
    await console.log("operation finished");
  })()
  .catch(() => {
    console.log("error happened");
    res.status(404);/*This must be place before res.render*/
    res.render("index");
  });
});

app.get("/boog", function(req, res){
  (async ()=>{
    let movieURL= "https://www.google.de/";
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await page.goto(movieURL, {waitUntil: "networkidle2"});
    await console.log("google page opened");
    const mongoRecord = await ModelMovie.findOne({}).sort({_id:+1})
    await page.type("*[name='q']", mongoRecord.movieTitle, {delay: 2000});
    await page.click("*[name='btnK']");
    await page.waitForSelector('#rso');
    await page.waitForNavigation({ waitUntil: 'networkidle0' })
    await page.screenshot({path: "./screenshots/Screenshot5.png", fullPage: true})
    await page.close();
    await browser.close();
    await console.log("operation finished");
  })()
  .catch(() => {
    console.log("error happened");
    res.status(404);/*This must be place before res.render*/
    res.render("index");
  });
});
app.get("/linkedin", function(req, res){
  (async ()=>{
    let jobsURL= "https://www.linkedin.com/jobs/search/?geoId=103644278&location=United%20States";
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await page.goto(jobsURL, {waitUntil: "networkidle2"});
    await console.log("linkedin page opened");
    await page.screenshot({path: "./screenshots/Screenshot9.png", fullPage: true})
    await page.close();
    await browser.close();
    await console.log("task finished");
  })()
  .catch(() => {
    console.log("error happened");
    res.status(404);/*This must be place before res.render*/
    res.render("index");
  });
});



app.get("/all", function(req, res){
  ModelMovie.find({}).sort({_id:-1}).then((results) => {
    res.render("allData", {movie_data: results})
  })
  .catch(() => {
    console.log("error happened");
    res.status(404);/*This must be place before res.render*/
    res.render("index");
  });
});








app.get("/upwork", function(req, res){
  (async ()=>{
    let movieURL= "https://codepen.io/maximepassenier/pen/qBjxdKx";
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await page.goto(movieURL, {waitUntil: "networkidle2"});
    const testData = await page.evaluate(() => {
      let testChamber = document.querySelector('div[class="prop"] > div[class="prop-val"]').innerText;
      let testPrice = document.querySelector('div[class="prop price-prop"] > div[class="prop-val"]').innerText;
      return{testChamber, testPrice}
    });
    await browser.close();
    await console.log(testData);
    await console.log(testData.testPrice);
  })()
  .catch(() => {
    console.log("error happened");
    res.status(404);
  });
});

const server = app.listen (process.env.PORT || 3000);
const portNumber = server.address().port;
console.log ("ГОСПОДИН ПОРТ СЕИЧАС ОТКРЫТ "+ portNumber)
