import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import api from '../../services/api';

const MOCK_VENUES = [
  {
    _id: 'mock-venue-001',
    name: 'Grand Blossom Hall',
    description: 'ห้องจัดเลี้ยงสไตล์หรู พร้อมเวที แสง สี เสียงครบ เหมาะกับงานแต่งขนาดใหญ่',
    guestCount: 350,
    province: 'ชลบุรี',
    pricePerSession: 180000,
    images: ['https://picsum.photos/seed/wedding-grand-ballroom/1200/800'],
  },
  {
    _id: 'mock-venue-002',
    name: 'Garden Romance Venue',
    description: 'สถานที่จัดงานกลางสวน บรรยากาศอบอุ่น เหมาะกับพิธีช่วงเย็นและงานเลี้ยงเล็กถึงกลาง',
    guestCount: 180,
    province: 'กรุงเทพมหานคร',
    pricePerSession: 95000,
    images: ['https://picsum.photos/seed/wedding-garden-venue/1200/800'],
  },
  {
    _id: 'mock-venue-003',
    name: 'Sea Breeze Wedding Space',
    description: 'โลเคชันริมทะเล วิวพระอาทิตย์ตก เหมาะกับงานแต่งแนวโมเดิร์นและงาน after party',
    guestCount: 250,
    province: 'ระยอง',
    pricePerSession: 140000,
    images: ['https://picsum.photos/seed/wedding-seaside-venue/1200/800'],
  },
  {
    _id: 'mock-venue-004',
    name: 'Classic Ivory Ballroom',
    description: 'บอลรูมโทนคลาสสิกเพดานสูง รองรับทีมช่างภาพและงานพิธีการเต็มรูปแบบ',
    guestCount: 420,
    province: 'นนทบุรี',
    pricePerSession: 220000,
    images: ['https://picsum.photos/seed/wedding-classic-hall/1200/800'],
  },
];

const SearchPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState({ guest: '', budget: '' });
  const [venues, setVenues] = useState([]);
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
        if (Array.isArray(data) && data.length > 0) {
          setVenues(data);
        } else {
          setVenues(MOCK_VENUES);
        }
      } catch (err) {
        console.error('โหลดสถานที่ไม่สำเร็จ:', err);
        setVenues(MOCK_VENUES);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  const toNumber = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };

  const getVenueGuestCount = (venue) => {
    const fallbackCapacity = Math.max(toNumber(venue.capacityBuffet), toNumber(venue.capacityChinese));
    return toNumber(venue.guestCount) || toNumber(venue.capacity) || fallbackCapacity;
  };

  const isFiltering = Boolean(filter.guest || filter.budget);

  const displayVenues = useMemo(() => {
    if (!isFiltering) return venues;

    const guestRequired = filter.guest ? Number(filter.guest) : 0;
    const budgetLimit = filter.budget ? Number(filter.budget) : 0;

    return venues.filter((venue) => {
      const venueGuestCount = getVenueGuestCount(venue);
      const price = toNumber(venue.pricePerSession);

      const guestMatch = guestRequired ? venueGuestCount >= guestRequired : true;
      const budgetMatch = budgetLimit ? price <= budgetLimit : true;

      return guestMatch && budgetMatch;
    });
  }, [venues, filter.guest, filter.budget, isFiltering]);

  const handleSearch = () => {
    if (!isFiltering) {
      setFilter({ guest: '', budget: '' });
    }
  };

  return (
    <div className="search-page">

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
      {isFiltering && (
        <div className="search-result-badge">
          พบสถานที่ <strong>{displayVenues.length} แห่ง</strong>
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
        <div className="search-venue-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {displayVenues.map((venue) => (
            <div key={venue._id} className="venue-card" onClick={() => navigate(`/booking?venueId=${venue._id}`)}>
              {(() => {
                const venueGuestCount = getVenueGuestCount(venue);

                return (
                  <>

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
                          <span> รองรับได้สูงสุด {venueGuestCount || '-'} ท่าน</span>
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
                  </>
                );
              })()}
            </div>
          ))}
        </div>
      )}

      {/* Empty states */}
      {!loading && isFiltering && displayVenues.length === 0 && (
        <div className="empty-state">
          <div className="empty-state__icon">🔍</div>
          <p className="empty-state__title">ไม่พบสถานที่ที่ตรงกับเงื่อนไข</p>
          <p className="empty-state__desc">ลองเปลี่ยนจำนวนแขกหรืองบประมาณสูงขึ้น</p>
        </div>
      )}

      {!loading && !isFiltering && venues.length === 0 && (
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