import { Link } from "react-router-dom";

function BookingTable({ bookings, onEdit, onDelete }) {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-2xl shadow-xl border border-blue-50">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-1">No Bookings Found</h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
          No bookings match your current filters, or there are no active bookings.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-blue-50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-gray-200 text-xs font-bold text-[#086e96] uppercase tracking-wider">
              <th className="py-4 px-4">Customer Name</th>
              <th className="py-4 px-4">Phone Number</th>
              <th className="py-4 px-4">Laundry Type</th>
              <th className="py-4 px-4">Payment Method</th>
              <th className="py-4 px-4">Pickup Date</th>
              <th className="py-4 px-4">Pickup Time</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="hover:bg-blue-50/40 transition-colors"
              >
                {/* Customer Name */}
                <td className="py-4 px-4 font-bold text-gray-900 whitespace-nowrap">
                  {booking.customerName}
                </td>

                {/* Phone Number */}
                <td className="py-4 px-4 whitespace-nowrap font-medium text-gray-800">
                  {booking.phoneNumber}
                </td>

                {/* Laundry Type */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    booking.laundryType === "Dry Cleaning"
                      ? "bg-purple-100 text-purple-700"
                      : booking.laundryType === "Wash"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {booking.laundryType}
                  </span>
                </td>

                {/* Payment Method */}
                <td className="py-4 px-4 whitespace-nowrap font-medium">
                  {booking.paymentMethod}
                </td>

                {/* Pickup Date & Time */}
                <td className="py-4 px-4 whitespace-nowrap text-gray-800 font-medium">
                  {booking.pickupDate}
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-gray-600">
                  {booking.pickupTime}
                </td>

                {/* Status */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    booking.status === "Completed"
                      ? "bg-emerald-100 text-emerald-800"
                      : booking.status === "Cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {booking.status || "Pending"}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-4 px-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(booking)}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-bold transition-all border border-blue-200"
                      title="Edit Booking"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(booking.id)}
                      className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white rounded-lg text-xs font-bold transition-all border border-red-200"
                      title="Delete Booking"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingTable;
