import fs from 'fs/promises';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'src/data/products.json');

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export async function getProducts(): Promise<Product[]> {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products data:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.id === id);
}

export async function saveProducts(products: Product[]): Promise<void> {
  try {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error saving products data:', error);
  }
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const products = await getProducts();
  const newProduct = { ...product, id: Date.now().toString() };
  products.push(newProduct);
  await saveProducts(products);
  return newProduct;
}

export async function updateProduct(id: string, updatedFields: Partial<Product>): Promise<Product | undefined> {
  const products = await getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return undefined;

  products[index] = { ...products[index], ...updatedFields };
  await saveProducts(products);
  return products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await getProducts();
  const filteredProducts = products.filter((p) => p.id !== id);
  if (filteredProducts.length === products.length) return false;

  await saveProducts(filteredProducts);
  return true;
}
