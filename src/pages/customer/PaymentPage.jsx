import { useEffect, useState } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

const STORAGE_KEY = 'mockSubmittedPayments';

const PaymentPage = () => {
  const [amount, setAmount] = useState('');
  const [transferDate, setTransferDate] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [message, setMessage] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  }, [previewUrl]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
      return;
    }

    setSelectedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setMessage('');
  };

  const toDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('ไม่สามารถอ่านไฟล์รูปภาพได้'));
    reader.readAsDataURL(file);
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!amount || !transferDate || !selectedFile) {
      setMessage('กรุณากรอกข้อมูลให้ครบและแนบหลักฐานการโอน');
      return;
    }

    try {
      const slipDataUrl = await toDataUrl(selectedFile);
      const savedPayments = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const newPayment = {
        id: `PAY${Date.now()}`,
        customer: 'ลูกค้าทดสอบ',
        amount: Number(amount),
        status: 'pending',
        transferDate,
        slipUrl: slipDataUrl,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify([newPayment, ...savedPayments]));

      setAmount('');
      setTransferDate('');
      setSelectedFile(null);
      setMessage('ส่งหลักฐานสำเร็จแล้ว สามารถไปที่หน้าตรวจสอบยอดเพื่อดูรูปได้');
    } catch (error) {
      setMessage(error.message || 'ส่งหลักฐานไม่สำเร็จ');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">แจ้งชำระเงินมัดจำ</h1>
      <form className="bg-white p-6 rounded-lg shadow-sm border" onSubmit={handleSubmit}>
        <p className="mb-4 text-gray-600">กรุณาโอนเงินเข้าบัญชี: 123-4-56789-0 (ธ.กสิกรไทย)</p>
        <Input
          label="จำนวนเงิน (งวดที่ 1/2)"
          type="number"
          min={1}
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          required
        />
        <Input
          label="วันที่ชำระ"
          type="date"
          value={transferDate}
          onChange={(event) => setTransferDate(event.target.value)}
          required
        />
        <label className="block text-sm font-medium mb-1">แนบหลักฐาน (Slip)</label>
        <input type="file" accept="image/*" className="mb-3 w-full" onChange={handleFileChange} />

        {previewUrl && (
          <div className="mb-4 space-y-2">
            <img src={previewUrl} alt="พรีวิวหลักฐานการโอน" className="w-full rounded-md border border-gray-200" />
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
              onClick={() => setIsPreviewOpen(true)}
            >
              ดูรูปขนาดใหญ่
            </button>
          </div>
        )}

        {message && <p className="mb-3 text-sm text-gray-700">{message}</p>}
        <Button variant="primary" type="submit">ส่งหลักฐาน</Button>
      </form>

      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="ตัวอย่างหลักฐานที่กำลังจะส่ง"
      >
        {previewUrl ? (
          <img src={previewUrl} alt="ตัวอย่างหลักฐาน" className="w-full rounded-md border border-gray-200" />
        ) : (
          <p className="text-sm text-gray-500">ไม่มีรูปสำหรับแสดง</p>
        )}
      </Modal>
    </div>
  );
};

export default PaymentPage;