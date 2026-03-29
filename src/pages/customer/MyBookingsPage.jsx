import { useEffect, useMemo, useState } from 'react';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import api from '../../services/api';

const MyBookingsPage = () => {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [bookingVenueNameMap, setBookingVenueNameMap] = useState({});
	const [lastBookedVenueName, setLastBookedVenueName] = useState('');

	useEffect(() => {
		const storedMap = JSON.parse(localStorage.getItem('bookingVenueNameMap') || '{}');
		setBookingVenueNameMap(storedMap);
		setLastBookedVenueName(localStorage.getItem('lastBookedVenueName') || '');
	}, []);

	useEffect(() => {
		const fetchMyBookings = async () => {
			setLoading(true);
			setError('');
			try {
				const { data } = await api.get('/bookings/my');
				setBookings(Array.isArray(data) ? data : []);
			} catch (err) {
				setError(err.response?.data?.message || 'โหลดข้อมูลการจองไม่สำเร็จ');
			} finally {
				setLoading(false);
			}
		};

		fetchMyBookings();
	}, []);

	const formatDate = (value) => {
		if (!value) return '-';
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return '-';
		return new Intl.DateTimeFormat('th-TH', {
			day: '2-digit',
			month: 'short',
			year: '2-digit',
		}).format(date);
	};

	const getBookedItemsText = (booking) => {
		const items = [];
		if (booking.mealType === 'buffet') items.push('🍽️ บุฟเฟต์');
		if (booking.mealType === 'chinese') items.push('🥢 โต๊ะจีน');
		if (booking.addFood) items.push('👨‍🍳 ทีมครัว');
		if (booking.addPhoto) items.push('📷 ช่างภาพ');
		if (booking.addMusic) items.push('🎵 วงดนตรี');
		return items.length ? items.join(' · ') : '-';
	};

	const tableRows = useMemo(
		() => bookings.map((booking) => [
			`BK-${String(booking._id || '').slice(-6).toUpperCase()}`,
			booking.venueId?.name
				|| booking.venueName
				|| booking.name
				|| bookingVenueNameMap[booking._id]
				|| lastBookedVenueName
				|| 'ไม่ระบุสถานที่',
			getBookedItemsText(booking),
			formatDate(booking.eventDate),
			<Badge status={booking.status || 'pending'} />,
		]),
		[bookings, bookingVenueNameMap, lastBookedVenueName]
	);

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">การจองของฉัน</h1>
			{loading ? (
				<p style={{ color: 'var(--gray-500)' }}>กำลังโหลดข้อมูลการจอง...</p>
			) : error ? (
				<p style={{ color: '#ef4444' }}>{error}</p>
			) : tableRows.length > 0 ? (
				<Table
					headers={['รหัสการจอง', 'สถานที่', 'สิ่งที่จอง', 'วันจัดงาน', 'สถานะ']}
					data={tableRows}
				/>
			) : (
				<p style={{ color: 'var(--gray-500)' }}>ยังไม่มีรายการจอง</p>
			)}
		</div>
	);
};

export default MyBookingsPage;
