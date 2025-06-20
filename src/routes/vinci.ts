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

      const url = new URL(href, baseUrl).toString();
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
    log.info(`Scraping: ${request.url}`);
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

    const title =
      $(".product-title").first().text().trim() || "Title not found";
    const productData: ProductData[] = [];
    const productTable = $(".product-table");

    if (productTable.length === 0) {
      log.warning(`No product table found for ${request.loadedUrl}`);
      return;
    }

    productTable.find("tr").each((_, element) => {
      const nameElement = $(element).find("p").first();
      const valueElement = $(element).find("p").last();

      const dataField = productDataNormalizer(
        nameElement?.text()?.trim() || "Data name not found",
        "Vinci Play",
        request.loadedUrl
      );
      const dataValue = valueElement?.text()?.trim() || "Data value not found";

      if (dataField[1] === true) {
        if (dataField[0] === "ageGroup") {
          let minAge =
            dataValue.split(/[-\/]/)[0].trim() || "Min age not found";
          if (dataValue.includes("+")) {
            minAge = dataValue.replace(/\D/g, "") || "Min age not found";
          }
          current_product = { ...current_product, minAge: minAge };
        }
        current_product = { ...current_product, [dataField[0]]: dataValue };
      } else {
        productData.push({ [dataField[0]]: dataValue });
      }
    });
    if (title !== "Title not found") {
      const [name, id] = title.split(" ");
      current_product = {
        ...current_product,
        productCategory: name,
        productLine: id,
      };
    }

    current_product = {
      ...current_product,
      company: "Vinci Play",
      title,
      url: request.loadedUrl,
      imgSrc: request.userData.imgSrc,
      productNumber: title,
      productData,
    };

    products.push(current_product);
    await pushData(current_product);
  } catch (error) {
    log.error(`Error processing product at ${request.loadedUrl}`, { error });
  }
});
