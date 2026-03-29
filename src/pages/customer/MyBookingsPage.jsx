import { useEffect, useMemo, useState } from 'react';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';

const MyBookingsPage = () => {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [bookingVenueNameMap, setBookingVenueNameMap] = useState({});
	const [lastBookedVenueName, setLastBookedVenueName] = useState('');
	const [selectedBooking, setSelectedBooking] = useState(null);

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

	const formatCurrency = (value) => {
		const amount = Number(value);
		if (!Number.isFinite(amount)) return '-';
		return new Intl.NumberFormat('th-TH', {
			style: 'currency',
			currency: 'THB',
			maximumFractionDigits: 0,
		}).format(amount);
	};

	const getVenueName = (booking) => (
		booking.venueId?.name
		|| booking.venueName
		|| booking.name
		|| bookingVenueNameMap[booking._id]
		|| lastBookedVenueName
		|| 'ไม่ระบุสถานที่'
	);

	const getBookedItemsText = (booking) => {
		const items = [];
		if (booking.mealType === 'buffet') items.push('🍽️ บุฟเฟต์');
		if (booking.mealType === 'chinese') items.push('🥢 โต๊ะจีน');
		if (booking.addFood) items.push('👨‍🍳 ทีมครัว');
		if (booking.addPhoto) items.push('📷 ช่างภาพ');
		if (booking.addMusic) items.push('🎵 วงดนตรี');
		return items.length ? items.join(' · ') : '-';
	};

	const getServiceItems = (booking) => {
		const items = [];
		if (booking.mealType === 'buffet') items.push('🍽️ บุฟเฟต์');
		if (booking.mealType === 'chinese') items.push('🥢 โต๊ะจีน');
		if (booking.addFood) items.push('👨‍🍳 ทีมครัว');
		if (booking.addPhoto) items.push('📷 ช่างภาพ');
		if (booking.addMusic) items.push('🎵 วงดนตรี');
		return items;
	};

	const getStatusLabel = (status) => {
		const normalized = String(status || '').toLowerCase();
		const labels = {
			pending: 'รอตรวจสอบ',
			deposit1_pending: 'รอมัดจำงวดที่ 1',
			deposit1_paid: 'ชำระมัดจำงวดที่ 1 แล้ว',
			deposit2_pending: 'รอมัดจำงวดที่ 2',
			confirmed: 'ยืนยันแล้ว',
			completed: 'เสร็จสิ้น',
			cancelled: 'ยกเลิก',
		};
		return labels[normalized] || 'กำลังดำเนินการ';
	};

	const tableRows = useMemo(
		() => bookings.map((booking) => [
			`BK-${String(booking._id || '').slice(-6).toUpperCase()}`,
			getVenueName(booking),
			getBookedItemsText(booking),
			formatDate(booking.createdAt),
			formatDate(booking.eventDate),
			<Badge status={booking.status || 'pending'} />,
			<Button
				variant="secondary"
				className="my-bookings__detail-btn"
				onClick={() => setSelectedBooking(booking)}
			>
				🔎 ดูรายละเอียด
			</Button>,
		]),
		[bookings, bookingVenueNameMap, lastBookedVenueName]
	);

	return (
		<div className="search-page" style={{ maxWidth: 1200, margin: '0 auto' }}>
			<section className="im-hero">
				<div className="im-hero__grain" aria-hidden="true" />
				<div className="im-hero__content">
					<p className="im-hero__eyebrow">Wedding Planner</p>
					<h1 className="im-hero__title">ประวัติการจอง</h1>
					<p className="im-hero__desc">ติดตามทุกการจองย้อนหลัง พร้อมเปิดดูรายละเอียดและยอดชำระได้ในคลิกเดียว</p>
				</div>
			</section>

			<div className="form-section" style={{ marginBottom: 0 }}>
				<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16 }}>
					<h2 className="form-section__title" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>รายการการจอง</h2>
				</div>
			{loading ? (
				<div className="loading-state" style={{ padding: '24px 20px' }}>
					<div className="loading-dots"><span /><span /><span /></div>
					<p style={{ color: 'var(--gray-500)', marginTop: 12 }}>กำลังโหลดข้อมูลการจอง...</p>
				</div>
			) : error ? (
				<div className="empty-state" style={{ padding: '24px 20px' }}>
					<p className="empty-state__title" style={{ color: '#ef4444' }}>{error}</p>
				</div>
			) : tableRows.length > 0 ? (
				<Table
					variant="pink"
					headers={['รหัสการจอง', 'สถานที่', 'สิ่งที่จอง', 'วันที่จอง', 'วันจัดงาน', 'สถานะ', 'รายละเอียด']}
					data={tableRows}
				/>
			) : (
				<div className="empty-state" style={{ padding: '24px 20px' }}>
					<div className="empty-state__icon">📭</div>
					<p className="empty-state__title">ยังไม่มีประวัติการจอง</p>
					<p className="empty-state__desc">เริ่มจองสถานที่ได้จากหน้าค้นหาสถานที่</p>
				</div>
			)}
			</div>

			<Modal
				isOpen={Boolean(selectedBooking)}
				onClose={() => setSelectedBooking(null)}
				title={selectedBooking ? (
					<>
						<span style={{ display: 'block' }}>รายละเอียดการจอง</span>
						<span style={{ display: 'block', fontSize: '20px', lineHeight: 1.2, marginTop: 6 }}>
							{getVenueName(selectedBooking)}
						</span>
					</>
				) : 'รายละเอียดการจอง'}
				dialogClassName="booking-detail-modal__dialog"
				surfaceClassName="booking-detail-modal__surface"
				bodyClassName="booking-detail-modal__body"
			>
				{selectedBooking && (
					<div className="booking-detail">
						<div className="booking-detail__hero">
							<div className="booking-detail__hero-row">
								<div>
									<p className="booking-detail__eyebrow">Booking Code</p>
									<p className="booking-detail__code">BK-{String(selectedBooking._id || '').slice(-6).toUpperCase()}</p>
								</div>
								<span className="booking-detail__status-pill">{getStatusLabel(selectedBooking.status)}</span>
							</div>
							<p className="booking-detail__venue">📍 {getVenueName(selectedBooking)}</p>
						</div>

						<div className="booking-detail__meta-grid">
							<div className="booking-detail__meta-item">
								<p className="booking-detail__meta-label">วันที่จอง</p>
								<p className="booking-detail__meta-value">{formatDate(selectedBooking.createdAt)}</p>
							</div>
							<div className="booking-detail__meta-item">
								<p className="booking-detail__meta-label">วันจัดงาน</p>
								<p className="booking-detail__meta-value">{formatDate(selectedBooking.eventDate)}</p>
							</div>
							<div className="booking-detail__meta-item">
								<p className="booking-detail__meta-label">จำนวนแขก</p>
								<p className="booking-detail__meta-value">{selectedBooking.guestCount || '-'} คน</p>
							</div>
							<div className="booking-detail__meta-item">
								<p className="booking-detail__meta-label">ประเภทอาหาร</p>
								<p className="booking-detail__meta-value">{selectedBooking.mealType === 'buffet' ? 'บุฟเฟต์' : selectedBooking.mealType === 'chinese' ? 'โต๊ะจีน' : '-'}</p>
							</div>
						</div>

						<div className="booking-detail__section">
							<p className="booking-detail__section-title">บริการที่จอง</p>
							<div className="booking-detail__chips">
								{getServiceItems(selectedBooking).length > 0 ? (
									getServiceItems(selectedBooking).map((item) => (
										<span key={item} className="booking-detail__chip">
											{item}
										</span>
									))
								) : (
									<p className="booking-detail__empty">-</p>
								)}
							</div>
						</div>

						<div className="booking-detail__payment-block">
							<p className="booking-detail__section-title">สรุปยอดชำระ</p>
							<div className="booking-detail__payment-grid">
								<div className="booking-detail__payment-card">
									<p className="booking-detail__payment-label">ยอดรวม</p>
									<p className="booking-detail__payment-value">{formatCurrency(selectedBooking.totalPrice)}</p>
								</div>
								<div className="booking-detail__payment-card">
									<p className="booking-detail__payment-label">มัดจำงวดที่ 1</p>
									<p className="booking-detail__payment-value booking-detail__payment-value--pink">{formatCurrency(selectedBooking.depositAmount)}</p>
								</div>
								<div className="booking-detail__payment-card">
									<p className="booking-detail__payment-label">มัดจำงวดที่ 2</p>
									<p className="booking-detail__payment-value booking-detail__payment-value--amber">{formatCurrency(selectedBooking.remainingAmount)}</p>
								</div>
							</div>
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default MyBookingsPage;
