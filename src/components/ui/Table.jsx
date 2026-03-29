import '../../index.css';
const Table = ({ headers, data }) => (
  <div className="overflow-x-auto rounded-lg border border-gray-200">
    <table className="w-full text-left bg-white">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>{headers.map((h, i) => <th key={i} className="px-6 py-3 text-sm font-semibold">{h}</th>)}</tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((row, i) => (
          <tr key={i} className="hover:bg-gray-50">
            {row.map((cell, j) => <td key={j} className="px-6 py-4 text-sm">{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
export default Table;