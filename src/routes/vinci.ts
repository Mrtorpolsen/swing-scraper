import { createCheerioRouter } from "crawlee";
import { ProductData, Product } from "../interfaces/product.js";

export const startUrl = ["https://www.vinci-play.com/en/playground-equipment"];
export const router = createCheerioRouter();
export const products: Product[] = [];
const base_url = ["https://www.vinci-play.com"];

router.addDefaultHandler(async ({ $, addRequests, log }) => {
  $(".cat-container li a").each((_, element) => {
    const $element = $(element);
    const img_src = $element.find("img").attr("src");
    const href = $element.attr("href");
    if (!href) {
      log.warning("no href found - skipping..." + element);
      return;
    }

    const url = base_url + href;
    addRequests([
      {
        url,
        label: "product",
        userData: {
          img_src,
        },
      },
    ]);
  });
});

router.addHandler("product", async ({ request, $, log, pushData }) => {
  const title = $(".product-title").first().text();
  const product_data: ProductData[] = [];
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

  const current_product = {
    company: "Vinci Play",
    title,
    url: request.loadedUrl,
    img_src: request.userData.img_src,
    product_data,
  };

  products.push(current_product);
  await pushData(current_product);
});
