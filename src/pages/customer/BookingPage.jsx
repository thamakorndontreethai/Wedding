import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

const MEAL_OPTIONS = [
  { id: 'buffet', icon: '🍽️', title: 'บุฟเฟต์', desc: 'อาหารบุฟเฟต์หลากหลาย เลือกได้ตามใจ', pricePerHead: 450 },
  { id: 'chinese', icon: '🥢', title: 'โต๊ะจีน', desc: 'อาหารจีนมงคล เสิร์ฟครบ 10 คอร์ส', pricePerHead: 600 },
];

const FIXED_ADDONS = [
  { id: 'mc', icon: '🎤', title: 'พิธีกร (MC)', desc: 'พิธีกรมืออาชีพดำเนินงานตลอดงาน', price: 8000 },
  { id: 'flower', icon: '💐', title: 'จัดดอกไม้', desc: 'ตกแต่งสถานที่ด้วยดอกไม้สดทุกจุด', price: 20000 },
  { id: 'cake', icon: '🎂', title: 'เค้กแต่งงาน', desc: 'เค้กแต่งงาน 5 ชั้น Custom', price: 5000 },
  { id: 'makeup', icon: '💄', title: 'ช่างแต่งหน้า', desc: 'แต่งหน้าเจ้าสาว + เพื่อน 4 คน', price: 10000 },
  { id: 'invite', icon: '💌', title: 'การ์ดเชิญ', desc: 'การ์ดเชิญ Premium พิมพ์ 200 ใบ', price: 3000 },
  { id: 'dj', icon: '🎧', title: 'DJ', desc: 'DJ เปิดเพลงสลับวงดนตรีตลอดคืน', price: 6000 },
  { id: 'screen', icon: '📽️', title: 'จอ LED + Slideshow', desc: 'จอใหญ่ฉาย Slideshow คู่บ่าวสาว', price: 8000 },
  { id: 'photo_booth', icon: '🤳', title: 'Photo Booth', desc: 'บูธถ่ายรูปพร้อมอุปกรณ์ Props', price: 5000 },
];

