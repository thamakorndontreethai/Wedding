import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';

const STORAGE_KEY = 'mockSubmittedPayments';
const DEFAULT_PAYMENTS = [
  { id: 'PAY001', customer: 'สมชาย', amount: 50000, status: 'pending', slipUrl: 'https://thunder.in.th/wp-content/uploads/2024/06/%E0%B8%AA%E0%B8%A5%E0%B8%B4%E0%B8%9B%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99.webp' },
  { id: 'PAY002', customer: 'สมศรี', amount: 30000, status: 'verified', slipUrl: 'https://thunder.in.th/wp-content/uploads/2024/06/%E0%B8%AA%E0%B8%A5%E0%B8%B4%E0%B8%9B%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99.webp' },
];

const readSubmittedPayments = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const DashboardPage = () => {
  const [payments, setPayments] = useState(DEFAULT_PAYMENTS);

  useEffect(() => {
    const submitted = readSubmittedPayments();
    if (submitted.length > 0) {
      setPayments([...submitted, ...DEFAULT_PAYMENTS]);
    }
  }, []);

  const latestPayments = useMemo(() => payments.slice(0, 5), [payments]);
  const totalRevenue = useMemo(
    () => payments
      .filter((payment) => payment.status === 'verified')
      .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0),
    [payments]
  );
  const pendingPayments = useMemo(
    () => payments.filter((payment) => payment.status === 'pending').length,
    [payments]
  );

  const summary = {
    revenue: totalRevenue,
    bookings: payments.length,
    pendingPayments,
  };

  const latestPackages = [
    { name: 'Standard Wedding', price: 150000, maxGuests: 200 },
    { name: 'Grand Luxury', price: 450000, maxGuests: 500 },
  ];

  return (
    <div className="admin-dashboard">
      <div className="page-header">
        <h1 className="page-header__title">ภาพรวมระบบ (Admin Dashboard)</h1>
        <p className="page-header__sub">ติดตามยอดชำระเงินล่าสุดและข้อมูลแพ็กเกจแบบเรียลไทม์</p>
      </div>

      <div className="admin-dashboard__stats">
        <div className="admin-dashboard__stat-card">
          <p className="admin-dashboard__stat-title">รายได้ทั้งหมด</p>
          <p className="admin-dashboard__stat admin-dashboard__stat--revenue">฿{summary.revenue.toLocaleString('th-TH')}</p>
        </div>
        <div className="admin-dashboard__stat-card">
          <p className="admin-dashboard__stat-title">จำนวนการจอง</p>
          <p className="admin-dashboard__stat admin-dashboard__stat--bookings">{summary.bookings} งาน</p>
        </div>
        <div className="admin-dashboard__stat-card">
          <p className="admin-dashboard__stat-title">รอตรวจสอบยอด</p>
          <p className="admin-dashboard__stat admin-dashboard__stat--pending">{summary.pendingPayments} รายการ</p>
        </div>
      </div>

      <div className="admin-dashboard__panels">
        <div className="admin-dashboard__panel">
          <div className="admin-dashboard__panel-header">
            <h2 className="admin-dashboard__panel-title">รายการชำระเงินล่าสุด</h2>
            <Link to="/admin/verify-payment" className="admin-dashboard__link">ดูทั้งหมด</Link>
          </div>
          <Table
            variant="pink"
            headers={['ID', 'ลูกค้า', 'ยอดชำระ', 'สถานะ', 'ใบเสร็จ']}
            data={latestPayments.map((payment) => [
              payment.id,
              payment.customer,
              `฿${payment.amount.toLocaleString('th-TH')}`,
              <Badge status={payment.status} />,
              <div className="admin-dashboard__receipt-cell">
                {payment.slipUrl ? (
                  <a href={payment.slipUrl} target="_blank" rel="noreferrer" className="admin-dashboard__receipt-link">
                    หลักฐาน
                  </a>
                ) : (
                  <span className="admin-dashboard__receipt-empty">-</span>
                )}
              </div>,
            ])}
          />
        </div>

        <div className="admin-dashboard__panel">
          <div className="admin-dashboard__panel-header">
            <h2 className="admin-dashboard__panel-title">แพ็กเกจล่าสุด</h2>
            <Link to="/admin/packages" className="admin-dashboard__link">จัดการแพ็กเกจ</Link>
          </div>
          <Table
            variant="pink"
            headers={['ชื่อแพ็กเกจ', 'ราคา', 'จำนวนแขกสูงสุด']}
            data={latestPackages.map((pkg) => [
              pkg.name,
              `฿${pkg.price.toLocaleString('th-TH')}`,
              String(pkg.maxGuests),
            ])}
          />
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;