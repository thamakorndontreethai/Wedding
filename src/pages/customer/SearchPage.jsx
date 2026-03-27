import { useState } from 'react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const SearchPage = () => {
  const [filter, setFilter] = useState({ guest: 0, budget: 0 });
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState([]);

  // Mock หรือข้อมูลสถานที่
  const allVenues = [
    { id: 1, title: 'Grand Ballroom KU Sriracha', price: 150000, capacity: 500 },
    { id: 2, title: 'Garden Wedding Suite', price: 85000, capacity: 200 },
    { id: 3, title: 'Riverside Mansion', price: 120000, capacity: 300 },
    { id: 4, title: 'Classic Hotel Ballroom', price: 75000, capacity: 150 },
    { id: 5, title: 'Luxury Beach Resort', price: 250000, capacity: 800 }
  ];

  const handleSearch = () => {
    let guest = parseInt(filter.guest);
    let budget = parseInt(filter.budget);

    // ตรวจสอบให้เป็นตัวเลขบวกเท่านั้น
    guest = guest > 0 ? guest : 0;
    budget = budget > 0 ? budget : 0;

    // กรองสถานที่ตามเงื่อนไข
    const filtered = allVenues.filter(venue => {
      const guestMatch = guest === 0 || venue.capacity >= guest;
      const budgetMatch = budget === 0 || venue.price <= budget;
      return guestMatch && budgetMatch;
    });

    setResults(filtered);
    setSearched(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">ค้นหาสถานที่จัดงานแต่งงาน</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Input 
          label="จำนวนแขก" 
          type="number" 
          value={filter.guest}
          onChange={(e) => setFilter({...filter, guest: e.target.value})}
          min="0"
          step="1"
        />
        <Input 
          label="งบประมาณไม่เกิน" 
          type="number" 
          value={filter.budget}
          onChange={(e) => setFilter({...filter, budget: e.target.value})}
          min="0"
          step="1"
        />
        <div className="flex items-end">
          <Button variant="primary" onClick={handleSearch} className="w-full">ค้นหา</Button>
        </div>
      </div>

      {/* แสดงผลลัพธ์การค้นหา */}
      {searched && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-800">
            พบสถานที่ {results.length} แห่ง
            {filter.guest > 0 && ` (รับแขกอย่างน้อย ${filter.guest} ท่าน)`}
            {filter.budget > 0 && ` (ราคาไม่เกิน ฿${filter.budget.toLocaleString()})`}
          </p>
        </div>
      )}

      {/* รายการสถานที่ */}
      <div className="grid grid-cols-3 gap-6">
        {(searched ? results : allVenues).map(venue => (
          <Card 
            key={venue.id}
            title={venue.title} 
            price={`฿${venue.price.toLocaleString()}`}
            capacity={`${venue.capacity} ท่าน`}
          />
        ))}
      </div>

      {searched && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">ไม่พบสถานที่ที่ตรงกับเงื่อนไขของคุณ</p>
          <p className="text-gray-400 text-sm">ลองเปลี่ยนจำนวนแขกหรืองบประมาณสูงขึ้น</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;