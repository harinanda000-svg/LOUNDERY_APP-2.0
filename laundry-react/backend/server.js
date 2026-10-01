const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const { promises: fsPromises } = require("fs");
const path = require("path");
const { fileURLToPath } = require("url");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

// __filename and __dirname are automatically available in CommonJS modules

const app = express();

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/laundary-app-new2";

app.use(cors());
app.use(express.json());


// ======================================================
// MONGODB CONNECTION
// ======================================================

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });


// ======================================================
// USER SCHEMA
// ======================================================

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);


// ======================================================
// USER MODEL
// ======================================================

const User = mongoose.model("User", userSchema);


// ======================================================
// AUTH ROUTES
// ======================================================


// SIGNUP
// POST /api/auth/signup

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "User already exists with this email",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    // Return user data without password
    res.status(201).json({
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      error: "Failed to create account",
      message: error.message,
    });
  }
});


// LOGIN
// POST /api/auth/login

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Return user data without password
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      error: "Login failed",
      message: error.message,
    });
  }
});


// GET ALL USERS (for admin)
// GET /api/auth/users

app.get("/api/auth/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch users",
    });
  }
});


// ======================================================
// BOOKING SCHEMA
// ======================================================

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    pickupAddress: {
      type: String,
      required: true,
    },

    laundryType: {
      type: String,
      enum: ["Wash", "Dry Cleaning", "Ironing"],
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery", "Online"],
      required: true,
    },

    pickupDate: {
      type: String,
      required: true,
    },

    pickupTime: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);


// ======================================================
// BOOKING MODEL
// ======================================================

const Booking = mongoose.model("Booking", bookingSchema);


// ======================================================
// CRUD OPERATIONS
// ======================================================


// CREATE BOOKING
// POST /api/bookings

app.post("/api/bookings", async (req, res) => {
  try {
    const booking = new Booking(req.body);

    const savedBooking = await booking.save();

    res.status(201).json(savedBooking);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create booking",
      message: error.message,
    });
  }
});


// READ ALL BOOKINGS
// GET /api/bookings

app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch bookings",
    });
  }
});


// READ ONE BOOKING
// GET /api/bookings/:id

app.get("/api/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        error: "Booking not found",
      });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch booking",
    });
  }
});


// UPDATE BOOKING
// PUT /api/bookings/:id

app.put("/api/bookings/:id", async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedBooking) {
      return res.status(404).json({
        error: "Booking not found",
      });
    }

    res.json(updatedBooking);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update booking",
      message: error.message,
    });
  }
});


// DELETE BOOKING
// DELETE /api/bookings/:id

app.delete("/api/bookings/:id", async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(
      req.params.id
    );

    if (!deletedBooking) {
      return res.status(404).json({
        error: "Booking not found",
      });
    }

    res.json({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete booking",
    });
  }
});


// ======================================================
// CUSTOMER SCHEMA
// ======================================================

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);


// ======================================================
// CUSTOMER MODEL
// ======================================================

const Customer = mongoose.model("Customer", customerSchema);


// ======================================================
// CUSTOMER CRUD OPERATIONS
// ======================================================


// CREATE CUSTOMER
// POST /api/customers

app.post("/api/customers", async (req, res) => {
  try {
    const customer = new Customer(req.body);

    const savedCustomer = await customer.save();

    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create customer",
      message: error.message,
    });
  }
});


// READ ALL CUSTOMERS
// GET /api/customers

app.get("/api/customers", async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });

    res.json(customers);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch customers",
    });
  }
});


// READ ONE CUSTOMER
// GET /api/customers/:id

app.get("/api/customers/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        error: "Customer not found",
      });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch customer",
    });
  }
});


// UPDATE CUSTOMER
// PUT /api/customers/:id

app.put("/api/customers/:id", async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCustomer) {
      return res.status(404).json({
        error: "Customer not found",
      });
    }

    res.json(updatedCustomer);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update customer",
      message: error.message,
    });
  }
});


// DELETE CUSTOMER
// DELETE /api/customers/:id

