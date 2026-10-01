import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fsDemo } from "../services/api";

function AdminDashboard() {
  const [filename, setFilename] = useState("");
  const [content, setContent] = useState("");
  const [fileList, setFileList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [feedback, setFeedback] = useState({ msg: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUserStr = localStorage.getItem("currentUser");
    if (!currentUserStr) {
      navigate("/login");
      return;
    }

    try {
      const currentUser = JSON.parse(currentUserStr);
      if (currentUser.role !== "admin") {
        navigate("/home");
        return;
      }
    } catch (e) {
      navigate("/login");
      return;
    }

    loadFileList();
  }, [navigate]);

  const showFeedback = (msg, type = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback({ msg: "", type: "" }), 3500);
  };

  // --- API Handlers ---

  const loadFileList = async () => {
    try {
      const res = await fsDemo.list();
      setFileList(res.data.files || []);
    } catch (err) {
      setFileList([]);
    }
  };

  const handleFileClick = async (file) => {
    setSelectedFile(file);
    setFilename(file);
    setLoading(true);
    try {
      const res = await fsDemo.read(file);
      setContent(res.data.data || "");
    } catch (err) {
      setContent("");
      showFeedback(`Could not read '${file}': ${err.response?.data?.error || err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!filename.trim()) {
      showFeedback("Please enter a filename.", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fsDemo.create(filename.trim(), content);
      showFeedback(res.data.message);
      await loadFileList();
      setSelectedFile(filename.trim());
    } catch (err) {
      showFeedback(`Error: ${err.response?.data?.error || err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAppend = async () => {
    if (!filename.trim()) {
      showFeedback("Please enter a filename to append to.", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fsDemo.append(filename.trim(), content);
      showFeedback(res.data.message);
      // Re-read the file to show updated content
      await handleFileClick(filename.trim());
    } catch (err) {
      showFeedback(`Error: ${err.response?.data?.error || err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleModify = async () => {
    if (!filename.trim()) {
      showFeedback("Please enter a filename to modify.", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fsDemo.modify(filename.trim(), content);
      showFeedback(res.data.message);
      await loadFileList();
    } catch (err) {
      showFeedback(`Error: ${err.response?.data?.error || err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!filename.trim()) {
      showFeedback("Please enter a filename to delete.", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fsDemo.remove(filename.trim());
      showFeedback(res.data.message);
      setContent("");
      setFilename("");
      setSelectedFile(null);
      await loadFileList();
    } catch (err) {
      showFeedback(`Error: ${err.response?.data?.error || err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div className="bg-[#f5f7f9] min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      
      {/* Admin Header */}
      <div className="max-w-5xl mx-auto mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="text-brand">Admin</span> File Manager
          </h1>
          <p className="text-gray-500 text-sm mt-1">Node.js File System operations</p>
        </div>
        <button onClick={handleLogout} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm flex items-center gap-2">
          <i className="ri-logout-box-r-line"></i> Logout
        </button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Left Card: Files */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[450px]">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <i className="ri-folder-3-line text-blue-600"></i> Files
          </h2>
          <div className="space-y-1">
            {fileList.length > 0 ? (
              fileList.map((file, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-all font-medium text-sm ${
                    selectedFile === file
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                  onClick={() => handleFileClick(file)}
                >
                  <i className={`ri-file-text-line text-lg ${selectedFile === file ? "text-blue-600" : "text-gray-400"}`}></i>
                  {file}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <i className="ri-folder-open-line text-5xl mb-3"></i>
                <p className="italic text-sm">No files exist yet. Create one!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Card: Actions */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[450px] flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <i className="ri-settings-3-line text-blue-600"></i> Actions
          </h2>

          <div className="space-y-4 flex-grow">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Filename</label>
              <input
                type="text"
                placeholder="e.g. my-file.txt"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 shadow-sm text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Content</label>
              <textarea
                placeholder="File content goes here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="8"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 resize-none shadow-sm text-sm font-mono"
              ></textarea>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <button
              onClick={handleCreate}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 px-4 rounded-xl font-semibold transition-colors shadow-sm text-sm flex items-center justify-center gap-2"
            >
              <i className="ri-file-add-line"></i> Create File
            </button>
            <button
              onClick={() => { if (filename.trim()) handleFileClick(filename.trim()); else showFeedback("Please enter a filename to read.", "error"); }}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 px-4 rounded-xl font-semibold transition-colors shadow-sm text-sm flex items-center justify-center gap-2"
            >
              <i className="ri-file-search-line"></i> Read File
            </button>
            <button
              onClick={handleAppend}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 px-4 rounded-xl font-semibold transition-colors shadow-sm text-sm flex items-center justify-center gap-2"
            >
              <i className="ri-file-edit-line"></i> Append to ...
            </button>
            <button
              onClick={handleModify}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 px-4 rounded-xl font-semibold transition-colors shadow-sm text-sm flex items-center justify-center gap-2"
            >
              <i className="ri-edit-2-line"></i> Modify ...
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-3 px-4 rounded-xl font-semibold transition-colors shadow-sm text-sm flex items-center justify-center gap-2 col-span-2"
            >
              <i className="ri-delete-bin-line"></i> Delete ...
            </button>
          </div>

          {/* Feedback Message */}
          {feedback.msg && (
            <div
              className={`mt-5 p-3 rounded-lg text-sm font-medium text-center border ${
                feedback.type === "error"
                  ? "bg-red-50 border-red-200 text-red-600"
                  : "bg-green-50 border-green-200 text-green-700"
              }`}
            >
              <i className={`${feedback.type === "error" ? "ri-error-warning-line" : "ri-checkbox-circle-line"} mr-1`}></i>
              {feedback.msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
