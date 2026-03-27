import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';

const VerifyPaymentPage = () => {
  const payments = [
    { id: 'PAY001', customer: 'สมชาย', amount: '50,000', status: 'pending' },
    { id: 'PAY002', customer: 'สมศรี', amount: '30,000', status: 'verified' }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">ตรวจสอบการชำระเงิน</h1>
      <Table 
        headers={['ID', 'ชื่อลูกค้า', 'ยอดเงิน', 'สถานะ', 'จัดการ']}
        data={payments.map(p => [
          p.id, p.customer, p.amount, 
          <Badge status={p.status} />,
          <button className="text-blue-600">ดูหลักฐาน</button>
        ])}
      />
    </div>
  );
};

export default VerifyPaymentPage;