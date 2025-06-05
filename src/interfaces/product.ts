export interface ProductData {
  [key: string]: string;
}
export interface Product {
  company: string;
  title: string;
  url: string;
  imgSrc: string;
  productData: ProductData[];
}
