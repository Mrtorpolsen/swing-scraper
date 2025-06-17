import { createCheerioRouter } from "crawlee";
import { ProductData, Product } from "../interfaces/product.js";
import productDataNormalizer from "../utils/productDataNormalizer.js";

export const startUrl = [
  "https://www.hags.com/da/products/playground-equipment",
];
export const router = createCheerioRouter();
export const products: Product[] = [];
const baseUrl = "https://www.hags.com";

router.addDefaultHandler(async ({ enqueueLinks }) => {
  await enqueueLinks({
    globs: [
      "https://www.hags.com/da/products/playground-equipment/play-systems/**",
      "https://www.hags.com/da/products/playground-equipment/freestanding/**",
      "https://www.hags.com/da/products/playground-equipment/themed/**",
      "https://www.hags.com/da/products/new-products",
    ],
    label: "category",
  });
});

router.addHandler("category", async ({ enqueueLinks }) => {
  await enqueueLinks({
    globs: [
      "https://www.hags.com/da/products/playground-equipment/play-systems/playcubes/**",
      "https://www.hags.com/da/products/playground-equipment/freestanding/play-sculptures/**",
      "https://www.hags.com/da/products/playground-equipment/themed/**/**",
      "https://www.hags.com/da/products/new-products/**",
    ],
    label: "product",
    exclude: [/\?/],
  });
});

router.addHandler("product", async ({ request, $, log, pushData }) => {
  try {
    const titleElement = $("h1").first();
    const title = titleElement?.text()?.trim() || "Title not found";
    const productId =
      titleElement?.nextAll("p").first().text().trim() ||
      "Product ID not found";
    const imgSrc =
      $("img#zoom-full-image-0").attr("src") || "Image source not found";

    const productData: ProductData[] = [];
    const productTable = $("div#accordian-spec-panel table tbody");

    if (productTable.length === 0) {
      log.warning(`No product table found for ${request.loadedUrl}`);
      return;
    }

    productTable.find("tr").each((_, element) => {
      const nameEl = $(element).find("td").first();
      const valueEl = $(element).find("td").last();

      const dataName = productDataNormalizer(
        nameEl?.text()?.trim() || "Data name not found",
        "Hags",
        request.loadedUrl
      );
      const dataValue = valueEl?.text()?.trim() || "Data value not found";

      productData.push({ [dataName]: dataValue });
    });

    const current_product = {
      company: "Hags",
      title: `${title} - ${productId}`,
      url: request.loadedUrl,
      imgSrc: baseUrl + "/" + imgSrc,
      productData,
    };

    products.push(current_product);

    await pushData({
      current_product,
    });
  } catch (error) {
    log.error(`Error processing product at ${request.loadedUrl}`, { error });
  }
});
