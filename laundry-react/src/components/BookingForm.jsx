import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking, updateBooking } from "../services/api";

function BookingForm({ initialData = null, prefilledPartner = "" }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    email: "",
    pickupAddress: "",
    laundryType: "",
    paymentMethod: "",
    pickupDate: "",
    pickupTime: "",
    partnerName: prefilledPartner,
    status: initialData?.status || "Pending",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else if (prefilledPartner) {
      setFormData((prev) => ({ ...prev, partnerName: prefilledPartner }));
    }
  }, [initialData, prefilledPartner]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // Customer Name is required
    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer Name is required";
    }

    // Phone Number must contain exactly 10 digits
    if (!formData.phoneNumber.toString().trim()) {
      newErrors.phoneNumber = "Phone Number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber.toString().trim())) {
      newErrors.phoneNumber = "Phone Number must contain exactly 10 digits";
    }

    // Email must be a valid email address
    if (!formData.email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Email must be a valid email address";
    }

    // Pickup Address is required
    if (!formData.pickupAddress.trim()) {
      newErrors.pickupAddress = "Pickup Address is required";
    }

    // Laundry Type must be selected
    if (!formData.laundryType) {
      newErrors.laundryType = "Laundry Type must be selected";
    }

    // Payment Method must be selected
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Payment Method must be selected";
    }

    // Pickup Date cannot be in the past
    if (!formData.pickupDate) {
      newErrors.pickupDate = "Pickup Date is required";
    } else {
      const selectedDate = new Date(formData.pickupDate + "T00:00:00");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.pickupDate = "Pickup Date cannot be in the past";
      }
    }

    // Pickup Time is required
    if (!formData.pickupTime) {
      newErrors.pickupTime = "Pickup Time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      if (initialData && initialData.id) {
        // Update existing booking
        await updateBooking(initialData.id, formData);
        setSuccessMessage("Booking updated successfully.");
      } else {
        // Save new booking using JSON Server through Axios
        await createBooking(formData);
        setSuccessMessage("Booking placed successfully.");
      }

      // Clear form after successful booking
      setFormData({
        customerName: "",
        phoneNumber: "",
        email: "",
        pickupAddress: "",
        laundryType: "",
        paymentMethod: "",
        pickupDate: "",
        pickupTime: "",
        partnerName: "",
        status: "Pending",
      });

      // Redirect to Admin Dashboard
      setTimeout(() => {
        navigate("/admin");
      }, 1200);
    } catch (error) {
      console.error("Error saving booking:", error);
      alert("Failed to save booking. Please ensure JSON Server is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header Banner */}
      <div className="bg-[#086e96] px-8 py-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {initialData ? "Edit Booking Details" : "Schedule Laundry Pickup"}
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              Fill out the form below to confirm your pickup request.
            </p>
          </div>
          {formData.partnerName && (
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-right">
              <span className="text-xs uppercase tracking-wider text-blue-200 block font-semibold">
                Partner Laundry
              </span>
              <span className="text-sm font-bold text-white block">
                {formData.partnerName}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="p-8">
        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold text-sm sm:text-base">{successMessage} Redirecting to bookings...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Section 1: Customer Information */}
          <div className="bg-slate-50/70 p-6 rounded-xl border border-gray-100 space-y-4">
            <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2 border-b border-gray-200 pb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Customer Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all outline-none ${
                    errors.customerName
                      ? "border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/30"
                      : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
                  }`}
                />
                {errors.customerName && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.customerName}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all outline-none ${
                    errors.phoneNumber
                      ? "border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/30"
                      : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
                  }`}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.phoneNumber}</p>
                )}
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all outline-none ${
                  errors.email
                    ? "border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/30"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Pickup Address */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Pickup Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="pickupAddress"
                value={formData.pickupAddress}
                onChange={handleChange}
                rows={3}
                placeholder="Enter complete street address, house number, area"
                className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all outline-none ${
                  errors.pickupAddress
                    ? "border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/30"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
                }`}
              ></textarea>
              {errors.pickupAddress && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.pickupAddress}</p>
              )}
            </div>
          </div>

          {/* Section 2: Laundry & Payment Details */}
          <div className="bg-slate-50/70 p-6 rounded-xl border border-gray-100 space-y-4">
            <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2 border-b border-gray-200 pb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Laundry & Service Options
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Laundry Type Dropdown */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Laundry Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="laundryType"
                  value={formData.laundryType}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all outline-none bg-white ${
                    errors.laundryType
                      ? "border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
                >
                  <option value="">-- Select Laundry Service --</option>
                  <option value="Wash">Wash</option>
                  <option value="Dry Cleaning">Dry Cleaning</option>
                  <option value="Ironing">Ironing</option>
                </select>
                {errors.laundryType && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.laundryType}</p>
                )}
              </div>

              {/* Payment Method Radio Group */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4 mt-2">
                  <label className={`flex-1 flex items-center justify-center p-3 rounded-lg border cursor-pointer text-sm font-medium transition-all ${
                    formData.paymentMethod === "Cash on Delivery"
                      ? "border-blue-600 bg-blue-50/60 text-blue-700 font-bold"
                      : "border-gray-200 bg-white hover:border-blue-300 text-gray-700"
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={formData.paymentMethod === "Cash on Delivery"}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mr-2"
                    />
                    Cash on Delivery
                  </label>

                  <label className={`flex-1 flex items-center justify-center p-3 rounded-lg border cursor-pointer text-sm font-medium transition-all ${
                    formData.paymentMethod === "Online Payment"
                      ? "border-blue-600 bg-blue-50/60 text-blue-700 font-bold"
                      : "border-gray-200 bg-white hover:border-blue-300 text-gray-700"
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Online Payment"
                      checked={formData.paymentMethod === "Online Payment"}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mr-2"
                    />
                    Online Payment
                  </label>
                </div>
                {errors.paymentMethod && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.paymentMethod}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Schedule Pickup Details */}
          <div className="bg-slate-50/70 p-6 rounded-xl border border-gray-100 space-y-4">
            <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2 border-b border-gray-200 pb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Pickup Schedule
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pickup Date */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Pickup Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all outline-none bg-white ${
                    errors.pickupDate
                      ? "border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
                />
                {errors.pickupDate && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.pickupDate}</p>
                )}
              </div>

              {/* Pickup Time */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Pickup Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="pickupTime"
                  value={formData.pickupTime}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all outline-none bg-white ${
                    errors.pickupTime
                      ? "border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
                />
                {errors.pickupTime && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.pickupTime}</p>
                )}
              </div>
            </div>
          </div>

          {initialData && (
            <div className="bg-amber-50/70 p-6 rounded-xl border border-amber-100 space-y-4">
              <h3 className="text-lg font-bold text-amber-900 flex items-center gap-2 border-b border-amber-200 pb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Admin Settings
              </h3>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Booking Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm transition-all outline-none bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#fa7354] hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Booking...
                </>
              ) : initialData ? (
                "Update Booking"
              ) : (
                "Book Now"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;
