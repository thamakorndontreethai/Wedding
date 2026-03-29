import { useMemo, useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

const SchedulePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [unavailableDates, setUnavailableDates] = useState([
    { day: 14, note: 'ติดงานแต่งงาน (Ballroom)' },
  ]);

  const unavailableMap = useMemo(() => {
    const map = new Map();
    unavailableDates.forEach((item) => {
      map.set(item.day, item.note);
    });
    return map;
  }, [unavailableDates]);

  const currentMonthLabel = useMemo(
    () => new Intl.DateTimeFormat('th-TH', { month: 'long', year: 'numeric' }).format(new Date()),
    []
  );

  const handleAddUnavailableDate = (event) => {
    event.preventDefault();

    const selected = new Date(date);
    if (Number.isNaN(selected.getTime())) return;

    const day = selected.getDate();
    const details = note.trim() || 'ไม่สะดวกรับงาน';

    setUnavailableDates((prev) => {
      const withoutSameDay = prev.filter((item) => item.day !== day);
      return [...withoutSameDay, { day, note: details }];
    });

    setDate('');
    setNote('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">จัดการตารางคิวงาน</h1>
          <h2 className="text-sm text-gray-500 mt-1">เดือน {currentMonthLabel}</h2>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>+ เพิ่มวันที่ไม่สะดวกรับงาน</Button>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {/* จำลองปฏิทินแบบง่าย */}
        {[...Array(31)].map((_, i) => (
          <div
            key={i}
            className={`h-24 border rounded-lg p-2 ${unavailableMap.has(i + 1) ? 'bg-red-50 border-red-200' : 'bg-white'}`}
          >
            <span className="text-sm font-bold">{i + 1}</span>
            {unavailableMap.has(i + 1) && (
              <p className="text-[10px] text-red-600 mt-2">● {unavailableMap.get(i + 1)}</p>
            )}
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="เพิ่มวันที่ไม่สะดวกรับงาน"
      >
        <form onSubmit={handleAddUnavailableDate}>
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
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button variant="primary" type="submit">
              บันทึก
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SchedulePage;