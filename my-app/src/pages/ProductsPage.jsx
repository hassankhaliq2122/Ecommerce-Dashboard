import React, { useState } from 'react';
import ProductCard from '../components/products/ProductCard';
import StatCard from '../components/StatCard';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import { formatCurrency, formatNumber } from '../utils/formatters';
import {
  Package,
  AlertTriangle,
  Layers,
  DollarSign,
  Search,
  PlusCircle,
  LayoutGrid,
  List,
} from 'lucide-react';

function ProductsPage({ products = [], onAddProduct, currencySymbol = '$' }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Product Form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Apparel',
    sku: '',
    price: '',
    cost: '',
    stock: '',
    image: '',
  });

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q));
    }
    return true;
  });

  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => p.stock <= 30 && p.stock > 0).length;
  const outOfStockProducts = products.filter((p) => p.stock === 0).length;
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.cost || 0) * (p.stock || 0), 0);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      alert('Please provide at least product name and price.');
      return;
    }
    const itemToAdd = {
      id: `prod-${Date.now()}`,
      name: newProduct.name,
      category: newProduct.category,
      sku: newProduct.sku || `SKU-${Math.floor(100 + Math.random() * 900)}`,
      price: Number(newProduct.price),
      cost: Number(newProduct.cost) || 0,
      stock: Number(newProduct.stock) || 10,
      rating: 5.0,
      ordersCount: 0,
      revenue: 0,
      status: Number(newProduct.stock) <= 10 ? 'Low Stock' : 'In Stock',
      image:
        newProduct.image ||
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80',
    };

    if (onAddProduct) {
      onAddProduct(itemToAdd);
    }
    setIsAddModalOpen(false);
    setNewProduct({ name: '', category: 'Apparel', sku: '', price: '', cost: '', stock: '', image: '' });
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h2 className="welcome-title">Product Inventory & Performance</h2>
          <p className="welcome-subtitle">
            Manage catalog pricing, stock levels, and item profitability
          </p>
        </div>

        <div className="header-controls">
          <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <PlusCircle size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          isCurrency={false}
          iconColor="#4f46e5"
        />
        <StatCard
          title="Low Stock Alerts"
          value={lowStockProducts}
          icon={AlertTriangle}
          isCurrency={false}
          iconColor="#f59e0b"
          iconBg="rgba(245, 158, 11, 0.1)"
        />
        <StatCard
          title="Out of Stock"
          value={outOfStockProducts}
          icon={Layers}
          isCurrency={false}
          iconColor="#e11d48"
          iconBg="rgba(225, 29, 72, 0.1)"
        />
        <StatCard
          title="Total Inventory Value"
          value={totalInventoryValue}
          icon={DollarSign}
          isCurrency={true}
          currencySymbol={currencySymbol}
          iconColor="#10b981"
          iconBg="rgba(16, 185, 129, 0.1)"
        />
      </div>

      {/* Filters & View Switcher */}
      <div className="table-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div className="table-toolbar" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '2px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.2rem', fontSize: '0.8rem', padding: '0.4rem 0.6rem 0.4rem 2.2rem' }}
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <button
                className="btn-icon"
                style={{
                  borderRadius: 0,
                  backgroundColor: viewMode === 'grid' ? 'var(--bg-subtle)' : 'var(--bg-card)',
                  color: viewMode === 'grid' ? 'var(--brand-600)' : 'var(--text-secondary)',
                }}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                className="btn-icon"
                style={{
                  borderRadius: 0,
                  backgroundColor: viewMode === 'table' ? 'var(--bg-subtle)' : 'var(--bg-card)',
                  color: viewMode === 'table' ? 'var(--brand-600)' : 'var(--text-secondary)',
                }}
                onClick={() => setViewMode('table')}
                title="Table View"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Content Display */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description="No products match your current category or search criteria."
        />
      ) : viewMode === 'grid' ? (
        <div className="products-grid">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              currencySymbol={currencySymbol}
            />
          ))}
        </div>
      ) : (
        <div className="table-card">
          <div className="table-responsive-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Unit Cost</th>
                  <th>Stock</th>
                  <th>Units Sold</th>
                  <th>Gross Revenue</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={p.image}
                          alt={p.name}
                          style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 600 }}>{p.name}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{p.sku}</span>
                    </td>
                    <td>{p.category}</td>
                    <td>
                      <strong>{formatCurrency(p.price, currencySymbol)}</strong>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-secondary)' }}>{formatCurrency(p.cost, currencySymbol)}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: p.stock <= 30 ? 'var(--amber-600)' : 'var(--emerald-600)' }}>
                        {p.stock} units
                      </span>
                    </td>
                    <td>{formatNumber(p.ordersCount)}</td>
                    <td>
                      <strong style={{ color: 'var(--brand-600)' }}>
                        {formatCurrency(p.revenue || p.price * p.ordersCount, currencySymbol)}
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Catalog Product"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
            <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="button" className="btn-primary" onClick={handleAddSubmit}>
              Create Product
            </button>
          </div>
        }
      >
        <form onSubmit={handleAddSubmit}>
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Linen Summer Shirt"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              >
                <option value="Apparel">Apparel</option>
                <option value="Footwear">Footwear</option>
                <option value="Accessories">Accessories</option>
                <option value="Watches">Watches</option>
                <option value="Electronics">Electronics</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">SKU</label>
              <input
                type="text"
                className="form-input"
                placeholder="APP-SH-007"
                value={newProduct.sku}
                onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Retail Price ({currencySymbol}) *</label>
              <input
                type="number"
                className="form-input"
                required
                min="1"
                placeholder="79"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Unit Cost ({currencySymbol})</label>
              <input
                type="number"
                className="form-input"
                min="0"
                placeholder="25"
                value={newProduct.cost}
                onChange={(e) => setNewProduct({ ...newProduct, cost: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Initial Stock Quantity</label>
            <input
              type="number"
              className="form-input"
              min="0"
              placeholder="50"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Image URL (optional)</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://..."
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ProductsPage;
