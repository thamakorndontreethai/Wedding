import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const SchedulePage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">จัดการตารางคิวงาน</h1>
        <Button variant="primary">+ เพิ่มวันที่ไม่สะดวกรับงาน</Button>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {/* จำลองปฏิทินแบบง่าย */}
        {[...Array(31)].map((_, i) => (
          <div key={i} className={`h-24 border rounded-lg p-2 ${i === 13 ? 'bg-red-50 border-red-200' : 'bg-white'}`}>
            <span className="text-sm font-bold">{i + 1}</span>
            {i === 13 && <p className="text-[10px] text-red-600 mt-2">● ติดงานแต่งงาน (Ballroom)</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchedulePage;