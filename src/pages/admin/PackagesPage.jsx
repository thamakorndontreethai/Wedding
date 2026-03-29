import { useMemo, useState } from 'react';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';

const initialForm = {
  name: '',
  price: '',
  maxGuests: '',
};

const PackagesPage = () => {
  const [packages, setPackages] = useState([
    { id: 'PKG001', name: 'Standard Wedding', price: 150000, maxGuests: 200 },
    { id: 'PKG002', name: 'Grand Luxury', price: 450000, maxGuests: 500 },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (pkg) => {
    setEditingId(pkg.id);
    setForm({
      name: pkg.name,
      price: String(pkg.price),
      maxGuests: String(pkg.maxGuests),
    });
    setIsModalOpen(true);
  };

  const handleDeletePackage = (packageId) => {
    const shouldDelete = window.confirm('ต้องการลบแพ็กเกจนี้ใช่หรือไม่?');
    if (!shouldDelete) return;

    setPackages((prev) => prev.filter((pkg) => pkg.id !== packageId));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const updateForm = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      maxGuests: Number(form.maxGuests),
    };

    if (!payload.name || payload.price <= 0 || payload.maxGuests <= 0) return;

    if (isEditing) {
      setPackages((prev) => prev.map((pkg) => (
        pkg.id === editingId ? { ...pkg, ...payload } : pkg
      )));
    } else {
      setPackages((prev) => [
        ...prev,
        { id: `PKG${String(prev.length + 1).padStart(3, '0')}`, ...payload },
      ]);
    }

    closeModal();
  };

  return (
    <div className="admin-packages">
      <div className="admin-packages__header">
        <h1 className="page-header__title">จัดการแพ็กเกจ</h1>
        <Button variant="primary" className="admin-packages__add-btn" onClick={openCreateModal}>+ เพิ่มแพ็กเกจ</Button>
      </div>

      <Table
        variant="pink"
        headers={['ชื่อแพ็กเกจ', 'ราคา', 'แขกสูงสุด', 'จัดการ']}
        data={packages.map((pkg) => [
          pkg.name,
          `฿${pkg.price.toLocaleString('th-TH')}`,
          String(pkg.maxGuests),
          <div className="admin-packages__actions">
            <Button variant="secondary" className="admin-packages__edit-btn" onClick={() => openEditModal(pkg)}>แก้ไข</Button>
            <Button variant="danger" className="admin-packages__delete-btn" onClick={() => handleDeletePackage(pkg.id)}>ลบ</Button>
          </div>,
        ])}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isEditing ? 'แก้ไขแพ็กเกจ' : 'เพิ่มแพ็กเกจ'}
      >
        <form className="admin-packages__form" onSubmit={handleSubmit}>
          <Input
            label="ชื่อแพ็กเกจ"
            value={form.name}
            onChange={updateForm('name')}
            required
          />
          <Input
            label="ราคา"
            type="number"
            min={1}
            value={form.price}
            onChange={updateForm('price')}
            required
          />
          <Input
            label="แขกสูงสุด"
            type="number"
            min={1}
            value={form.maxGuests}
            onChange={updateForm('maxGuests')}
            required
          />
          <div className="admin-packages__form-actions">
            <Button variant="secondary" className="admin-packages__cancel-btn" onClick={closeModal}>
              ยกเลิก
            </Button>
            <Button variant="primary" className="admin-packages__save-btn" type="submit">
              บันทึก
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default PackagesPage;