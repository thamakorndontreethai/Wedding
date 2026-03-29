import { useMemo, useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

const makeDateKey = (year, monthIndex, day) => `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const SchedulePage = () => {
  const { token, user } = useAuthStore();
  const isFoodProvider = user?.serviceType === 'food';
  const weekDays = ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'];
  const todayDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(todayDate.getFullYear(), todayDate.getMonth(), 1)
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [laborPriceInput, setLaborPriceInput] = useState('500');
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingSaving, setPricingSaving] = useState(false);
  const [pricingMessage, setPricingMessage] = useState('');
  const [pricingError, setPricingError] = useState('');
  const [unavailableDates, setUnavailableDates] = useState([
    {
      dateKey: makeDateKey(todayDate.getFullYear(), todayDate.getMonth(), 14),
      note: 'ติดงานแต่งงาน (Ballroom)',
    },
  ]);

  const currentYear = currentMonth.getFullYear();
  const currentMonthIndex = currentMonth.getMonth();
  const monthPrefix = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}`;
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const monthStartWeekday = new Date(currentYear, currentMonthIndex, 1).getDay();
  const leadingEmptyCells = (monthStartWeekday + 6) % 7;

  const unavailableMap = useMemo(() => {
    const map = new Map();
    unavailableDates.forEach((item) => {
      if (!item.dateKey?.startsWith(monthPrefix)) return;
      const [, , day] = item.dateKey.split('-');
      map.set(Number(day), item.note);
    });
    return map;
  }, [unavailableDates, monthPrefix]);

  const calendarCells = useMemo(
    () => [
      ...Array.from({ length: leadingEmptyCells }, (_, idx) => ({ key: `blank-${idx}`, isBlank: true })),
      ...Array.from({ length: daysInMonth }, (_, idx) => ({ day: idx + 1, isBlank: false })),
    ],
    [leadingEmptyCells, daysInMonth]
  );

  const currentMonthLabel = useMemo(
    () => new Intl.DateTimeFormat('th-TH', { month: 'long', year: 'numeric' }).format(currentMonth),
    [currentMonth]
  );
  const totalDays = daysInMonth;
  const unavailableCount = unavailableMap.size;
  const availableCount = totalDays - unavailableCount;

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  useEffect(() => {
    if (!token) return;
    if (isFoodProvider) {
      setPricingLoading(false);
      setPricingError('');
      setPricingMessage('');
      return;
    }

    const fetchMyPricing = async () => {
      setPricingLoading(true);
      setPricingError('');
      try {
        const { data } = await api.get('/providers/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const nextPrice = Number(data?.price);
        setLaborPriceInput(String(Number.isFinite(nextPrice) ? Math.max(0, nextPrice) : 500));
      } catch (err) {
        setPricingError(err.response?.data?.message || 'โหลดค่าค่าแรงไม่สำเร็จ');
      } finally {
        setPricingLoading(false);
      }
    };

    fetchMyPricing();
  }, [token, isFoodProvider]);

  const handleSavePricing = async () => {
    if (!token) return;
    if (isFoodProvider) {
      setPricingError('บัญชีครัวไม่สามารถตั้งค่าค่าแรงได้');
      return;
    }

    const parsedPrice = Number.parseInt(String(laborPriceInput).replace(/\D/g, ''), 10);
    const nextPrice = Number.isFinite(parsedPrice) ? parsedPrice : 0;

    setPricingSaving(true);
    setPricingError('');
    setPricingMessage('');
    try {
      await api.put(
        '/providers/me/pricing',
        { price: nextPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLaborPriceInput(String(nextPrice));
      setPricingMessage('บันทึกราคาค่าแรงสำเร็จ');
    } catch (err) {
      setPricingError(err.response?.data?.message || 'บันทึกราคาไม่สำเร็จ');
    } finally {
      setPricingSaving(false);
    }
  };

  const handleAddUnavailableDate = (event) => {
    event.preventDefault();

    const selected = new Date(date);
    if (Number.isNaN(selected.getTime())) return;

    const year = selected.getFullYear();
    const monthIndex = selected.getMonth();
    const day = selected.getDate();
    const dateKey = makeDateKey(year, monthIndex, day);
    const details = note.trim() || 'ไม่สะดวกรับงาน';

    setUnavailableDates((prev) => {
      const withoutSameDate = prev.filter((item) => item.dateKey !== dateKey);
      return [...withoutSameDate, { dateKey, note: details }];
    });

    setCurrentMonth(new Date(year, monthIndex, 1));

    setDate('');
    setNote('');
    setIsModalOpen(false);
  };

  return (
    <div className="provider-schedule">
      <section className="provider-orders__hero">
        <p className="provider-orders__eyebrow">Provider Schedule</p>
        <h1 className="provider-orders__title">จัดการตารางคิวงาน</h1>
        <p className="provider-orders__desc">เดือน {currentMonthLabel} เลือกวันไม่สะดวกรับงานและจัดคิวให้ทีมทำงานได้สะดวกขึ้น</p>

        <div className="provider-schedule__toolbar">
          <div className="provider-schedule__stats">
            <div className="provider-orders__stat-card">
              <p className="provider-orders__stat-label">ทั้งหมด</p>
              <p className="provider-orders__stat-value">{totalDays}</p>
            </div>
            <div className="provider-orders__stat-card provider-schedule__stat-card--available">
              <p className="provider-orders__stat-label">ว่างรับงาน</p>
              <p className="provider-orders__stat-value">{availableCount}</p>
            </div>
            <div className="provider-orders__stat-card provider-orders__stat-card--pending">
              <p className="provider-orders__stat-label">ไม่สะดวก</p>
              <p className="provider-orders__stat-value">{unavailableCount}</p>
            </div>
          </div>

          <Button
            variant="primary"
            className="provider-schedule__add-btn"
            onClick={() => setIsModalOpen(true)}
          >
            + เพิ่มวันที่ไม่สะดวกรับงาน
          </Button>
        </div>
      </section>

      {!isFoodProvider && (
        <section className="form-section" style={{ marginBottom: 20 }}>
          <h2 className="form-section__title">💰 ตั้งค่าค่าแรงของบัญชี {user?.serviceType || 'provider'}</h2>
          <p style={{ marginTop: -4, marginBottom: 12, color: 'var(--gray-500)', fontSize: 14 }}>
            ราคานี้จะแสดงในหน้า Booking ตอนลูกค้าเลือกผู้ให้บริการประเภทเดียวกับบัญชีของคุณ
          </p>
          <div className="provider-pricing__row">
            <div className="provider-pricing__field">
              <Input
                label="ราคาค่าแรง (บาท)"
                type="text"
                inputMode="numeric"
                value={laborPriceInput}
                onChange={(event) => setLaborPriceInput(event.target.value.replace(/\D/g, ''))}
                placeholder="เช่น 3500"
              />
            </div>
            <Button
              variant="primary"
              type="button"
              onClick={handleSavePricing}
              className="provider-pricing__save-btn"
              disabled={pricingLoading || pricingSaving}
            >
              {pricingSaving ? 'กำลังบันทึก...' : 'บันทึกราคา'}
            </Button>
          </div>
          {pricingError && (
            <p style={{ marginTop: 10, color: '#ef4444', fontSize: 14 }}>{pricingError}</p>
          )}
          {pricingMessage && (
            <p style={{ marginTop: 10, color: '#16a34a', fontSize: 13 }}>{pricingMessage}</p>
          )}
        </section>
      )}

      <div className="provider-schedule__calendar-wrap">
        <div className="provider-schedule__calendar-header">
          <button type="button" className="provider-schedule__month-btn" onClick={goToPreviousMonth} aria-label="Previous month">
            ‹
          </button>
          <h2 className="provider-schedule__month-label">{currentMonthLabel}</h2>
          <button type="button" className="provider-schedule__month-btn" onClick={goToNextMonth} aria-label="Next month">
            ›
          </button>
        </div>

        <div className="provider-schedule__legend">
          <span className="provider-schedule__legend-item provider-schedule__legend-item--available">ว่างรับงาน</span>
          <span className="provider-schedule__legend-item provider-schedule__legend-item--booked">ไม่สะดวกรับงาน</span>
        </div>

        <div className="provider-schedule__weekday-row">
          {weekDays.map((label) => (
            <div key={label} className="provider-schedule__weekday-cell">{label}</div>
          ))}
        </div>

        <div className="schedule-grid">
        {/* จำลองปฏิทินแบบง่าย */}
        {calendarCells.map((cell) => {
          if (cell.isBlank) {
            return <div key={cell.key} className="schedule-day schedule-day--blank" aria-hidden="true" />;
          }

          const day = cell.day;
          const isUnavailable = unavailableMap.has(day);
          const isToday =
            day === todayDate.getDate()
            && currentMonthIndex === todayDate.getMonth()
            && currentYear === todayDate.getFullYear();

          return (
            <div
              key={day}
              className={`schedule-day ${isUnavailable ? 'booked' : 'available'} ${isToday && !isUnavailable ? 'today' : ''}`}
            >
              <span className="provider-schedule__day-number">{day}</span>
              {isUnavailable && (
                <p className="provider-schedule__day-note">● {unavailableMap.get(day)}</p>
              )}
            </div>
          );
        })}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="เพิ่มวันที่ไม่สะดวกรับงาน"
      >
        <form className="provider-schedule__form" onSubmit={handleAddUnavailableDate}>
          <Input
            label="เลือกวันที่"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />
          <Input
            label="หมายเหตุ"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="เช่น ติดงานแต่งงาน (Ballroom)"
          />
          <div className="provider-schedule__form-actions">
            <Button
              variant="secondary"
              className="provider-schedule__cancel-btn"
              onClick={() => setIsModalOpen(false)}
              type="button"
            >
              <span className="provider-schedule__btn-icon" aria-hidden="true">✕</span>
              ยกเลิก
            </Button>
            <Button variant="primary" className="provider-schedule__save-btn" type="submit">
              <span className="provider-schedule__btn-icon" aria-hidden="true">✓</span>
              บันทึก
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SchedulePage;