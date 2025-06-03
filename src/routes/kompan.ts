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
  const title_element = $("h1").first();
  const title = title_element.text();
  const product_id = title_element.prevAll("p").first().text().trim();
  const img_src =
    $(`img[alt="${title}"]`).attr("src") || "Image source not found";
  log.info(`${title} - ${product_id}`, { url: request.loadedUrl });

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
});
