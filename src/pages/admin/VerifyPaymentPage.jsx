import { useEffect, useState } from 'react';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';

const STORAGE_KEY = 'mockSubmittedPayments';
const DEFAULT_PAYMENT_IDS = new Set(['PAY001', 'PAY002']);

const readSubmittedPayments = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const VerifyPaymentPage = () => {
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [payments, setPayments] = useState([
    {
      id: 'PAY001',
      customer: 'สมชาย',
      amount: 50000,
      status: 'pending',
      slipUrl: 'https://thunder.in.th/wp-content/uploads/2024/06/%E0%B8%AA%E0%B8%A5%E0%B8%B4%E0%B8%9B%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99.webp',
    },
    {
      id: 'PAY002',
      customer: 'สมศรี',
      amount: 30000,
      status: 'verified',
      slipUrl: 'https://thunder.in.th/wp-content/uploads/2024/06/%E0%B8%AA%E0%B8%A5%E0%B8%B4%E0%B8%9B%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99.webp',
    }
  ]);

  useEffect(() => {
    const submittedPayments = readSubmittedPayments();
    if (submittedPayments.length > 0) {
      setPayments((prev) => [...submittedPayments, ...prev]);
    }
  }, []);

  const syncSubmittedPayments = (nextPayments) => {
    const submittedOnly = nextPayments.filter((payment) => !DEFAULT_PAYMENT_IDS.has(payment.id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submittedOnly));
  };

  const handleViewSlip = (payment) => {
    if (!payment.slipUrl) return;
    setSelectedSlip(payment);
  };

  const handleStatusChange = (paymentId, status) => {
    setPayments((prev) => {
      const next = prev.map((payment) => (
        payment.id === paymentId ? { ...payment, status } : payment
      ));
      syncSubmittedPayments(next);
      return next;
    });

    setSelectedSlip((prev) => (prev?.id === paymentId ? { ...prev, status } : prev));
  };

  const handleDeleteEvidence = (paymentId) => {
    const shouldDelete = window.confirm('ต้องการลบหลักฐานรายการนี้ใช่หรือไม่?');
    if (!shouldDelete) return;

    setPayments((prev) => {
      const next = prev.filter((payment) => payment.id !== paymentId);
      syncSubmittedPayments(next);
      return next;
    });

    if (selectedSlip?.id === paymentId) {
      setSelectedSlip(null);
    }
  };

  const pendingCount = payments.filter((payment) => payment.status === 'pending').length;
  const verifiedCount = payments.filter((payment) => payment.status === 'verified').length;

  return (
    <div className="space-y-6">
      <section className="im-hero">
        <div className="im-hero__grain" aria-hidden="true" />
        <div className="im-hero__content">
          <p className="im-hero__eyebrow">Admin Payment Review</p>
          <h1 className="im-hero__title">ตรวจสอบหลักฐานการชำระเงิน</h1>
          <p className="im-hero__desc">อัปเดตสถานะผ่าน dropdown และลบหลักฐานที่ไม่ต้องการได้ทันที</p>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-stone-300/70 bg-white/75 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-stone-500">ทั้งหมด</p>
              <p className="text-3xl font-semibold text-stone-900">{payments.length}</p>
            </div>
            <div className="rounded-xl border border-amber-300/70 bg-amber-50/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-amber-700">Pending</p>
              <p className="text-3xl font-semibold text-amber-800">{pendingCount}</p>
            </div>
            <div className="rounded-xl border border-emerald-300/70 bg-emerald-50/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Verified</p>
              <p className="text-3xl font-semibold text-emerald-800">{verifiedCount}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="rounded-2xl border border-stone-300/70 bg-white/75 backdrop-blur-sm p-4 shadow-sm">
        <Table
          headers={['ID', 'ชื่อลูกค้า', 'ยอดเงิน', 'สถานะ', 'จัดการ']}
          data={payments.map((p) => [
            <span className="font-semibold text-stone-700">{p.id}</span>,
            p.customer,
            `฿${typeof p.amount === 'number' ? p.amount.toLocaleString('th-TH') : p.amount}`,
            <div className="relative w-[118px]">
              <select
                value={p.status}
                onChange={(event) => handleStatusChange(p.id, event.target.value)}
                className={`w-full appearance-none rounded-xl border px-3 py-1.5 pr-9 text-sm font-medium shadow-sm transition-all focus:outline-none focus:ring-2 ${
                  p.status === 'verified'
                    ? 'border-emerald-300/80 bg-emerald-50/80 text-emerald-800 focus:ring-emerald-200'
                    : 'border-amber-300/80 bg-amber-50/80 text-amber-800 focus:ring-amber-200'
                }`}
              >
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-stone-500">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>,
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-lg border border-sky-300/70 bg-sky-50 px-2.5 py-1 text-sky-700 hover:bg-sky-100 disabled:opacity-50"
                onClick={() => handleViewSlip(p)}
                disabled={!p.slipUrl}
              >
                ดูหลักฐาน
              </button>
              <button
                type="button"
                className="rounded-lg border border-rose-300/70 bg-rose-50 px-2.5 py-1 text-rose-700 hover:bg-rose-100"
                onClick={() => handleDeleteEvidence(p.id)}
              >
                ลบหลักฐาน
              </button>
            </div>
          ])}
        />
      </div>

      <Modal
        isOpen={Boolean(selectedSlip)}
        onClose={() => setSelectedSlip(null)}
        title={selectedSlip ? `หลักฐานการชำระเงิน ${selectedSlip.id}` : 'หลักฐานการชำระเงิน'}
      >
        {selectedSlip?.slipUrl ? (
          <div className="space-y-3">
            <img
              src={selectedSlip.slipUrl}
              alt={`หลักฐานการชำระเงิน ${selectedSlip.id}`}
              className="w-full rounded-xl border border-stone-300/70"
            />
            <a
              href={selectedSlip.slipUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-sky-700 hover:underline"
            >
              เปิดภาพเต็มขนาด
            </a>
          </div>
        ) : (
          <p className="text-sm text-gray-500">ไม่พบหลักฐานการชำระเงิน</p>
        )}
      </Modal>
    </div>
  );
};

export default VerifyPaymentPage;