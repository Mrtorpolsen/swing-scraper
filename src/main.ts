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
  startUrl as kompanURL,
  router as kompanRouter,
  products as kompanProducts,
} from "./routes/kompan.js";
async function runCrawler(startUrl: string[], router: any) {
  const requestQueue = await RequestQueue.open(`queue - ${startUrl[0]}`);

  for (const url of startUrl) {
    await requestQueue.addRequest({ url });
  }

  const crawler = new CheerioCrawler({
    requestHandler: router,
    requestQueue,
    maxRequestsPerCrawl: 20,
  });

  await crawler.run();
}

await runCrawler(vinciStartUrl, vinciRouter);
await runCrawler(kompanURL, kompanRouter);

const allProducts: Product[] = [...kompanProducts, ...vinciProducts];

exportToExcel(
  allProducts,
  "./storage/datasets/excel/" +
    new Date().toISOString().replace(/[^a-zA-Z0-9]/g, ""),
  "Combined Products"
);
