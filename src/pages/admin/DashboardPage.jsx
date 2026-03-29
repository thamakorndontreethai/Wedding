import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">ภาพรวมระบบ (Admin Dashboard)</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="รายได้ทั้งหมด">
          <p className="text-3xl font-bold text-pink-600">฿{summary.revenue.toLocaleString('th-TH')}</p>
        </Card>
        <Card title="จำนวนการจอง">
          <p className="text-3xl font-bold text-slate-800">{summary.bookings} งาน</p>
        </Card>
        <Card title="รอตรวจสอบยอด">
          <p className="text-3xl font-bold text-amber-600">{summary.pendingPayments} รายการ</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">รายการชำระเงินล่าสุด</h2>
            <Link to="/admin/verify-payment" className="text-sm text-blue-600 hover:underline">ดูทั้งหมด</Link>
          </div>
          <Table
            headers={['ID', 'ลูกค้า', 'ยอดชำระ', 'สถานะ', 'ใบเสร็จ']}
            data={latestPayments.map((payment) => [
              payment.id,
              payment.customer,
              `฿${payment.amount.toLocaleString('th-TH')}`,
              <Badge status={payment.status} />,
              <div className="flex items-center gap-3">
                {payment.slipUrl ? (
                  <a href={payment.slipUrl} target="_blank" rel="noreferrer" className="text-sky-700 hover:underline">
                    หลักฐาน
                  </a>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </div>,
            ])}
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">แพ็กเกจล่าสุด</h2>
            <Link to="/admin/packages" className="text-sm text-blue-600 hover:underline">จัดการแพ็กเกจ</Link>
          </div>
          <Table
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