import { createCheerioRouter } from "crawlee";
import { ProductData, Product } from "../interfaces/product.js";

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

      container.find(".ecz3vwj0").each((_, element) => {
        const nameEl = $(element).find("p").first();
        const valueEl = $(element).find("p").last();

        const dataName = nameEl?.text()?.trim() || "Data name not found";
        const dataValue = valueEl?.text()?.trim() || "Data value not found";

        productData.push({ [dataName]: dataValue });
      });
    });

    const current_product = {
      company: "Kompan",
      title: `${title} - ${productId}`,
      url: request.loadedUrl,
      imgSrc: imgSrc,
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
