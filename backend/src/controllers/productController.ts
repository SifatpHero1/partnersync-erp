import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

// backend/data.json ফাইলের পাথ (src/controllers থেকে ২ লেভেল উপরে)
const dataFilePath = path.join(process.cwd(), 'data.json');

// ডেটা পড়ার ফাংশন
const readData = () => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      // ফাইল না থাকলে নতুন করে তৈরি করা
      const defaultData = { products: [], orders: [] };
      fs.writeFileSync(dataFilePath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    return { products: [], orders: [] };
  }
};

// ডেটা লেখার (সেভ করার) ফাংশন
const writeData = (data: any) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing data file:', error);
  }
};

// Admin: নতুন প্রোডাক্ট অ্যাড করা
export const addProduct = async (req: Request, res: Response) => {
  const { name, sku, price, assignedPartners } = req.body;

  try {
    const data = readData();
    const newId = data.products.length > 0 ? data.products[data.products.length - 1].id + 1 : 1;
    
    const newProduct = {
      id: newId,
      name,
      sku,
      price: Number(price),
      assignedPartners: assignedPartners ? assignedPartners.map((id: any) => Number(id)) : []
    };
    
    data.products.push(newProduct);
    writeData(data);
    
    console.log('✅ Product saved:', newProduct);
    res.status(201).json({ message: 'Product added successfully!', product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Partner: প্রোডাক্ট দেখা
export const getPartnerProducts = async (req: any, res: Response) => {
  try {
    const partnerId = req.user.id;
    console.log('🔍 Partner ID:', partnerId);
    
    const data = readData();
    console.log('📦 All products:', data.products);
    
    const products = data.products.filter((p: any) => 
      p.assignedPartners.includes(partnerId)
    );
    
    console.log('✅ Filtered products for partner:', products);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Partner: অর্ডার প্লেস করা
export const placeOrder = async (req: any, res: Response) => {
  const { product_sku, quantity } = req.body;
  const partnerId = req.user.id;

  try {
    const data = readData();
    const newId = data.orders.length > 0 ? data.orders[data.orders.length - 1].id + 1 : 1;
    
    const newOrder = {
      id: newId,
      partnerId,
      product_sku,
      quantity: Number(quantity),
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    
    data.orders.push(newOrder);
    writeData(data);
    
    res.status(201).json({ message: 'Order placed successfully!', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};