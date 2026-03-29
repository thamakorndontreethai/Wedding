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
    <div className="verify-payment-page">
      <section className="im-hero">
        <div className="im-hero__grain" aria-hidden="true" />
        <div className="im-hero__content">
          <p className="im-hero__eyebrow">Admin Payment Review</p>
          <h1 className="im-hero__title">ตรวจสอบหลักฐานการชำระเงิน</h1>
          <p className="im-hero__desc">อัปเดตสถานะผ่าน dropdown และลบหลักฐานที่ไม่ต้องการได้ทันที</p>
          <div className="verify-summary">
            <div className="verify-summary__card">
              <p className="verify-summary__label">ทั้งหมด</p>
              <p className="verify-summary__value">{payments.length}</p>
            </div>
            <div className="verify-summary__card verify-summary__card--pending">
              <p className="verify-summary__label">Pending</p>
              <p className="verify-summary__value verify-summary__value--pending">{pendingCount}</p>
            </div>
            <div className="verify-summary__card verify-summary__card--verified">
              <p className="verify-summary__label">Verified</p>
              <p className="verify-summary__value verify-summary__value--verified">{verifiedCount}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="verify-table-wrap">
        <Table
          variant="pink"
          headers={['ID', 'ชื่อลูกค้า', 'ยอดเงิน', 'สถานะ', 'จัดการ']}
          data={payments.map((p) => [
            <span className="verify-id">{p.id}</span>,
            p.customer,
            `฿${typeof p.amount === 'number' ? p.amount.toLocaleString('th-TH') : p.amount}`,
            <div className="verify-status-wrap">
              <select
                value={p.status}
                onChange={(event) => handleStatusChange(p.id, event.target.value)}
                className={`verify-status-select ${
                  p.status === 'verified'
                    ? 'verify-status-select--verified'
                    : 'verify-status-select--pending'
                }`}
              >
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
              </select>
              <span className="verify-status-wrap__icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>,
            <div className="verify-actions">
              <button
                type="button"
                className="verify-action-btn verify-action-btn--view"
                onClick={() => handleViewSlip(p)}
                disabled={!p.slipUrl}
              >
                ดูหลักฐาน
              </button>
              <button
                type="button"
                className="verify-action-btn verify-action-btn--delete"
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
          <div className="verify-modal-content">
            <img
              src={selectedSlip.slipUrl}
              alt={`หลักฐานการชำระเงิน ${selectedSlip.id}`}
              className="verify-modal-content__image"
            />
            <a
              href={selectedSlip.slipUrl}
              target="_blank"
              rel="noreferrer"
              className="verify-modal-content__link"
            >
              เปิดภาพเต็มขนาด
            </a>
          </div>
        ) : (
          <p className="verify-modal-content__empty">ไม่พบหลักฐานการชำระเงิน</p>
        )}
      </Modal>
    </div>
  );
};

export default VerifyPaymentPage;