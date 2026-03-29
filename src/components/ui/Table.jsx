import '../../index.css';
const Table = ({ headers, data, variant = 'default' }) => (
  <div className={`table-shell ${variant === 'pink' ? 'table-shell--pink' : ''}`}>
    <table className="table-base">
      <thead className="table-head">
        <tr>{headers.map((h, i) => <th key={i} className="table-th">{h}</th>)}</tr>
      </thead>
      <tbody className="table-body">
        {data.map((row, i) => (
          <tr key={i} className="table-row">
            {row.map((cell, j) => <td key={j} className="table-td">{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
export default Table;