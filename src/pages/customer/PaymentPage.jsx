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
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
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
      setMessageType('error');
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
      setMessageType('error');
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
      setMessageType('success');
    } catch (error) {
      setMessage(error.message || 'ส่งหลักฐานไม่สำเร็จ');
      setMessageType('error');
    }
  };

  return (
    <div className="payment-page">
      {/* Hero Header */}
      <section className="payment-hero">
        <div className="payment-hero__content">
          <h1 className="payment-hero__title">💳 แจ้งชำระเงินมัดจำ</h1>
          <p className="payment-hero__desc">อัปโหลดสลิปการโอนเงินเพื่อให้การยืนยันการจองของคุณ</p>
        </div>
      </section>

      {/* Form Container */}
      <div className="payment-container">
        <form className="payment-form" onSubmit={handleSubmit}>
          {/* Bank info card */}
          <div className="payment-info-box">
            <p className="payment-info-box__label">🏦 กรุณาโอนเงินเข้าบัญชี</p>
            <p className="payment-info-box__value">123-4-56789-0 (ธ.กสิกรไทย)</p>
          </div>

          {/* Amount Input */}
          <div className="form-section">
            <h2 className="form-section__title">ข้อมูลระเบียง</h2>
            <div className="payment-input-wrapper">
              <Input
                label="จำนวนเงิน (งวดที่ 1/2)"
                type="number"
                min={1}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                required
              />
            </div>
            <div className="payment-input-wrapper">
              <Input
                label="วันที่ชำระ"
                type="date"
                value={transferDate}
                onChange={(event) => setTransferDate(event.target.value)}
                required
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="form-section">
            <h2 className="form-section__title">📸 แนบหลักฐานการโอน</h2>
            <label className="file-input-label">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="file-input"
              />
              <span className="file-input-text">
                {selectedFile ? `✓ ${selectedFile.name}` : '+ เลือกรูปภาพ'}
              </span>
            </label>
          </div>

          {/* Image Preview */}
          {previewUrl && (
            <div className="preview-section">
              <h3 className="preview-section__title">ตัวอย่างหลักฐาน</h3>
              <img 
                src={previewUrl} 
                alt="พรีวิวหลักฐานการโอน" 
                className="preview-image" 
              />
              <button
                type="button"
                className="preview-btn"
                onClick={() => setIsPreviewOpen(true)}
              >
                ดูรูปขนาดใหญ่
              </button>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className={`payment-message ${messageType === 'success' ? 'payment-message--success' : 'payment-message--error'}`}>
              {messageType === 'success' ? '✓' : '⚠️'} {message}
            </div>
          )}

          {/* Submit Button */}
          <Button variant="primary" type="submit">ส่งหลักฐาน</Button>
        </form>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="ตัวอย่างหลักฐานที่กำลังจะส่ง"
      >
        {previewUrl ? (
          <img src={previewUrl} alt="ตัวอย่างหลักฐาน" className="preview-image" />
        ) : (
          <p style={{ color: 'var(--gray-400)', textAlign: 'center', padding: '20px' }}>ไม่มีรูปสำหรับแสดง</p>
        )}
      </Modal>
    </div>
  );
};

export default PaymentPage;