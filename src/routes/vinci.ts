import { createCheerioRouter } from "crawlee";
import { ProductData, Product } from "../interfaces/product.js";
import productDataNormalizer from "../utils/productDataNormalizer.js";

export const startUrl = ["https://www.vinci-play.com/en/playground-equipment"];
export const router = createCheerioRouter();
export const products: Product[] = [];
const baseUrl = "https://www.vinci-play.com";

router.addDefaultHandler(async ({ $, addRequests, log }) => {
  try {
    $(".cat-container li a").each((_, element) => {
      const $element = $(element);
      const imgSrc =
        $element.find("img")?.attr("src") || "No image source found";
      const href = $element.attr("href");
      if (!href) {
        log.warning("no href found - skipping..." + element);
        return;
      }

      const url = baseUrl + href;
      addRequests([
        {
          url,
          label: "product",
          userData: {
            imgSrc,
          },
        },
      ]);
    });
  } catch (error) {
    log.error(`Error in default handler at ${baseUrl}`, { error });
  }
});

router.addHandler("product", async ({ request, $, log, pushData }) => {
  try {
    const title =
      $(".product-title").first().text().trim() || "Title not found";
    const productData: ProductData[] = [];
    const productTable = $(".product-table");

    if (productTable.length === 0) {
      log.warning(`No product table found for ${request.loadedUrl}`);
      return;
    }

    productTable.find("tr").each((_, element) => {
      const nameEl = $(element).find("p").first();
      const valueEl = $(element).find("p").last();

      const dataName = productDataNormalizer(
        nameEl?.text()?.trim() || "Data name not found",
        "Vinci Play",
        request.loadedUrl
      );
      const dataValue = valueEl?.text()?.trim() || "Data value not found";

      productData.push({ [dataName]: dataValue });
    });

    const current_product = {
      company: "Vinci Play",
      title,
      url: request.loadedUrl,
      imgSrc: request.userData.imgSrc,
      productData,
    };

    products.push(current_product);
    await pushData(current_product);
  } catch (error) {
    log.error(`Error processing product at ${request.loadedUrl}`, { error });
  }
});
