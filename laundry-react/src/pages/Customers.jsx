import { useState, useEffect, useRef } from "react";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "../services/api";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [feedback, setFeedback] = useState({ msg: "", type: "" });
  const [saving, setSaving] = useState(false);
  const nameInputRef = useRef(null);

  const emptyForm = { name: "", email: "", phone: "", address: "", notes: "" };
  const [form, setForm] = useState(emptyForm);

  // Load customers on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Auto-focus name input when modal opens
  useEffect(() => {
    if (showModal && nameInputRef.current) {
      setTimeout(() => nameInputRef.current.focus(), 150);
    }
  }, [showModal]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch (err) {
      showFeedback("Failed to load customers.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (msg, type = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback({ msg: "", type: "" }), 3500);
  };

  // Open modal for create
  const handleOpenCreate = () => {
    setEditingCustomer(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  // Open modal for edit
  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer);
    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      notes: customer.notes || "",
    });
    setShowModal(true);
  };

  // Submit create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.address.trim()) {
      showFeedback("Please fill in all required fields.", "error");
      return;
    }
    setSaving(true);
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer._id, form);
        showFeedback("Customer updated successfully!");
      } else {
        await createCustomer(form);
        showFeedback("Customer created successfully!");
      }
      setShowModal(false);
      setForm(emptyForm);
      setEditingCustomer(null);
      await fetchCustomers();
    } catch (err) {
      showFeedback(err.response?.data?.message || err.response?.data?.error || "Something went wrong.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    setSaving(true);
    try {
      await deleteCustomer(id);
      showFeedback("Customer deleted successfully!");
      setDeleteConfirm(null);
      await fetchCustomers();
    } catch (err) {
      showFeedback("Failed to delete customer.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Filtered customers
  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#eef6fc] pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      {/* ===== Header ===== */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brandLight text-white shadow-md">
              <i className="ri-group-line text-xl"></i>
            </span>
            <span>
              <span className="text-brand">Customer</span> Management
            </span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 ml-[52px]">
            Create, view, edit & delete customer records
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-gradient-to-r from-brand to-[#0a8ab8] hover:from-[#075a7d] hover:to-brand text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
        >
          <i className="ri-user-add-line text-lg group-hover:scale-110 transition-transform"></i>
          Add Customer
        </button>
      </div>

      {/* ===== Feedback Toast ===== */}
      {feedback.msg && (
        <div className="max-w-6xl mx-auto mb-4 animate-[slideUp_0.3s_ease-out]">
          <div
            className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 border shadow-sm ${
              feedback.type === "error"
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-emerald-50 border-emerald-200 text-emerald-700"
            }`}
          >
            <i
              className={`text-lg ${
                feedback.type === "error" ? "ri-error-warning-line" : "ri-checkbox-circle-line"
              }`}
            ></i>
            {feedback.msg}
          </div>
        </div>
      )}

      {/* ===== Search & Stats Bar ===== */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-grow group">
          <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors"></i>
          <input
            type="text"
            placeholder="Search customers by name, email, phone or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-gray-700 text-sm shadow-sm transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm flex items-center gap-3">
            <i className="ri-team-line text-brand text-lg"></i>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Total</p>
              <p className="text-lg font-bold text-gray-800 leading-none">{customers.length}</p>
            </div>
          </div>
          <button
            onClick={fetchCustomers}
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <i className={`ri-refresh-line text-lg text-gray-500 ${loading ? "animate-spin" : ""}`}></i>
          </button>
        </div>
      </div>

      {/* ===== Customers Table ===== */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <div className="w-10 h-10 border-4 border-brand/20 border-t-brand rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-medium">Loading customers...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <i className="ri-user-search-line text-5xl mb-3"></i>
              <p className="text-sm font-medium">
                {search ? "No customers match your search." : "No customers yet. Add your first customer!"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-50/50 border-b border-gray-100">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Address</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Notes</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((customer) => (
                    <tr
                      key={customer._id}
                      className="hover:bg-brand/[0.02] transition-colors group"
                    >
                      {/* Name + Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-brandLight flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{customer.name}</p>
                            <p className="text-xs text-gray-400 truncate">{customer.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 flex items-center gap-1.5">
                          <i className="ri-phone-line text-gray-400"></i>
                          {customer.phone}
                        </span>
                      </td>

                      {/* Address */}
                      <td className="px-6 py-4 hidden md:table-cell">
                        <p className="text-sm text-gray-600 truncate max-w-[200px]" title={customer.address}>
                          {customer.address}
                        </p>
                      </td>

                      {/* Notes */}
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <p className="text-sm text-gray-400 italic truncate max-w-[180px]" title={customer.notes}>
                          {customer.notes || "—"}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEdit(customer)}
                            className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <i className="ri-edit-line text-lg"></i>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(customer)}
                            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <i className="ri-delete-bin-6-line text-lg"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ===== Create / Edit Modal ===== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
            onClick={() => {
              setShowModal(false);
              setEditingCustomer(null);
              setForm(emptyForm);
            }}
          ></div>

          {/* Modal Card */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 animate-[slideUp_0.3s_ease-out] border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <i className={`${editingCustomer ? "ri-edit-2-line text-blue-600" : "ri-user-add-line text-brand"} text-xl`}></i>
                {editingCustomer ? "Edit Customer" : "Add New Customer"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingCustomer(null);
                  setForm(emptyForm);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="input-group">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <i className="ri-user-line absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    ref={nameInputRef}
                    type="text"
                    placeholder="e.g. John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-gray-700 text-sm shadow-sm"
                  />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="input-group">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <i className="ri-mail-line absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-gray-700 text-sm shadow-sm"
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Phone <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <i className="ri-phone-line absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="tel"
                      placeholder="+94 77 123 4567"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-gray-700 text-sm shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="input-group">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <i className="ri-map-pin-line absolute left-3.5 top-3.5 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="123 Main St, Colombo"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-gray-700 text-sm shadow-sm"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="input-group">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Notes <span className="text-gray-300">(optional)</span>
                </label>
                <textarea
                  placeholder="Any special notes about this customer..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-gray-700 resize-none text-sm shadow-sm"
                ></textarea>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCustomer(null);
                    setForm(emptyForm);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 font-semibold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-brand to-[#0a8ab8] hover:from-[#075a7d] hover:to-brand text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className={editingCustomer ? "ri-check-line" : "ri-add-line"}></i>
                      {editingCustomer ? "Update Customer" : "Create Customer"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== Delete Confirmation Modal ===== */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
            onClick={() => setDeleteConfirm(null)}
          ></div>

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 animate-[slideUp_0.3s_ease-out] border border-gray-100 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <i className="ri-delete-bin-6-line text-3xl text-red-500"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Customer?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-700">{deleteConfirm.name}</span>?
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 font-semibold text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm._id)}
                disabled={saving}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <i className="ri-delete-bin-line"></i>
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
