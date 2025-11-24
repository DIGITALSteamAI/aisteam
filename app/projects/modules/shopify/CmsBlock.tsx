export default function ShopifyBlock() {
  return (
    <div className="bg-gray-50 rounded shadow-sm p-4">
      <h2 className="text-lg font-medium mb-3">Shopify tools</h2>
      <p className="text-sm text-gray-600 mb-3">
        This project uses Shopify.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button className="p-3 bg-white rounded shadow-sm text-left">Products</button>
        <button className="p-3 bg-white rounded shadow-sm text-left">Orders</button>
        <button className="p-3 bg-white rounded shadow-sm text-left">Inventory</button>
        <button className="p-3 bg-white rounded shadow-sm text-left">Customers</button>
      </div>
    </div>
  );
}
