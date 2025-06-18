export interface ProductData {
  [key: string]: string;
}
export interface Product {
  company: string;
  title: string;
  url: string;
  imgSrc: string;
  productNumber: string;
  productLine: string;
  productCategory: string;
  ageGroup: string;
  minAge: string;
  numberOfUsers: string;
  inclusive: string;
  length: string;
  width: string;
  height: string;
  lengthOfSecurityZone: string;
  widthOfSecurityZone: string;
  freeFallHeight: string;
  safetyZoneM2: string;
  productData: ProductData[];
}
