import { createCheerioRouter } from "crawlee";
import { ProductData, Product } from "../interfaces/product.js";

export const startUrl = ["https://www.vinci-play.com/en/playground-equipment"];
export const router = createCheerioRouter();
export const products: Product[] = [];
const base_url = "https://www.vinci-play.com";

router.addDefaultHandler(async ({ $, addRequests, log }) => {
  try {
    $(".cat-container li a").each((_, element) => {
      const $element = $(element);
      const img_src =
        $element.find("img")?.attr("src") || "No image source found";
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
  } catch (error) {
    log.error(`Error in default handler at ${base_url}`, { error });
  }
});

router.addHandler("product", async ({ request, $, log, pushData }) => {
  try {
    const title =
      $(".product-title").first().text().trim() || "Title not found";
    const product_data: ProductData[] = [];
    const product_table = $(".product-table");

    if (product_table.length === 0) {
      log.warning(`No product table found for ${request.loadedUrl}`);
      return;
    }

    product_table.find("tr").each((_, element) => {
      const nameEl = $(element).find("p").first();
      const valueEl = $(element).find("p").last();

      const data_name = nameEl?.text()?.trim() || "Data name not found";
      const data_value = valueEl?.text()?.trim() || "Data value not found";

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
  } catch (error) {
    log.error(`Error processing product at ${request.loadedUrl}`, { error });
  }
});
