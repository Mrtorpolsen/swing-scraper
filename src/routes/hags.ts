import { createCheerioRouter, RequestOptions, Dictionary } from "crawlee";
import { ProductData, Product } from "../interfaces/product.js";
import productDataNormalizer from "../utils/productDataNormalizer.js";

export const startUrl = ["https://www.hags.com/da/products"];
export const router = createCheerioRouter();
export const products: Product[] = [];
const baseUrl = "https://www.hags.com";

router.addDefaultHandler(async ({ enqueueLinks }) => {
  await enqueueLinks({
    globs: [
      "https://www.hags.com/da/products/*",
      "https://www.hags.com/da/products/*/",
    ],
    exclude: [/\?/],
    label: "category",
  });
});
//Gentænk det -- Du har de store kategorier, og så subkategorierne, hvor du bare kan manuelt loope igenne dem i tabellen.
//Sig til den at den kun må gå 1 frem, indtil den rammer en tabel.
router.addHandler(
  "category",
  async ({ $, enqueueLinks, addRequests, log, request }) => {
    try {
      console.log(`Processing ${request.loadedUrl}`);
      const product_container = $(
        "section.products-listing div.products-listing__grid"
      );
      const nextPage = $("a#nextpage").attr("href");
      console.log("nextPage " + nextPage);
      if (nextPage) {
        const url = baseUrl + nextPage;
        console.log(` NEXTPAGE URL IS RUNNING ${url}`);
        await addRequests([
          {
            url,
            label: "category",
          },
        ]);
      }

      if (product_container.length === 0) {
        const base = request.loadedUrl.replace(/\/$/, "");
        await enqueueLinks({
          globs: [`${base}/*`],
          exclude: [/\?/],
          label: "category",
        });
        return;
      }

      console.log(`IT WAS A PRODUCT PAGE ${request.loadedUrl}`);

      product_container.find("div.product-card").each((_, element) => {
        const $element = $(element);
        const href = $element.find("a").first().attr("href");
        if (!href) {
          log.warning("no href found - skipping..." + element);
          return;
        }

        const url = new URL(href, baseUrl).toString();
        addRequests([
          {
            url,
            label: "product",
            uniqueKey: url,
          },
        ]);
      });
    } catch (error) {
      log.error(`Error in default handler at ${baseUrl}`, { error });
    }
  }
);

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
    } else {
      const navSections = navElement.find("li");

      navElement.find("li").each((i, element) => {
        if (i === 2) {
          current_product.productCategory =
            $(element).find("a").first().text() || "Product category not found";
        }
        if (i === navSections.length - 2) {
          current_product.productLine =
            $(element).find("a").first().text() || "Product line not found";
        }
      });
    }

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
        if (dataField[0] === "ageGroup") {
          const rawAge = dataValue.split(/[-\/]/)[0].trim();
          const minAgeMatch = rawAge.match(/\d+/);
          const minAge = minAgeMatch ? minAgeMatch[0] : "Min age not found";

          current_product = { ...current_product, minAge: minAge };
        }
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
    await pushData(current_product);
  } catch (error) {
    log.error(`Error processing product at ${request.loadedUrl}`, { error });
  }
});
