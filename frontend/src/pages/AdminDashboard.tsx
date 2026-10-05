import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [partnerId, setPartnerId] = useState('2'); // ডিফল্টভাবে পার্টনার ID 2 (যেহেতু আমাদের টেস্ট পার্টনারের ID 2)

  if (!authContext || !authContext.user) {
    navigate('/login');
    return null;
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/products/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          sku, 
          price: Number(price), 
          assignedPartners: [partnerId] 
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        alert('Product added successfully!');
        setName(''); setSku(''); setPrice('');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Failed to add product');
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-600">🛡️ Admin Dashboard</h1>
        <button onClick={() => { authContext.logout(); navigate('/login'); }} className="text-red-500 font-medium">Logout</button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 mt-1 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">SKU</label>
            <input type="text" required value={sku} onChange={(e) => setSku(e.target.value)} className="w-full px-4 py-2 mt-1 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price ($)</label>
            <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-2 mt-1 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Assign to Partner ID</label>
            <input type="text" value={partnerId} onChange={(e) => setPartnerId(e.target.value)} className="w-full px-4 py-2 mt-1 border rounded-md" placeholder="e.g., 2" />
            <p className="text-xs text-gray-500 mt-1">Default is 2 (our test partner)</p>
          </div>
          <button type="submit" className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">Add Product</button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;