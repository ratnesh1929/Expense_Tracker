const Expense = require("../models/Expense");
const mongoose = require("mongoose");
const { Parser } = require("json2csv");

exports.exportJSON = async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ msg: 'Month parameter is required (YYYY-MM format)' });
  }

  try {
    const start = new Date(`${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const expenses = await Expense.find({
      user: req.user._id,
      date: { $gte: start, $lt: end },
    }).select('-__v -user');

    // Format the data for export
    const formattedData = {
      month,
      totalExpenses: expenses.reduce((sum, exp) => sum + exp.amount, 0),
      expenses: expenses.map(exp => ({
        ...exp.toObject(),
        _id: exp._id.toString(),
        date: exp.date.toISOString().split('T')[0]
      }))
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=expenses-${month}.json`);
    res.status(200).json(formattedData);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to generate export.' });
  }
};

exports.exportCSV = async (req, res) => {
  try {
    const { month } = req.query;

    const start = new Date(`${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const expenses = await Expense.find({
      user: req.user._id,
      date: { $gte: start, $lt: end },
    });

    if (!expenses.length) {
      return res
        .status(404)
        .json({ error: "No expenses found for this month." });
    }

    const fields = ["date", "amount", "category", "description"];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(expenses);

    res.header("Content-Type", "text/csv");
    res.attachment(`expenses-${month}.csv`);
    res.send(csv);
  } catch (err) {
    console.error("CSV Export Error:", err.message);
    res.status(500).json({ error: "Failed to export CSV" });
  }
};

exports.addExpense = async (req, res) => {
  const { amount, category, date, description } = req.body;

  if (amount < 0)
    return res.status(400).json({ msg: "Amount cannot be negative." });

  try {
    const expense = new Expense({
      user: req.user._id,
      amount,
      category,
      date,
      description,
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ msg: "Failed to add expense." });
  }
};

exports.getExpenses = async (req, res) => {
  const { month } = req.query;

  try {
    const start = new Date(`${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const expenses = await Expense.find({
      user: req.user._id,
      date: { $gte: start, $lt: end },
    }).sort({ date: -1 });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch expenses." });
  }
};

exports.updateExpense = async (req, res) => {
  const { id } = req.params;
  const { amount, category, date, description } = req.body;

  try {
    const updated = await Expense.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { amount, category, date, description },
      { new: true }
    );

    if (!updated) return res.status(404).json({ msg: "Expense not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Failed to update expense." });
  }
};

exports.deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Expense.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });
    if (!deleted) return res.status(404).json({ msg: "Expense not found" });

    res.json({ msg: "Expense deleted." });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete expense." });
  }
};

exports.getSummary = async (req, res) => {
  const { month } = req.query;

  try {
    const start = new Date(`${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const summary = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id),
          date: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.json(summary);
  } catch (err) {
    res.status(500).json({ msg: "Failed to generate summary." });
  }
};
