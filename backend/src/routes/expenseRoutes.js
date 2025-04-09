const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getSummary,
  exportJSON,
  exportCSV,
} = require("../controller/expenseController");

router.use(protect);

router.post("/", addExpense);
router.get("/", getExpenses);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

router.get("/summary", getSummary);
router.get("/export", exportJSON);
router.get("/export/csv", exportCSV);

module.exports = router;
