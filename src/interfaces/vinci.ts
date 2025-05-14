export interface ProductData {
  [key: string]: string;
}
export interface Product {
  title: string;
  url: string;
  img_src: string;
  product_data: ProductData[];
}
