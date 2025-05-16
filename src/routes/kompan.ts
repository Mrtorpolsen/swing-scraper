import { createCheerioRouter } from "crawlee";
import { ProductData, Product } from "../interfaces/product.js";

export const router = createCheerioRouter();
export const all_products: Product[] = [];

router.addDefaultHandler(async ({ enqueueLinks, log }) => {
  log.info(`enqueueing new URLs`);

  await enqueueLinks({
    globs: ["https://www.kompan.com/da/dk/p/**"],
    label: "product",
  });
});

router.addHandler("product", async ({ request, $, log, pushData }) => {
  const title_element = $("h1").first();
  const title = title_element.text();
  const product_id = title_element.prevAll("p").first().text().trim();
  const img_src = $(`img[alt="${title}"]`).attr("src");
  log.info(`${title} - ${product_id}`, { url: request.loadedUrl });
  console.log(img_src);

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

    container.find(".ecz3vwj0").each((_, element) => {
      const data_name = $(element).find("p").first().text().trim();
      const data_value = $(element).find("p").last().text().trim();

      product_data.push({ [data_name]: data_value });
    });
  });

  /*   const current_product = {
    title,
    url: request.loadedUrl,
    img_src: request.userData.img_src,
    product_data,
  };

  all_products.push(current_product); */
  await pushData({
    title: `${title} - ${product_id}`,
    url: request.loadedUrl,
    img_src: request.userData.img_src,
    product_data,
  });
});