// Component เลือก Provider
const ProviderSelector = ({ title, icon, providers, selected, onSelect }) => (
  <div className="form-section">
    <h2 className="form-section__title">{icon} {title}</h2>

    {providers.length === 0 ? (
      <div style={{
        padding: 20, textAlign: 'center',
        background: 'var(--gray-50)', borderRadius: 12,
        color: 'var(--gray-400)', fontSize: 14
      }}>
        ยังไม่มี{title}ในระบบ
      </div>
    ) : (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        {/* ไม่เลือก */}
        <div onClick={() => onSelect(null)}
          style={{
            padding: 16, borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s',
            border: `2px solid ${!selected ? 'var(--pink)' : 'var(--gray-100)'}`,
            background: !selected ? 'var(--pink-bg)' : 'white',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
          <div style={{ fontSize: 28 }}>🚫</div>
          <div style={{ fontWeight: 600, fontSize: 14, color: !selected ? 'var(--pink)' : 'var(--gray-400)' }}>
            ไม่เลือก{title}
          </div>
        </div>

        {/* Provider cards */}
        {providers.map(p => (
          <div key={p._id} onClick={() => onSelect(p)}
            style={{
              padding: 16, borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s',
              border: `2px solid ${selected?._id === p._id ? 'var(--pink)' : 'var(--gray-100)'}`,
              background: selected?._id === p._id ? 'var(--pink-bg)' : 'white',
              position: 'relative',
            }}>

            {/* Checkmark */}
            {selected?._id === p._id && (
              <div style={{
                position: 'absolute', top: 10, right: 10,
                background: 'var(--pink)', color: 'white',
                width: 22, height: 22, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
              }}>✓</div>
            )}

            {/* Avatar */}
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--pink-light), var(--pink))',
              color: 'white', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 800, fontSize: 18,
              marginBottom: 10,
            }}>
              {p.firstName?.charAt(0).toUpperCase()}
            </div>

            <div style={{ fontWeight: 700, fontSize: 14, color: selected?._id === p._id ? 'var(--pink)' : 'var(--gray-900)', marginBottom: 2 }}>
              {p.firstName} {p.lastName}
            </div>
            <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 4 }}>
              📞 {p.phone || '-'}
            </div>
            {p.maxGuests > 0 && (
              <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 6 }}>
                👥 รับได้สูงสุด {p.maxGuests} คน
              </div>
            )}
            <div style={{ fontWeight: 800, color: 'var(--pink)', fontSize: 15 }}>
              +฿{(p.price || 0).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const BookingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const venueId = searchParams.get('venueId');

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [photoProviders, setPhotoProviders] = useState([]);
  const [musicProviders, setMusicProviders] = useState([]);

  const [mealType, setMealType] = useState('buffet');
  const [guestCount, setGuestCount] = useState(100);
  const [eventDate, setEventDate] = useState('');
  const [addons, setAddons] = useState([]);
  const [notes, setNotes] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedMusic, setSelectedMusic] = useState(null);

  useEffect(() => {
    if (!venueId) return;
    Promise.all([
      api.get(`/venues/${venueId}`),
      api.get('/providers?serviceType=photo'),
      api.get('/providers?serviceType=music'),
    ]).then(([venueRes, photoRes, musicRes]) => {
      setVenue(venueRes.data);
      setPhotoProviders(photoRes.data);
      setMusicProviders(musicRes.data);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [venueId]);

  const toggleAddon = (id) =>
    setAddons(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);

  const selectedMeal = MEAL_OPTIONS.find(m => m.id === mealType);
  const mealPrice = (selectedMeal?.pricePerHead || 0) * guestCount;
  const venuePrice = venue?.pricePerSession || 0;
  const addonPrice = FIXED_ADDONS.filter(a => addons.includes(a.id)).reduce((s, a) => s + a.price, 0);
  const photoPrice = selectedPhoto?.price || 0;
  const musicPrice = selectedMusic?.price || 0;
  const totalPrice = venuePrice + mealPrice + addonPrice + photoPrice + musicPrice;
  const depositAmount = Math.round(totalPrice * 0.3);

  const handleSubmit = async () => {
    if (!eventDate) return alert('กรุณาเลือกวันจัดงาน');
    if (guestCount < 10) return alert('จำนวนแขกต้องมีอย่างน้อย 10 คน');
    setSubmitting(true);
    try {
      await api.post('/bookings', {
        venueId,
        packageId: venueId,
        eventDate,
        guestCount,
        mealType,
        addPhoto: !!selectedPhoto,
        addMusic: !!selectedMusic,
        photoProviderId: selectedPhoto?._id || null,
        musicProviderId: selectedMusic?._id || null,
        totalPrice,
        depositAmount,
        remainingAmount: totalPrice - depositAmount,
        notes,
      });
      alert('จองสำเร็จ! กรุณาชำระเงินมัดจำ');
      navigate('/my-bookings');
    } catch (err) {
      alert(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="loading-state">
      <div className="loading-dots"><span /><span /><span /></div>
      <p style={{ color: 'var(--gray-400)', marginTop: 16 }}>กำลังโหลด...</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>

      {/* Header */}
      <div className="booking-header">
        <div className="booking-header__icon">💍</div>
        <div>
          <h1 className="booking-header__title">{venue?.name}</h1>
          <p className="booking-header__sub">
            📍 {venue?.province} · บุฟเฟต์ {venue?.capacityBuffet} ท่าน / โต๊ะจีน {venue?.capacityChinese} ท่าน
          </p>
        </div>
      </div>

      {/* Step 1 - วันและแขก */}
      <div className="form-section">
        <h2 className="form-section__title">📅 วันจัดงานและจำนวนแขก</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label className="form-label">วันจัดงาน</label>
            <input type="date" className="form-input"
              value={eventDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setEventDate(e.target.value)} />
          </div>
          <div>
            <label className="form-label">จำนวนแขก (คน)</label>
            <input type="number" className="form-input"
              value={guestCount} min={10}
              onChange={e => setGuestCount(Number(e.target.value))} />
          </div>
        </div>
      </div>

      {/* Step 2 - อาหาร */}
      <div className="form-section">
        <h2 className="form-section__title">🍽️ รูปแบบอาหาร</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {MEAL_OPTIONS.map(meal => (
            <div key={meal.id} onClick={() => setMealType(meal.id)}
              style={{
                padding: 20, borderRadius: 16, cursor: 'pointer', transition: 'all 0.2s',
                border: `2px solid ${mealType === meal.id ? 'var(--pink)' : 'var(--gray-100)'}`,
                background: mealType === meal.id ? 'var(--pink-bg)' : 'white',
              }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{meal.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: mealType === meal.id ? 'var(--pink)' : 'var(--gray-900)', marginBottom: 4 }}>
                {meal.title}
              </div>
              <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 8 }}>{meal.desc}</div>
              <div style={{ fontWeight: 700, color: 'var(--pink)', fontSize: 14 }}>
                ฿{meal.pricePerHead.toLocaleString()} / คน
              </div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 4, fontWeight: 600 }}>
                รวม {guestCount} คน = ฿{(meal.pricePerHead * guestCount).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 3 - ช่างภาพจาก DB */}
      <ProviderSelector
        title="ช่างภาพ"
        icon="📸"
        providers={photoProviders}
        selected={selectedPhoto}
        onSelect={setSelectedPhoto}
      />

      {/* Step 4 - วงดนตรีจาก DB */}
      <ProviderSelector
        title="วงดนตรี"
        icon="🎵"
        providers={musicProviders}
        selected={selectedMusic}
        onSelect={setSelectedMusic}
      />

      {/* Step 5 - บริการเสริม */}
      <div className="form-section">
        <h2 className="form-section__title">✨ บริการเสริม</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {FIXED_ADDONS.map(service => {
            const selected = addons.includes(service.id);
            return (
              <div key={service.id} onClick={() => toggleAddon(service.id)}
                style={{
                  padding: 16, borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s',
                  border: `2px solid ${selected ? 'var(--pink)' : 'var(--gray-100)'}`,
                  background: selected ? 'var(--pink-bg)' : 'white',
                  position: 'relative',
                }}>
                {selected && (
                  <div style={{
                    position: 'absolute', top: 10, right: 10,
                    background: 'var(--pink)', color: 'white',
                    width: 22, height: 22, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700,
                  }}>✓</div>
                )}
                <div style={{ fontSize: 28, marginBottom: 6 }}>{service.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: selected ? 'var(--pink)' : 'var(--gray-900)', marginBottom: 4 }}>
                  {service.title}
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 8, lineHeight: 1.4 }}>
                  {service.desc}
                </div>
                <div style={{ fontWeight: 800, color: 'var(--pink)', fontSize: 15 }}>
                  +฿{service.price.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 6 - หมายเหตุ */}
      <div className="form-section">
        <h2 className="form-section__title">📝 หมายเหตุเพิ่มเติม</h2>
        <textarea className="form-input" rows={3}
          placeholder="ความต้องการพิเศษ เช่น ธีมสีงาน, อาหารสำหรับผู้แพ้อาหาร ฯลฯ"
          value={notes} onChange={e => setNotes(e.target.value)}
          style={{ resize: 'vertical' }} />
      </div>

      {/* Price Summary */}
      <div className="price-summary" style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 800, fontSize: 16, color: 'var(--gray-900)', marginBottom: 16 }}>
          💰 สรุปค่าใช้จ่าย
        </h2>
        <div className="price-summary__row">
          <span>🏛️ ค่าสถานที่</span>
          <span>฿{venuePrice.toLocaleString()}</span>
        </div>
        <div className="price-summary__row">
          <span>🍽️ {selectedMeal?.title} × {guestCount} คน</span>
          <span>฿{mealPrice.toLocaleString()}</span>
        </div>
        {selectedPhoto && (
          <div className="price-summary__row">
            <span>📸 {selectedPhoto.firstName} {selectedPhoto.lastName}</span>
            <span>฿{(selectedPhoto.price || 0).toLocaleString()}</span>
          </div>
        )}
        {selectedMusic && (
          <div className="price-summary__row">
            <span>🎵 {selectedMusic.firstName} {selectedMusic.lastName}</span>
            <span>฿{(selectedMusic.price || 0).toLocaleString()}</span>
          </div>
        )}
        {FIXED_ADDONS.filter(a => addons.includes(a.id)).map(a => (
          <div key={a.id} className="price-summary__row">
            <span>{a.icon} {a.title}</span>
            <span>฿{a.price.toLocaleString()}</span>
          </div>
        ))}
        <div className="price-summary__total">
          <span>ยอดรวมทั้งหมด</span>
          <span>฿{totalPrice.toLocaleString()}</span>
        </div>
        <div style={{ marginTop: 12, padding: '12px 0', borderTop: '1px dashed var(--pink-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--gray-500)' }}>
            <span>💳 มัดจำงวดที่ 1 (30%)</span>
            <span style={{ fontWeight: 700, color: 'var(--pink)' }}>฿{depositAmount.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>
            <span>💳 ยอดคงเหลือ (70%)</span>
            <span>฿{(totalPrice - depositAmount).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Submit */}
      <button onClick={handleSubmit} disabled={submitting || !eventDate}
        style={{
          width: '100%', padding: 18,
          background: submitting || !eventDate
            ? 'var(--gray-100)'
            : 'linear-gradient(135deg, #f9a8c9, #ec4899)',
          color: submitting || !eventDate ? 'var(--gray-400)' : 'white',
          border: 'none', borderRadius: 16,
          fontSize: 16, fontWeight: 800,
          cursor: submitting || !eventDate ? 'not-allowed' : 'pointer',
          boxShadow: submitting || !eventDate ? 'none' : '0 6px 20px rgba(236,72,153,0.35)',
          transition: 'all 0.2s', marginBottom: 32,
        }}>
        {submitting ? '⏳ กำลังจอง...' : !eventDate ? 'กรุณาเลือกวันจัดงานก่อน' : '💍 ยืนยันการจอง'}
      </button>

    </div>
  );
};

export default BookingPage;