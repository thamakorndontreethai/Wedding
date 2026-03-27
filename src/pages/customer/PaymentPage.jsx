import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const PaymentPage = () => (
  <div className="max-w-md mx-auto">
    <h1 className="text-2xl font-bold mb-6">แจ้งชำระเงินมัดจำ</h1>
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <p className="mb-4 text-gray-600">กรุณาโอนเงินเข้าบัญชี: 123-4-56789-0 (ธ.กสิกรไทย)</p>
      <Input label="จำนวนเงิน (งวดที่ 1/2)" type="number" />
      <Input label="วันที่ชำระ" type="date" />
      <label className="block text-sm font-medium mb-1">แนบหลักฐาน (Slip)</label>
      <input type="file" className="mb-4 w-full" />
      <Button variant="primary">ส่งหลักฐาน</Button>
    </div>
  </div>
);
export default PaymentPage;