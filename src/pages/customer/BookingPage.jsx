import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const BookingsPage = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">ปรับแต่งแพ็กเกจของคุณ</h1>
    <div className="grid grid-cols-2 gap-6">
      <Card title="ช่างภาพ (Photography)" footer={<Button>เลือก</Button>}>ราคา 25,000 บาท</Card>
      <Card title="วงดนตรี (Music)" footer={<Button>เลือก</Button>}>ราคา 15,000 บาท</Card>
    </div>
    <div className="mt-8 p-4 bg-white rounded-lg border border-pink-200">
      <h3 className="text-xl font-bold">สรุปยอดรวม: ฿190,000</h3>
      <Button variant="primary">ยืนยันการจอง</Button>
    </div>
  </div>
);
export default BookingsPage;