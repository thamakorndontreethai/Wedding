import { useMemo, useState, useEffect } from 'react';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';

const initialForm = {
  name: '',
  description: '',
  basePrice: '',
  maxGuests: '',
  includeFood: false,
  includeFoodType: 'both',
  includePhoto: false,
  includeMusic: false,
};

const getPackageServiceLabels = (pkg) => {
  const labels = [];
  if (pkg.includeFood) {
    const foodTypeLabel = pkg.includeFoodType === 'chinese'
      ? 'โต๊ะจีน'
      : pkg.includeFoodType === 'buffet'
        ? 'บุฟเฟต์'
        : 'โต๊ะจีน/บุฟเฟต์';
    labels.push(`อาหาร (${foodTypeLabel})`);
  }
  if (pkg.includePhoto) labels.push('ช่างภาพ');
  if (pkg.includeMusic) labels.push('วงดนตรี');
  return labels;
};

const SERVICE_OPTIONS = [
  {
    key: 'includeFood',
    icon: '🍽️',
    label: 'อาหาร',
    hint: 'รวมค่าอาหารในแพ็กเกจ',
  },
  {
    key: 'includePhoto',
    icon: '📸',
    label: 'ช่างภาพ',
    hint: 'รวมบริการช่างภาพ',
  },
  {
    key: 'includeMusic',
    icon: '🎵',
    label: 'วงดนตรี',
    hint: 'รวมวงดนตรีในงาน',
  },
];

const PackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  useEffect(() => {
    api.get('/packages')
      .then(({ data }) => setPackages(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const resetForm = () => { setForm(initialForm); setEditingId(null); setError(''); };

  const openCreateModal = () => { resetForm(); setIsModalOpen(true); };

  const openEditModal = (pkg) => {
    setEditingId(pkg._id);
    setForm({
      name: pkg.name,
      description: pkg.description || '',
      basePrice: String(pkg.basePrice),
      maxGuests: String(pkg.maxGuests || ''),
      includeFood: !!pkg.includeFood,
      includeFoodType: pkg.includeFoodType || 'both',
      includePhoto: !!pkg.includePhoto,
      includeMusic: !!pkg.includeMusic,
    });
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); resetForm(); };

  const handleDelete = async (id) => {
    if (!window.confirm('ต้องการลบแพ็กเกจนี้ใช่หรือไม่?')) return;
    try {
      await api.delete(`/packages/${id}`);
      setPackages(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'ลบไม่สำเร็จ');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      basePrice: Number(form.basePrice),
      maxGuests: Number(form.maxGuests),
      includeFood: !!form.includeFood,
      includeFoodType: form.includeFoodType,
      includePhoto: !!form.includePhoto,
      includeMusic: !!form.includeMusic,
    };
    if (!payload.name || payload.basePrice <= 0) return setError('กรุณากรอกข้อมูลให้ครบ');
    setSaving(true);
    setError('');
    try {
      if (isEditing) {
        const { data } = await api.put(`/packages/${editingId}`, payload);
        setPackages(prev => prev.map(p => p._id === editingId ? data : p));
      } else {
        const { data } = await api.post('/packages', payload);
        setPackages(prev => [data, ...prev]);
      }
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'บันทึกไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-packages">
      <div className="admin-packages__header">
        <h1 className="page-header__title">📦 จัดการแพ็กเกจงานแต่งงาน</h1>
        <Button variant="primary" className="admin-packages__add-btn" onClick={openCreateModal}>+ เพิ่มแพ็กเกจ</Button>
      </div>

      {loading ? (
        <div className="loading-state"><div className="loading-dots"><span /><span /><span /></div></div>
      ) : (
        <Table
          variant="pink"
          headers={['ชื่อแพ็กเกจ', 'คำอธิบาย', 'บริการที่รวม', 'ราคาเริ่มต้น', 'แขกสูงสุด', 'จัดการ']}
          data={packages.map(pkg => [
            pkg.name,
            pkg.description || '-',
            (() => {
              const serviceLabels = getPackageServiceLabels(pkg);
              if (serviceLabels.length === 0) {
                return <span style={{ color: 'var(--gray-400)', fontWeight: 600 }}>ไม่ระบุ</span>;
              }
              return (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {serviceLabels.map((label) => (
                    <span
                      key={label}
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'var(--pink)',
                        background: 'var(--pink-bg)',
                        border: '1px solid var(--pink-border)',
                        borderRadius: 999,
                        padding: '4px 8px',
                      }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              );
            })(),
            `฿${pkg.basePrice.toLocaleString('th-TH')}`,
            pkg.maxGuests > 0 ? `${pkg.maxGuests} คน` : 'ไม่จำกัด',
            <div className="admin-packages__actions">
              <Button variant="secondary" className="admin-packages__edit-btn" onClick={() => openEditModal(pkg)}>แก้ไข</Button>
              <Button variant="danger" className="admin-packages__delete-btn" onClick={() => handleDelete(pkg._id)}>ลบ</Button>
            </div>,
          ])}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={isEditing ? 'แก้ไขแพ็กเกจ' : 'เพิ่มแพ็กเกจ'}>
        <form className="admin-packages__form" onSubmit={handleSubmit}>
          <Input label="ชื่อแพ็กเกจ" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <Input label="คำอธิบาย" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />

          <div>
            <label className="input-label" style={{ marginBottom: 12, display: 'block' }}>บริการที่รวมในแพ็กเกจ</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(120px, 1fr))', gap: 10 }}>
              {SERVICE_OPTIONS.map((item) => {
                const selected = !!form[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                    style={{
                      textAlign: 'left',
                      borderRadius: 12,
                      border: `2px solid ${selected ? 'var(--pink)' : 'var(--gray-100)'}`,
                      background: selected ? 'var(--pink-bg)' : 'white',
                      color: selected ? 'var(--pink)' : 'var(--gray-700)',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    aria-pressed={selected}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 16 }}>{item.icon}</span>
                      <span style={{ fontSize: 12, fontWeight: 800 }}>{selected ? 'เลือกแล้ว' : 'เลือก'}</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{item.label}</div>
                    <div style={{ fontSize: 11, marginTop: 2, color: selected ? 'var(--pink)' : 'var(--gray-500)' }}>{item.hint}</div>
                  </button>
                );
              })}
            </div>

            {form.includeFood && (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-600)', marginBottom: 6 }}>
                  ประเภทอาหารในแพ็กเกจ
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[
                    { value: 'buffet', label: '🍽️ บุฟเฟต์' },
                    { value: 'chinese', label: '🥢 โต๊ะจีน' },
                  ].map((opt) => {
                    const active = form.includeFoodType === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, includeFoodType: opt.value }))}
                        style={{
                          border: `2px solid ${active ? 'var(--pink)' : 'var(--gray-100)'}`,
                          background: active ? 'var(--pink-bg)' : 'white',
                          color: active ? 'var(--pink)' : 'var(--gray-700)',
                          borderRadius: 999,
                          padding: '7px 12px',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Input label="ราคาเริ่มต้น (บาท)" type="number" min={1} value={form.basePrice} onChange={e => setForm(f => ({ ...f, basePrice: e.target.value }))} required />
          <Input label="แขกสูงสุด (คน, 0 = ไม่จำกัด)" type="number" min={0} value={form.maxGuests} onChange={e => setForm(f => ({ ...f, maxGuests: e.target.value }))} />
          {error && <p style={{ color: '#dc2626', fontSize: 13, fontWeight: 600 }}>⚠️ {error}</p>}
          <div className="admin-packages__form-actions">
            <Button variant="secondary" className="admin-packages__cancel-btn" onClick={closeModal} type="button">ยกเลิก</Button>
            <Button variant="primary" className="admin-packages__save-btn" type="submit" disabled={saving}>
              {saving ? 'กำลังบันทึก...' : 'บันทึก'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PackagesPage;
