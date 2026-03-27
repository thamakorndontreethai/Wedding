import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
const PackagesPage = () => (
  <div>
    <div className="flex justify-between mb-4">
      <h1 className="text-2xl font-bold">จัดการแพ็กเกจ</h1>
      <Button variant="primary">+ เพิ่มแพ็กเกจ</Button>
    </div>
    <Table headers={['ชื่อแพ็กเกจ', 'ราคา', 'แขกสูงสุด', 'จัดการ']} data={[
      ['Standard Wedding', '฿150,000', '200', <Button variant="secondary">แก้ไข</Button>],
      ['Grand Luxury', '฿450,000', '500', <Button variant="secondary">แก้ไข</Button>]
    ]} />
  </div>
);
export default PackagesPage;