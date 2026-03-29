import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import api from '../../services/api';

const SearchPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState({ guest: '', budget: '' });
  const [venues, setVenues] = useState([]);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(true);

  const sanitizeIntegerInput = (value) => {
    const digitsOnly = String(value).replace(/\D/g, '');
    if (!digitsOnly) return '';
    return String(Number.parseInt(digitsOnly, 10));
  };

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const { data } = await api.get('/venues');
        setVenues(data);
      } catch (err) {
        console.error('โหลดสถานที่ไม่สำเร็จ:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.guest) params.guestCount = filter.guest;
      if (filter.budget) params.budget = filter.budget;
      const { data } = await api.get('/venues', { params });
      setResults(data);
      setSearched(true);
    } catch (err) {
      console.error('ค้นหาไม่สำเร็จ:', err);
    } finally {
      setLoading(false);
    }
  };

  const displayVenues = searched ? results : venues;

  return (
    <div className="space-y-8">

      {/* Hero */}
      <section className="im-hero">
        <div className="im-hero__grain" aria-hidden="true" />
        <div className="im-hero__content">
          <p className="im-hero__eyebrow">✨ Wedding Discovery</p>
          <h1 className="im-hero__title">ค้นหาสถานที่จัดงานที่พอดีกับงบและจำนวนแขก</h1>
          <p className="im-hero__desc">
            ระบุจำนวนแขกและงบประมาณเพื่อคัดสถานที่ที่ใช่ที่สุดสำหรับวันสำคัญของคุณ
          </p>

          <div className="im-hero__search">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <Input label="จำนวนแขก" type="text" inputMode="numeric"
                value={filter.guest} placeholder="เช่น 300"
                onChange={(e) => setFilter({ ...filter, guest: sanitizeIntegerInput(e.target.value) })} />
              <Input label="งบประมาณไม่เกิน (บาท)" type="text" inputMode="numeric"
                value={filter.budget} placeholder="เช่น 150000"
                onChange={(e) => setFilter({ ...filter, budget: sanitizeIntegerInput(e.target.value) })} />
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1.5">&nbsp;</label>
                <Button variant="primary" onClick={handleSearch} className="w-full h-[46px]">
                  🔍 ค้นหา
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Result badge */}
      {searched && (
        <div className="search-result-badge">
          พบสถานที่ <strong>{results.length} แห่ง</strong>
          {filter.guest && ` · รับแขกอย่างน้อย ${filter.guest} ท่าน`}
          {filter.budget && ` · ราคาไม่เกิน ฿${Number(filter.budget).toLocaleString()}`}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="loading-state">
          <div className="loading-dots">
            <span /><span /><span />
          </div>
          <p style={{ color: '#9ca3af', marginTop: 16 }}>กำลังโหลดสถานที่...</p>
        </div>
      )}

      {/* Venue grid */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {displayVenues.map((venue) => (
            <div key={venue._id} className="venue-card"
              onClick={() => navigate(`/booking?venueId=${venue._id}`)}>

              <div className="venue-card__image">
                {venue.images?.[0]
                  ? <img src={venue.images[0]} alt={venue.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : '🏛️'}
              </div>

              <div className="venue-card__body">
                <h3 className="venue-card__title">{venue.name}</h3>
                {venue.description && (
                  <p className="venue-card__desc">{venue.description}</p>
                )}
                <div className="venue-card__meta">
                  <div className="venue-card__meta-item">
                    <span>👥</span>
                    <span>บุฟเฟต์ {venue.capacityBuffet} ท่าน / โต๊ะจีน {venue.capacityChinese} ท่าน</span>
                  </div>
                  <div className="venue-card__meta-item">
                    <span>📍</span>
                    <span>{venue.province}</span>
                  </div>
                </div>
                <div className="venue-card__price">
                  ฿{venue.pricePerSession?.toLocaleString() ?? '-'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty states */}
      {!loading && searched && results.length === 0 && (
        <div className="empty-state">
          <div className="empty-state__icon">🔍</div>
          <p className="empty-state__title">ไม่พบสถานที่ที่ตรงกับเงื่อนไข</p>
          <p className="empty-state__desc">ลองเปลี่ยนจำนวนแขกหรืองบประมาณสูงขึ้น</p>
        </div>
      )}

      {!loading && !searched && venues.length === 0 && (
        <div className="empty-state">
          <div className="empty-state__icon">🏛️</div>
          <p className="empty-state__title">ยังไม่มีสถานที่ในระบบ</p>
          <p className="empty-state__desc">กรุณาติดต่อผู้ดูแลระบบเพื่อเพิ่มสถานที่</p>
        </div>
      )}

    </div>
  );
};

export default SearchPage;