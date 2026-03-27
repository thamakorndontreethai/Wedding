import Card from '../../components/ui/Card';
const DashboardPage = () => (
  <div>
    <h1 className="text-3xl font-bold mb-6">ภาพรวมระบบ (Admin Dashboard)</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card title="รายได้ทั้งหมด">฿ 1,250,000</Card>
      <Card title="จำนวนการจอง">45 งาน</Card>
      <Card title="รอตรวจสอบยอด">8 รายการ</Card>
    </div>
  </div>
);
export default DashboardPage;