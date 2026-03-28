import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, ShoppingBag, DollarSign, Trash2, Edit, AlertCircle, X, Plus, Image as ImageIcon } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    original_price: '',
    rating: '',
    stock: '',
    short_description: '',
    image: '',
    category: '',
    is_featured: false,
    is_exclusive: false
  });
  const getApi= async()=>{}

 
  const stats = {
    totalUsers: 1234,
    totalOrders: 789,
    totalProducts: 456,
    revenue: 98765
  };

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', orders: 5, joined: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', orders: 8, joined: '2024-02-01' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', orders: 3, joined: '2024-02-15' },
    
  ];

  const orders = [
    { id: 'ORD001', user: 'John Doe', total: 129.99, status: 'Delivered', date: '2024-03-10' },
    { id: 'ORD002', user: 'Jane Smith', total: 89.99, status: 'Processing', date: '2024-03-09' },
    { id: 'ORD003', user: 'Bob Johnson', total: 199.99, status: 'Shipped', date: '2024-03-08' },
    // Add more orders...
  ];

  const products = [
    {
        "id": 23,
        "name": "Instant Coffee Maker",
        "price": "59.99",
        "original_price": "79.99",
        "rating": "4.10",
        "stock": 70,
        "short_description": "Compact instant coffee maker",
        "image": "https://images.unsplash.com/photo-1517686469429-5a4c6b4f3f6e?w=500",
        "category": "Kitchen",
        "is_featured": false,
        "is_exclusive": false
    },
    {
        "id": 26,
        "name": "Smart Light Bulb",
        "price": "19.99",
        "original_price": "29.99",
        "rating": "4.00",
        "stock": 200,
        "short_description": "Color-changing smart LED bulb",
        "image": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500",
        "category": "Smart Home",
        "is_featured": false,
        "is_exclusive": false
    },
    {
        "id": 21,
        "name": "Bluetooth Keyboard",
        "price": "39.99",
        "original_price": "49.99",
        "rating": "4.00",
        "stock": 120,
        "short_description": "Slim wireless Bluetooth keyboard",
        "image": "https://images.unsplash.com/photo-1509475826633-fed577a2c71b?w=500",
        "category": "Computers",
        "is_featured": false,
        "is_exclusive": false
    },
    {
        "id": 22,
        "name": "Robot Vacuum Cleaner",
        "price": "299.99",
        "original_price": "349.99",
        "rating": "4.50",
        "stock": 25,
        "short_description": "Smart robot vacuum cleaner",
        "image": "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=500",
        "category": "Home Appliances",
        "is_featured": true,
        "is_exclusive": false
    },
    {
        "id": 24,
        "name": "Fitness Tracker Band",
        "price": "49.99",
        "original_price": "69.99",
        "rating": "4.20",
        "stock": 110,
        "short_description": "Waterproof fitness tracker band",
        "image": "https://images.unsplash.com/photo-1526401485004-b3db24f29755?w=500",
        "category": "Wearables",
        "is_featured": true,
        "is_exclusive": false
    },
    {
        "id": 25,
        "name": "Electric Kettle",
        "price": "39.99",
        "original_price": "49.99",
        "rating": "4.30",
        "stock": 90,
        "short_description": "Fast-boiling electric kettle",
        "image": "https://images.unsplash.com/photo-1506089676908-3592f7389d4d?w=500",
        "category": "Kitchen",
        "is_featured": false,
        "is_exclusive": false
    },
    {
        "id": 20,
        "name": "4K Action Camera",
        "price": "199.99",
        "original_price": "249.99",
        "rating": "4.40",
        "stock": 30,
        "short_description": "Compact 4K waterproof action camera",
        "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500",
        "category": "Photography",
        "is_featured": true,
        "is_exclusive": false
    },
    {
        "id": 16,
        "name": "Wireless Charging Pad",
        "price": "29.99",
        "original_price": "39.99",
        "rating": "4.10",
        "stock": 180,
        "short_description": "Fast wireless charging pad",
        "image": "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?w=500",
        "category": "Accessories",
        "is_featured": false,
        "is_exclusive": false
    },
    {
        "id": 17,
        "name": "Portable SSD 1TB",
        "price": "149.99",
        "original_price": "179.99",
        "rating": "4.80",
        "stock": 90,
        "short_description": "High-speed portable SSD 1TB",
        "image": "https://images.unsplash.com/photo-1555617117-08ebae081ddb?w=500",
        "category": "Computers",
        "is_featured": true,
        "is_exclusive": false
    },
    {
        "id": 18,
        "name": "Smart Home Hub",
        "price": "99.99",
        "original_price": "129.99",
        "rating": "4.30",
        "stock": 40,
        "short_description": "Smart home central hub",
        "image": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500",
        "category": "Smart Home",
        "is_featured": true,
        "is_exclusive": false
    },
    {
        "id": 19,
        "name": "Gaming Mouse",
        "price": "49.99",
        "original_price": "59.99",
        "rating": "4.60",
        "stock": 150,
        "short_description": "Ergonomic gaming mouse with RGB",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
        "category": "Computers",
        "is_featured": false,
        "is_exclusive": false
    },
    {
        "id": 27,
        "name": "Wireless Earbuds Pro",
        "price": "149.99",
        "original_price": "179.99",
        "rating": "4.70",
        "stock": 80,
        "short_description": "True wireless earbuds with noise isolation",
        "image": "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500",
        "category": "Audio",
        "is_featured": true,
        "is_exclusive": true
    }
]

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const handleProductAction = (product, action) => {
    if (action === 'edit') {
      setSelectedProduct(product);
      setEditForm({
        name: product.name,
        price: product.price,
        original_price: product.original_price,
        rating: product.rating,
        stock: product.stock,
        short_description: product.short_description,
        image: product.image,
        category: product.category,
        is_featured: product.is_featured,
        is_exclusive: product.is_exclusive
      });
      setIsModalOpen(true);
    } else if (action === 'add') {
      setSelectedProduct(null);
      setEditForm({
        name: '',
        price: '',
        original_price: '',
        rating: '0.00',
        stock: '',
        short_description: '',
        image: '',
        category: '',
        is_featured: false,
        is_exclusive: false
      });
      setIsModalOpen(true);
    } else if (action === 'delete') {
      if (window.confirm('Are you sure you want to delete this product?')) {
        // Here you would typically make an API call to delete the product
        console.log('Deleting product:', product.id);
      }
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to update the product
    if (selectedProduct) {
      console.log('Updating product:', selectedProduct.id, editForm);
    } else {
      console.log('Adding new product:', editForm);
    }
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Mobile Access Restricted
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please use a desktop computer to access the admin dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <User className="w-10 h-10 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <ShoppingBag className="w-10 h-10 text-green-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <Package className="w-10 h-10 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Products</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProducts}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <DollarSign className="w-10 h-10 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.revenue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Users</h2>
            <div className="overflow-auto max-h-[400px]">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map(user => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.orders}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Latest Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Latest Orders</h2>
            <div className="overflow-auto max-h-[400px]">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{order.user}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${order.total}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Products List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Products</h2>
              <button
                onClick={() => handleProductAction(null, 'add')}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Product
              </button>
            </div>
            <div className="overflow-auto max-h-[400px]">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Original</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {products.map(product => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {product.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <ImageIcon className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                        <div className="truncate">
                          {product.short_description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ${product.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        ${product.original_price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {product.rating} / 5
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {product.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col space-y-1">
                          {product.is_featured && (
                            <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                              Featured
                            </span>
                          )}
                          {product.is_exclusive && (
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              Exclusive
                            </span>
                          )}
                          {!product.is_featured && !product.is_exclusive && (
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              Standard
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleProductAction(product, 'edit')}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleProductAction(product, 'delete')}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Edit/Add Product Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Image Preview */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Product Image
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="relative w-32 h-32 border-2 border-dashed rounded-lg overflow-hidden">
                        {editForm.image ? (
                          <img
                            src={editForm.image}
                            alt="Product preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-gray-50 dark:bg-gray-700">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        name="image"
                        value={editForm.image}
                        onChange={handleInputChange}
                        placeholder="Enter image URL"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category *
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={editForm.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Price *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={editForm.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Original Price
                    </label>
                    <input
                      type="number"
                      name="original_price"
                      value={editForm.original_price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Rating
                    </label>
                    <input
                      type="number"
                      name="rating"
                      value={editForm.rating}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      max="5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Stock *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={editForm.stock}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Short Description
                    </label>
                    <textarea
                      name="short_description"
                      value={editForm.short_description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_featured"
                        checked={editForm.is_featured}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Featured</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_exclusive"
                        checked={editForm.is_exclusive}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Exclusive</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {selectedProduct ? 'Save Changes' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 