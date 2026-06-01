export type Product = {
  name:        string;
  price:       number;
  description: string;
};

export const products: Product[] = [
  {
    name:        'Sauce Labs Backpack',
    price:        29.99,
    description: 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
  },
  {
    name:        'Sauce Labs Bike Light',
    price:        9.99,
    description: "A red light isn't the desired state in testing but it sure helps when riding",
  },
  {
    name:        'Sauce Labs Bolt T-Shirt',
    price:        15.99,
    description: 'Get your testing superhero on with the Sauce Labs bolt T-shirt',
  },
  {
    name:        'Sauce Labs Fleece Jacket',
    price:        49.99,
    description: "It's not every day that you come across a midweight quarter-zip fleece jacket",
  },
  {
    name:        'Sauce Labs Onesie',
    price:        7.99,
    description: 'Rib snap infant onesie for the junior automation engineer in development',
  },
  {
    name:        'Test.allTheThings() T-Shirt (Red)',
    price:        15.99,
    description: 'This classic Sauce Labs t-shirt is perfect to wear when cozying up',
  },
];

export const TOTAL_PRODUCTS = products.length;

export const sortOptions = [
  { label: 'Name (A to Z)', option: 'az'   as const },
  { label: 'Name (Z to A)', option: 'za'   as const },
  { label: 'Price (low to high)', option: 'lohi' as const },
  { label: 'Price (high to low)', option: 'hilo' as const },
];