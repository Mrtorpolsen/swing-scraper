import { createCheerioRouter } from "crawlee";
import { ProductData, Product } from "../interfaces/vinci.js";

export const router = createCheerioRouter();
export const all_products: Product[] = [];
const base_url = ["https://www.kompan.com"];

router.addDefaultHandler(async ({ enqueueLinks, log }) => {
  log.info(`enqueueing new URLs`);

  await enqueueLinks({
    globs: ["https://www.kompan.com/da/dk/p/**"],
    label: "product",
  });
});
//ItemListSchema
router.addHandler("product", async ({ request, $, log, pushData }) => {
  const title_element = $("h1").first();
  const title = title_element.text();
  const product_id = title_element.prevAll("p").first().text().trim();

  log.info(`${title} - ${product_id}`, { url: request.loadedUrl });
  /*     const product_data: ProductData[] = [];
  const product_table = $(".product-table");

    if (product_table.length === 0) {
    log.warning(`No product table found for ${request.loadedUrl}`);
    return;
  }

  product_table.find("tr").each((_, element) => {
    const data_name = $(element).find(".align-left").text().trim();
    const data_value = $(element).find(".align-right").text().trim();

    product_data.push({ [data_name]: data_value });
  });
  log.info(`${title}`, { url: request.loadedUrl });

  const current_product = {
    title,
    url: request.loadedUrl,
    img_src: request.userData.img_src,
    product_data,
  }; */

  /* all_products.push(current_product); */
  await pushData({
    title: `${title} - ${product_id}`,
    url: request.loadedUrl,
  });
});
