export default function WordPressBlock() {
  return (
    <div className="bg-gray-50 rounded shadow-sm p-4">
      <h2 className="text-lg font-medium mb-3">WordPress tools</h2>
      <p className="text-sm text-gray-600 mb-3">
        This project uses WordPress.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button className="p-3 bg-white rounded shadow-sm text-left">Pages</button>
        <button className="p-3 bg-white rounded shadow-sm text-left">Posts</button>
        <button className="p-3 bg-white rounded shadow-sm text-left">Menus</button>
        <button className="p-3 bg-white rounded shadow-sm text-left">Media</button>
      </div>
    </div>
  );
}
