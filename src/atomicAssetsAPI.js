const axios = require("axios");

class Api {
  constructor() {
    this.assetUri = "https://wax.api.atomicassets.io/atomicassets/v1/";
    this.marketUri = "https://wax.api.atomicassets.io/atomicmarket/v1/";
    this.templates = [];
  }
  async getAsset(id) {
    const { data } = await axios.get(`${this.assetUri}assets/${id}`);
    return data;
  }
  async getTemplate(id) {
    const { data } = await axios.get(
      `${this.assetUri}templates/alien.worlds/${id}`
    );
    console.log(data);
  }
  async getSalesHistoryInternal(tempalteId) {
    const { data } = await axios.get(
      `https://wax.api.aa.atomichub.io/atomicmarket/v1/prices/sales/days?symbol=WAX&template_id=${tempalteId}`,
      {
        headers: {
          authority: "wax.api.aa.atomichub.io",
          "sec-ch-ua":
            '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
          "sec-ch-ua-mobile": "?0",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36",
          accept: "*/*",
          origin: "https://wax.atomichub.io",
          "sec-fetch-site": "same-site",
          "sec-fetch-mode": "cors",
          "sec-fetch-dest": "empty",
          referer: "https://wax.atomichub.io/",
          "accept-language": "en-US,en;q=0.9",
          "if-modified-since": "Fri, 04 Jun 2021 19:28:28 GMT",
        },
      }
    );
    console.log(data);
    return data;
  }
  async getListingsInternal(templateId) {
    const { data } = await axios.get(
      `https://wax.api.aa.atomichub.io/atomicmarket/v1/sales?limit=10&order=asc&sort=price&state=1&collection_name=alien.worlds&schema_name=&template_id=${templateId}`,
      {
        headers: {
          authority: "wax.api.aa.atomichub.io",
          "sec-ch-ua":
            '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
          "sec-ch-ua-mobile": "?0",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36",
          accept: "*/*",
          origin: "https://wax.atomichub.io",
          "sec-fetch-site": "same-site",
          "sec-fetch-mode": "cors",
          "sec-fetch-dest": "empty",
          referer: "https://wax.atomichub.io/",
          "accept-language": "en-US,en;q=0.9",
          "if-modified-since": "Fri, 04 Jun 2021 19:28:29 GMT",
        },
      }
    );
    console.log(data);
    for (i of data.data) {
      console.log(i.listing_price);
    }
  }
  async getSalesHistory(templateId) {
    const endpoint = `${this.marketUri}prices/sales/days?collection_name=alien.worlds&template_id=${templateId}&symbol=WAX`;
    const { data } = await axios.get(endpoint);

    return data;
  }
  async getListings(templateId) {
    const { data } = await axios.get(
      `${this.marketUri}sales?state=1&template_id=${templateId}&page=1&limit=10&order=asc&sort=price&symbol=WAX`
    );

    let filteredData = data.data.filter((d) => d.listing_symbol == "WAX");

    const topFiveListings = filteredData
      .slice(0, 5)
      .map((l) => l.listing_price / 100000000);

    return topFiveListings;
    //   let s = "";
    //   for (i = 0; i < 5; i++) {
    //     s += data.data[i].listing_price / 100000000 + ", ";
    //     // console.log(data.data[i].listing_price);
    //   }
    //   if (
    //     parseInt(data.data[0].listing_price) <
    //     data.data[1].listing_price * 0.95
    //   ) {
    //     console.log(s);
    //   }
  }
  async getTemplateIds() {
    const endpoint = `${this.assetUri}templates?collection_name=alien.worlds&has_assets=true&page=1&limit=1000&order=asc&sort=created`;
    const { data } = await axios.get(endpoint);

    console.log(`found ${data.data.length} templates in total!`);

    for (let d of data.data) {
      const template = {
        name: d.name,
        rarity: d.immutable_data.rarity,
        id: d.template_id,
        supply: d.issued_supply,
      };

      this.templates.push(template);
    }
  }
}

module.exports = Api;
