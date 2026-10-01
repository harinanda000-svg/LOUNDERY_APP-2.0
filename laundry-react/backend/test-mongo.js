const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/test", { serverSelectionTimeoutMS: 2000 })
  .then(() => { console.log("Connected!"); process.exit(0); })
  .catch(err => { console.error("Error:", err.message); process.exit(1); });
