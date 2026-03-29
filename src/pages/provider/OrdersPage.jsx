import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';

const OrderPage = () => {
  const orders = [
    ['ORD-6901', 'คุณนิติภูมิ - คุณธมกร', '29 ก.พ. 69', <Badge status="processing" />],
    ['ORD-6905', 'คุณสิรวิชญ์ - คุณสมศรี', '30 มี.ค. 69', <Badge status="pending" />]
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ใบสั่งงาน (Work Orders)</h1>
      <Table 
        headers={['เลขที่ออเดอร์', 'ชื่อคู่บ่าวสาว', 'วันที่จัดงาน', 'สถานะ']} 
        data={orders} 
      />
    </div>
  );
};

export default OrderPage;