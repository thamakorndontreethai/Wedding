import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import { useAuthStore } from '../../store/authStore';

const OrderPage = () => {
  const { user } = useAuthStore();
  const orders = [
    {
      id: 'ORD-6901',
      coupleName: 'คุณนิติภูมิ - คุณธมกร',
      eventDate: '29 ก.พ. 69',
      status: 'processing',
      serviceType: 'photo',
      assignedProviderEmail: 'photo.demo@wedding.local',
    },
    {
      id: 'ORD-6905',
      coupleName: 'คุณสิรวิชญ์ - คุณสมศรี',
      eventDate: '30 มี.ค. 69',
      status: 'pending',
      serviceType: 'music',
      assignedProviderEmail: 'music.demo@wedding.local',
    },
    {
      id: 'ORD-6908',
      coupleName: 'คุณภัทร - คุณอัญชลี',
      eventDate: '10 เม.ย. 69',
      status: 'processing',
      serviceType: 'food',
      assignedProviderEmail: 'food.demo@wedding.local',
    },
  ];

  const visibleOrders = orders.filter((order) => {
    const typeMatch = user?.serviceType ? order.serviceType === user.serviceType : true;
    const assigneeMatch = user?.email ? order.assignedProviderEmail === user.email : true;
    return typeMatch && assigneeMatch;
  });

  const processingCount = visibleOrders.filter((order) => order.status === 'processing').length;
  const pendingCount = visibleOrders.filter((order) => order.status === 'pending').length;

  const serviceMeta = {
    photo: { icon: '📷', label: 'ช่างภาพ' },
    music: { icon: '🎵', label: 'วงดนตรี' },
    food: { icon: '🍽️', label: 'อาหาร' },
  };

  const currentService = serviceMeta[user?.serviceType] || { icon: '🧩', label: 'ผู้ให้บริการ' };
  const currentServiceTitleLabel = user?.serviceType === 'food' ? 'ครัว' : currentService.label;

  return (
    <div className="provider-orders">
      <section className="provider-orders__hero">
        <p className="provider-orders__eyebrow">Provider Work Orders</p>
        <h1 className="provider-orders__title">ใบสั่งงาน ({currentService.icon} {currentServiceTitleLabel})</h1>
        <p className="provider-orders__desc">ติดตามออเดอร์ล่าสุดของคุณ พร้อมตรวจสอบสถานะการดำเนินงานได้ทันที</p>

        <div className="provider-orders__stats">
          <div className="provider-orders__stat-card">
            <p className="provider-orders__stat-label">ทั้งหมด</p>
            <p className="provider-orders__stat-value">{visibleOrders.length}</p>
          </div>
          <div className="provider-orders__stat-card provider-orders__stat-card--processing">
            <p className="provider-orders__stat-label">Processing</p>
            <p className="provider-orders__stat-value">{processingCount}</p>
          </div>
          <div className="provider-orders__stat-card provider-orders__stat-card--pending">
            <p className="provider-orders__stat-label">Pending</p>
            <p className="provider-orders__stat-value">{pendingCount}</p>
          </div>
        </div>
      </section>

      <div className="provider-orders__table-wrap">
        {visibleOrders.length > 0 ? (
          <Table
            variant="pink"
            headers={['เลขที่ออเดอร์', 'ชื่อคู่บ่าวสาว', 'ประเภทงาน', 'วันที่จัดงาน', 'สถานะ']}
            data={visibleOrders.map((order) => [
              <span className="provider-orders__id">{order.id}</span>,
              order.coupleName,
              `${serviceMeta[order.serviceType]?.icon || '🧩'} ${serviceMeta[order.serviceType]?.label || 'อื่น ๆ'}`,
              order.eventDate,
              <Badge status={order.status} />,
            ])}
          />
        ) : (
          <div style={{ padding: 20, textAlign: 'center', color: 'var(--gray-500)' }}>
            ยังไม่มีใบสั่งงานของบัญชีนี้
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;