app.delete("/api/customers/:id", async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(
      req.params.id
    );

    if (!deletedCustomer) {
      return res.status(404).json({
        error: "Customer not found",
      });
    }

    res.json({
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete customer",
    });
  }
});


// ======================================================
// NODE.JS FILE SYSTEM - LAB 7
// ======================================================

const FS_DIR = path.join(__dirname, "fs-files");

// Ensure the fs-files directory exists on startup
if (!fs.existsSync(FS_DIR)) {
  fs.mkdirSync(FS_DIR, { recursive: true });
}

// Helper: sanitize filename to prevent path traversal
const sanitizeFilename = (name) => {
  if (!name) return null;
  // Strip directory components and only keep the base filename
  return path.basename(name);
};


// 0. LIST FILES
// GET /api/fs/list

app.get("/api/fs/list", (req, res) => {
  fs.readdir(FS_DIR, (error, files) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      files: files,
    });
  });
});


// 1. CREATE / WRITE FILE
// POST /api/fs/create

app.post("/api/fs/create", (req, res) => {
  const filename = sanitizeFilename(req.body.filename);
  if (!filename) {
    return res.status(400).json({ success: false, error: "Filename is required" });
  }

  const content = req.body.content || "Elite Clean Laundry File System Demo\n";
  const filePath = path.join(FS_DIR, filename);

  fs.writeFile(filePath, content, "utf8", (error) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      message: `File '${filename}' created successfully`,
    });
  });
});


// 2. READ FILE
// GET /api/fs/read

app.get("/api/fs/read", (req, res) => {
  const filename = sanitizeFilename(req.query.filename);
  if (!filename) {
    return res.status(400).json({ success: false, error: "Filename is required" });
  }

  const filePath = path.join(FS_DIR, filename);

  fs.readFile(filePath, "utf8", (error, data) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      data: data,
    });
  });
});


// 3. APPEND DATA
// POST /api/fs/append

app.post("/api/fs/append", (req, res) => {
  const filename = sanitizeFilename(req.body.filename);
  if (!filename) {
    return res.status(400).json({ success: false, error: "Filename is required" });
  }

  const content = req.body.content || "New laundry booking data\n";
  const filePath = path.join(FS_DIR, filename);

  fs.appendFile(filePath, content, "utf8", (error) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      message: `Data appended to '${filename}' successfully`,
    });
  });
});


// 4. MODIFY / UPDATE FILE
// POST /api/fs/modify

app.post("/api/fs/modify", async (req, res) => {
  const filename = sanitizeFilename(req.body.filename);
  if (!filename) {
    return res.status(400).json({ success: false, error: "Filename is required" });
  }

  const content = req.body.content || "Modified Elite Clean data\n";
  const filePath = path.join(FS_DIR, filename);

  try {
    await fsPromises.writeFile(filePath, content, "utf8");

    res.json({
      success: true,
      message: `File '${filename}' modified successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});


// 5. RENAME FILE
// POST /api/fs/rename

app.post("/api/fs/rename", async (req, res) => {
  const oldName = sanitizeFilename(req.body.oldFilename);
  const newName = sanitizeFilename(req.body.newFilename);

  if (!oldName || !newName) {
    return res.status(400).json({ success: false, error: "Both oldFilename and newFilename are required" });
  }

  const oldPath = path.join(FS_DIR, oldName);
  const newPath = path.join(FS_DIR, newName);

  try {
    await fsPromises.rename(oldPath, newPath);

    res.json({
      success: true,
      message: `File renamed from '${oldName}' to '${newName}'`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});


// 6. DELETE FILE
// DELETE /api/fs/delete

app.delete("/api/fs/delete", async (req, res) => {
  const filename = sanitizeFilename(req.body.filename);
  if (!filename) {
    return res.status(400).json({ success: false, error: "Filename is required" });
  }

  const filePath = path.join(FS_DIR, filename);

  try {
    await fsPromises.unlink(filePath);

    res.json({
      success: true,
      message: `File '${filename}' deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});


// ======================================================
// START SERVER
// ======================================================

app.listen(PORT, () => {
  console.log(
    `Backend server running on http://localhost:${PORT}`
  );
});