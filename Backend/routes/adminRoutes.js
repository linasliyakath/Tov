const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  login,
  logout,
  getAllUsers,
  addProducts,
  getAllProducts,
  deleteProduct,
  getCategories,
  updateProduct,
  addCategory,
  deleteCategory,
  updateStatus,
  getOrders,
  deleteOrder,
  deleteProductById,
  toggleActive,
} = require("../controllers/adminController");
const { isadmin } = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.post("/login", login);
router.delete("/logout", logout);
router.get("/getUsers",isadmin,  getAllUsers);
router.post("/add", upload.single("image"), isadmin, addProducts);
router.get("/getProducts", isadmin, getAllProducts);
router.delete("/deleteProduct", isadmin, deleteProduct);
router.get("/getCategories", isadmin, getCategories);
router.put("/updateProduct/:id", upload.single("image"), isadmin, updateProduct);
router.post("/addCategory", isadmin, addCategory);
router.delete("/deleteCategory/:id", isadmin, deleteCategory);
router.put("/updateStatus/:id", isadmin, updateStatus);
router.get("/getOrders", isadmin, getOrders);
router.delete("/deleteproductById/:id", isadmin, deleteProductById);
router.patch('/users/:userId/toggle-active',isadmin, toggleActive);

module.exports = router;
