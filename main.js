const axios = require("axios");
const puppeteer = require("puppeteer");
const TelegramBot = require("node-telegram-bot-api");
const Api = require("./src/atomicAssetsAPI");
const fs = require("fs");

async function go() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1366,
    height: 768,
    deviceScaleFactor: 1,
  });

  await page.goto(`https://wax.atomichub.io/market/sale/19043912`);

  for (_ of [1, 2, 3]) {
    await page.keyboard.press("Tab", { delay: 100 });
  }
  await page.keyboard.press("Enter", { delay: 100 });

  await page.screenshot({ path: "./example.png" });
  // let signal = await page.evaluate(() => {
  //   return document.querySelector(
  //     ".speedometerWrapper-1SNrYKXY.summary-72Hk5lHE .speedometerSignal-pyzN--tL"
  //   ).innerHTML;
  // });
  // await browser.close();
}

async function findHighVolTemplates(minSales = 240, rarity = "Common") {
  const api = new Api();

  await api.getTemplateIds();

  const highVolTemplates = [];
  let count = 0;
  for (t of api.templates) {
    if (t.rarity != rarity) {
      continue;
    }

    const { data } = await api.getSalesHistory(t.id);

    const salesLastTenDays = data.map((d) => parseInt(d.sales)).slice(0, 10);
    if (salesLastTenDays.length == 0) {
      continue;
    }

    const salesLastTenDaysSum = salesLastTenDays.reduce(
      (acc, val) => acc + val
    );

    console.log(t.name, salesLastTenDaysSum);

    if (salesLastTenDaysSum > minSales) {
      highVolTemplates.push(t);
    }

    // count++;
    // if (count == 10) {
    //   break;
    // }
  }

  console.log(highVolTemplates);
}

async function main() {
  let keysFile = fs.readFileSync("data/keys.json");
  let keys = JSON.parse(keysFile);

  const botToken = keys.telegram.botToken;
  const chatId = keys.telegram.chatId;
  const bot = new TelegramBot(botToken, { polling: true });

  let templatesFile = fs.readFileSync("data/highVolTemplates.json");
  let highVolTemplates = JSON.parse(templatesFile);

  console.log(`Loaded ${highVolTemplates.length} templates!`);

  const api = new Api();

  while (true) {
    for (let t of highVolTemplates) {
      const listings = await api.getListings(t.id);
      if (listings[0] < listings[1] * 0.9) {
        // cheapest listing is less than 90% the price of the second cheapest listing
        const message = `${t.name} - ${listings}\nhttps://wax.atomichub.io/market?collection_name=alien.worlds&order=asc&sort=price&symbol=WAX&template_id=${t.id}`;
        console.log(message);
        bot.sendMessage(chatId, message);
      }
    }
  }

  // assetIds = { exoGlove: "1099528008992" };
  // templateIds = { exoGlove: "19560" };

  n = 10;
  for (i = 0; i < n; i++) {
    await getListings(templateIds.exoGlove);
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

main();
