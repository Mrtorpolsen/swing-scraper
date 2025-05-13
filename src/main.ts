// For more information, see https://crawlee.dev/
import { CheerioCrawler, ProxyConfiguration } from "crawlee";
import { exportToExcel } from "./exportToExcel.js";
import extractSubdomain from "./extractSubdomain.js";

import { router, all_products } from "./routes.js";

const startUrls = ["https://www.vinci-play.com/en/playground-equipment"];

const crawler = new CheerioCrawler({
  // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
  requestHandler: router,
  // Comment this option to scrape the full website.
  maxRequestsPerCrawl: 5,
});

await crawler.run(startUrls);

exportToExcel(
  all_products,
  "./storage/datasets/excel/" +
    new Date().toISOString().replace(/[^a-zA-Z0-9]/g, ""),
  extractSubdomain(startUrls[0])
);
