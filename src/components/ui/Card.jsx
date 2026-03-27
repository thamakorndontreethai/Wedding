const Card = ({ title, children, footer, price, capacity }) => (
  <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-pink-300 cursor-pointer group">
    <div className="p-6 border-b border-gray-100 group-hover:bg-gradient-to-r group-hover:from-pink-50 group-hover:to-transparent transition-all">
      <h3 className="font-bold text-lg text-gray-900 group-hover:text-pink-600 transition-colors">{title}</h3>
    </div>
    <div className="p-6 space-y-4">
      {children && <div className="text-gray-600">{children}</div>}
      {(price || capacity) && (
        <div className="space-y-2">
          {price && <div className="text-xl font-bold text-pink-600">{price}</div>}
          {capacity && <div className="text-sm text-gray-500">รับแขก: {capacity}</div>}
        </div>
      )}
    </div>
    {footer && (
      <div className="p-4 bg-gradient-to-r from-gray-50 to-transparent border-t border-gray-100 group-hover:from-pink-50 transition-all">
        {footer}
      </div>
    )}
  </div>
);
export default Card;