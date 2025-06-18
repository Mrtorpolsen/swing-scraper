import { createCheerioRouter } from "crawlee";
import { ProductData, Product } from "../interfaces/product.js";
import productDataNormalizer from "../utils/productDataNormalizer.js";

export const startUrl = [
  "https://www.kompan.com/da/dk/produkter?view_as=List&page=250",
];
export const router = createCheerioRouter();
export const products: Product[] = [];

router.addDefaultHandler(async ({ enqueueLinks }) => {
  await enqueueLinks({
    globs: ["https://www.kompan.com/da/dk/p/**"],
    label: "product",
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
      titleElement?.prevAll("p").first().text().trim() ||
      "Product ID not found";
    const imgSrc =
      $(`img[alt="${title}"]`).attr("src") || "Image source not found";

    const productData: ProductData[] = [];

    const specificationsToSearch = [
      "Detaljer om produktet",
      "Mål",
      "Garantier og certifikater",
      "Oplysninger om installation",
    ];
    specificationsToSearch.forEach((spec) => {
      const container = $(`.sidepanel-content p:contains('${spec}')`)
        .closest(".el0d8xb0")
        .find(".e68owcd0")
        .first();

      if (container.length === 0) {
        log.warning(`Section "${spec}" not found for ${title}`);
        return;
      }

      const navElement = $("ol.e2d2et00");
      //TODO LOOK INTO IT STILL CONTINUE IF I DOESNT FIND ELEMENT SEE https://docs.google.com/spreadsheets/d/1S__i_VOFjvemU1gNhecBMXHsHCOK9uA-GXOp_3kJnHc/edit?gid=2098298050#gid=2098298050
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

      container.find(".ecz3vwj0").each((_, element) => {
        const nameElement = $(element)
          .find(".ecz3vwj1")
          .children(":not(style):not(script)")
          .first();
        const valueElement = $(element)
          .find(".ecz3vwj2")
          .children(":not(style):not(script)")
          .first();

        const dataField = productDataNormalizer(
          nameElement?.text()?.trim() || "Data name not found",
          "Kompan",
          request.loadedUrl
        );
        const dataValue =
          valueElement?.text()?.trim() || "Data value not found";

        if (dataField[1] === true) {
          if (dataField[0] === "ageGroup") {
            let minAge: number | string = dataValue;
            minAge = dataValue[0];
            if (isNaN(parseInt(dataValue[0], 10))) {
              minAge = dataValue[1];
            }
            if (dataValue.includes("m")) {
              const months = parseInt(dataValue.replace(/\D/g, ""), 10);
              minAge = (months / 12).toString();
            }

            current_product = { ...current_product, minAge: minAge };
          }
          current_product = { ...current_product, [dataField[0]]: dataValue };
        } else {
          productData.push({ [dataField[0]]: dataValue });
        }
      });
    });
    current_product = {
      ...current_product,
      company: "Kompan",
      title,
      url: request.loadedUrl,
      imgSrc: imgSrc,
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
