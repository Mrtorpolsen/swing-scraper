// For more information, see https://crawlee.dev/
import { CheerioCrawler, RequestQueue } from "crawlee";
import {
  exportProductsToExcel,
  exportUnknownDataNameToExcel,
} from "./utils/exportToExcel.js";
import { Product } from "./interfaces/product.js";

import { unknownDataNames } from "./utils/productDataNormalizer.js";

import {
  startUrl as vinciStartUrl,
  router as vinciRouter,
  products as vinciProducts,
} from "./routes/vinci.js";
import {
  startUrl as kompanUrl,
  router as kompanRouter,
  products as kompanProducts,
} from "./routes/kompan.js";
import {
  startUrl as hagsUrl,
  router as hagsRouter,
  products as hagsProducts,
} from "./routes/hags.js";

const fileName = new Date().toISOString().replace(/[^a-zA-Z0-9]/g, "");

async function runCrawler(startUrl: string[], router: any) {
  const requestQueue = await RequestQueue.open(`queue - ${startUrl[0]}`);

  for (const url of startUrl) {
    await requestQueue.addRequest({ url });
  }

  const crawler = new CheerioCrawler({
    requestHandler: router,
    requestQueue,
    minConcurrency: 1,
    maxConcurrency: 10,
    autoscaledPoolOptions: {
      desiredConcurrencyRatio: 0.3,
    },
    maxRequestsPerCrawl: 50,
  });

  await crawler.run();
}
/* await runCrawler(kompanUrl, kompanRouter); */
await runCrawler(hagsUrl, hagsRouter);
/* await runCrawler(vinciStartUrl, vinciRouter); */

const allProducts: Product[] = [
  ...kompanProducts,
  ...vinciProducts,
  ...hagsProducts,
];

exportProductsToExcel(
  allProducts,
  "./storage/datasets/excel/" + fileName,
  "Combined Products"
);
exportUnknownDataNameToExcel(
  unknownDataNames.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.dataName === item.dataName)
  ),
  "./storage/datasets/excel/" + fileName + "---UNKOWNS"
);
