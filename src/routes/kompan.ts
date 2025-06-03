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
    const title_element = $("h1").first();
    const title = title_element?.text()?.trim() || "Title not found";
    const product_id =
      title_element?.prevAll("p").first().text().trim() ||
      "Product ID not found";
    const img_src =
      $(`img[alt="${title}"]`).attr("src") || "Image source not found";

    const product_data: ProductData[] = [];

    const specifications_to_search = [
      "Detaljer om produktet",
      "Mål",
      "Garantier og certifikater",
      "Oplysninger om installation",
    ];
    specifications_to_search.forEach((spec) => {
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

        const data_name = nameEl?.text()?.trim() || "Data name not found";
        const data_value = valueEl?.text()?.trim() || "Data value not found";

        product_data.push({ [data_name]: data_value });
      });
    });

    const current_product = {
      company: "Kompan",
      title: `${title} - ${product_id}`,
      url: request.loadedUrl,
      img_src: img_src,
      product_data,
    };

    products.push(current_product);
    await pushData({
      company: "Kompan",
      title: `${title} - ${product_id}`,
      url: request.loadedUrl,
      img_src: img_src,
      product_data,
    });
  } catch (error) {
    log.error(`Error processing product at ${request.loadedUrl}`, { error });
  }
});
