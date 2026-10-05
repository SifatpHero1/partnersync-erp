import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PartnerDashboard = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token'); // টোকেন নেওয়া
        
        const response = await fetch('http://localhost:5000/api/products/partner/products', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // টোকেন পাঠানো
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Failed to fetch:', await response.text());
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };
    fetchProducts();
  }, []);

  // যদি ইউজার না থাকে, লগইন পেজে পাঠিয়ে দেওয়া
  if (!authContext || !authContext.user) {
    navigate('/login');
    return null;
  }

  const handleOrder = async (sku: string) => {
    try {
      const token = localStorage.getItem('token'); // অর্ডারের জন্যও টোকেন প্রয়োজন
      
      const response = await fetch('http://localhost:5000/api/products/partner/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ✅ এই লাইনটি যোগ করা হয়েছে
        },
        body: JSON.stringify({ product_sku: sku, quantity: 1 }),
      });
      
      if (response.ok) {
        alert(`Order placed successfully for SKU: ${sku}`);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to place order');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Partner Product Catalog</h1>
        <button 
          onClick={() => { authContext.logout(); navigate('/login'); }} 
          className="text-red-500 hover:text-red-700 font-medium border border-red-500 px-4 py-1 rounded hover:bg-red-50 transition"
        >
          Logout
        </button>
      </div>
      
      {products.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No products assigned to you yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="border p-6 rounded-lg shadow-sm hover:shadow-md transition bg-white">
              <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
              <p className="text-sm text-gray-500 mb-2">SKU: {p.sku}</p>
              <p className="text-xl font-semibold text-blue-600 mb-4">${p.price}</p>
              <button 
                onClick={() => handleOrder(p.sku)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Request Order
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PartnerDashboard;