// For more information, see https://crawlee.dev/
import { CheerioCrawler, RequestQueue } from "crawlee";
import { exportToExcel } from "./utils/exportToExcel.js";
import { Product } from "./interfaces/product.js";

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
    maxRequestsPerCrawl: 10,
  });

  await crawler.run();
}
await runCrawler(kompanUrl, kompanRouter);
/* await runCrawler(vinciStartUrl, vinciRouter);
await runCrawler(hagsUrl, hagsRouter); */

const allProducts: Product[] = [
  ...kompanProducts,
  ...vinciProducts,
  ...hagsProducts,
];

exportToExcel(
  allProducts,
  "./storage/datasets/excel/" +
    new Date().toISOString().replace(/[^a-zA-Z0-9]/g, ""),
  "Combined Products"
);
