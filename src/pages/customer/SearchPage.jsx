import { useState } from 'react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const SearchPage = () => {
  const [filter, setFilter] = useState({ guest: '', budget: '' });
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState([]);

  const sanitizeIntegerInput = (value) => {
    const digitsOnly = String(value).replace(/\D/g, '');
    if (!digitsOnly) return '';
    return String(Number.parseInt(digitsOnly, 10));
  };

  // Mock หรือข้อมูลสถานที่
  const allVenues = [
    { id: 1, title: 'Grand Ballroom KU Sriracha', price: 150000, capacity: 500 },
    { id: 2, title: 'Garden Wedding Suite', price: 85000, capacity: 200 },
    { id: 3, title: 'Riverside Mansion', price: 120000, capacity: 300 },
    { id: 4, title: 'Classic Hotel Ballroom', price: 75000, capacity: 150 },
    { id: 5, title: 'Luxury Beach Resort', price: 250000, capacity: 800 }
  ];

  const handleSearch = () => {
    const guest = Number.parseInt(filter.guest || '0', 10) || 0;
    const budget = Number.parseInt(filter.budget || '0', 10) || 0;

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
    <div className="space-y-8">
      <section className="im-hero">
        <div className="im-hero__grain" aria-hidden="true" />
        <div className="im-hero__content">
          <p className="im-hero__eyebrow">Wedding Discovery</p>
          <h1 className="im-hero__title">ค้นหาสถานที่จัดงานที่พอดีกับงบและจำนวนแขก</h1>
          <p className="im-hero__desc">
            ระบุจำนวนแขกและงบประมาณเพื่อคัดสถานที่ที่ใช่ที่สุดสำหรับวันสำคัญของคุณ
          </p>

          <div className="im-hero__search">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="จำนวนแขก"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={filter.guest}
                onChange={(e) => setFilter({ ...filter, guest: sanitizeIntegerInput(e.target.value) })}
                placeholder="เช่น 300"
              />
              <Input
                label="งบประมาณไม่เกิน"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={filter.budget}
                onChange={(e) => setFilter({ ...filter, budget: sanitizeIntegerInput(e.target.value) })}
                placeholder="เช่น 150000"
              />
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">&nbsp;</label>
                <Button variant="primary" onClick={handleSearch} className="w-full h-[46px]">ค้นหา</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* แสดงผลลัพธ์การค้นหา */}
      {searched && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-800">
            พบสถานที่ {results.length} แห่ง
            {filter.guest > 0 && ` (รับแขกอย่างน้อย ${filter.guest} ท่าน)`}
            {filter.budget > 0 && ` (ราคาไม่เกิน ฿${Number(filter.budget).toLocaleString()})`}
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