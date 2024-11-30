const express = require("express");
const app = express();
const path = require("path");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const apiData = await fetch(
    "http://qa-gb.api.dynamatix.com:3100/api/applications/getApplicationById/67339ae56d5231c1a2c63639"
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((e) => console.log(e.message));
  let feeStatus = apiData.isValuationFeePaid;
  let ukResident = apiData.isUkResident;
  let riskRating = apiData.riskRating;
  let loanRequired = apiData.mortgage.loanRequired;
  loanRequired = Number(
    loanRequired.slice(1, loanRequired.length).split(",").join("")
  );
  let purchasePrice = apiData.mortgage.purchasePrice;
  purchasePrice = Number(
    purchasePrice.slice(1, purchasePrice.length).split(",").join("")
  );

  let ltv = (loanRequired / purchasePrice) * 100;
  ltv = ltv.toFixed(2);
  console.log(ltv);
  let checkAllConditions = 60 > ltv && ukResident && riskRating && feeStatus;

  res.render("dashboard.ejs", {
    feeStatus,
    ukResident,
    riskRating,
    ltv,
    checkAllConditions,
  });
});

app.listen(5000, console.log("server Run on Port 5000"));
