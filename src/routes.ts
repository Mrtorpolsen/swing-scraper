import { createCheerioRouter, RequestQueue } from "crawlee";

interface ProductData {
  [key: string]: string;
}

export const router = createCheerioRouter();
const base_url = ["https://www.vinci-play.com"];

router.addDefaultHandler(async ({ $, addRequests, log }) => {
  log.info(`enqueueing new URLs`);
  $(".cat-container li a").each((_, element) => {
    const $element = $(element);
    const img_src = $element.find("img").attr("src");
    const href = $element.attr("href");
    if (!href) {
      log.info("no href found - skipping...");
      return;
    }

    const url = base_url + href;
    addRequests([
      {
        url,
        label: "product",
        userData: {
          img_src,
        },
      },
    ]);
  });
});

router.addHandler("product", async ({ request, $, log, pushData }) => {
  const title = $(".product-title").first().text();
  const product_data: ProductData[] = [];

  $(".product-table tr").each((_, element) => {
    const data_name = $(element).find(".align-left").text().trim();
    const data_value = $(element).find(".align-right").text().trim();

    product_data.push({ [data_name]: data_value });
  });
  log.info(`${title}`, { url: request.loadedUrl });

  await pushData({
    url: request.loadedUrl,
    title,
    img_src: request.userData.img_src,
    product_data,
  });
});
