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
      //"https://www.hags.com/da/products/new-products",
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
      //"https://www.hags.com/da/products/new-products/**",
    ],
    label: "product",
    exclude: [/\?/],
  });
});

router.addHandler("product", async ({ request, $, log, pushData }) => {
  try {
    let current_product: Product = {
      company: "",
      title: "",
      url: "",
      imgSrc: "",
      productNumber: "",
      productLine: "",
      productCategory: "",
      ageGroup: "",
      minAge: "",
      numberOfUsers: "",
      inclusive: "",
      length: "",
      width: "",
      height: "",
      lengthOfSecurityZone: "",
      widthOfSecurityZone: "",
      freeFallHeight: "",
      safetyZoneM2: "",
      productData: [],
    };
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

    const navElement = $("ul.product-nav");

    if (navElement.length === 0) {
      log.warning(`No nav element found for ${request.loadedUrl}`);
      return;
    }

    const navSections = navElement.find("li");

    navElement.find("li").each((i, element) => {
      if (i === 2) {
        current_product.productCategory = $(element).find("a").first().text();
      }
      if (i === navSections.length - 2) {
        current_product.productLine = $(element).find("a").first().text();
      }
    });

    productTable.find("tr").each((_, element) => {
      const nameElement = $(element).find("td").first();
      const valueElement = $(element).find("td").first().next("td");

      const dataField = productDataNormalizer(
        nameElement?.text()?.trim() || "Data name not found",
        "Hags",
        request.loadedUrl
      );
      const dataValue = valueElement?.text()?.trim() || "Data value not found";

      if (dataField[1] === true) {
        current_product = { ...current_product, [dataField[0]]: dataValue };
      } else {
        productData.push({ [dataField[0]]: dataValue });
      }
    });

    current_product = {
      ...current_product,
      company: "Hags",
      title,
      url: request.loadedUrl,
      imgSrc: baseUrl + "/" + imgSrc,
      productNumber: productId,
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
