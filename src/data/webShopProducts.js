export class ProductCategory {
  static VEGETABLES = "vegetables";
  static DAIRY = "dairy";
  static CANNED = "canned";

  static categories = [this.VEGETABLES, this.DAIRY, this.CANNED];

  static isCategory(category) {
    return this.categories.includes(category);
  }
}

const products = [
  {
    name: "Tomato",
    price: 10,
    description: "Väldigt god tomat",
    category: ProductCategory.VEGETABLES,
    id: 1,
  },
  {
    name: "Gurka",
    price: 5,
    description: "Bästa gurkan",
    category: ProductCategory.VEGETABLES,
    id: 2,
  },
  {
    name: "Tomato sauce",
    price: 29,
    description: "Prima sås",
    category: ProductCategory.VEGETABLES,
    id: 3,
  },
  {
    name: "Milk",
    price: 12,
    description: "Färsk mjölk",
    category: ProductCategory.DAIRY,
    id: 4,
  },
  {
    name: "Öl",
    price: 40,
    description: "Pripps blå",
    category: ProductCategory.CANNED,
    id: 5,
  },
];

export default products;
