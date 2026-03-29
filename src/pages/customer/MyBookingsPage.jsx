import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';

const MyBookingsPage = () => {
	const bookings = [
		['BK-6901', 'Grand Ballroom KU Sriracha', '14 ก.พ. 69', <Badge status="processing" />],
	];

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">การจองของฉัน</h1>
			<Table
				headers={['รหัสการจอง', 'สถานที่', 'วันจัดงาน', 'สถานะ']}
				data={bookings}
			/>
		</div>
	);
};

export default MyBookingsPage;
