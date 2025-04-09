import { useState, useEffect } from 'react'
import { Button } from "/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card"
import { Input } from "/components/ui/input"
import { Label } from "/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "/components/ui/select"
import { Download, Edit, Trash2 } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "/components/ui/table"

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses')
    return saved ? JSON.parse(saved) : []
  })
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    amount: 0,
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    description: ''
  })
  const [selectedMonth, setSelectedMonth] = useState('all-months')
  const [selectedCategory, setSelectedCategory] = useState('all-categories')
  const [currentPage, setCurrentPage] = useState(1)

  const categories = ['Food', 'Transportation', 'Housing', 'Entertainment', 'Utilities', 'Healthcare', 'Other']
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  // Special values for "All" options
  const ALL_CATEGORIES = 'all-categories'
  const ALL_MONTHS = 'all-months'

  // Pagination constants
  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.amount <= 0) return

    if (editingId) {
      setExpenses(prev => prev.map(exp => 
        exp.id === editingId ? { ...formData, id: editingId } : exp
      ))
      setEditingId(null)
    } else {
      setExpenses(prev => [...prev, {
        ...formData,
        id: Date.now().toString()
      }])
    }

    setFormData({
      amount: 0,
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
      description: ''
    })
    setCurrentPage(1)
  }

  const handleEdit = (expense) => {
    setFormData({
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      description: expense.description
    })
    setEditingId(expense.id)
  }

  const handleDelete = (id) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setFormData({
        amount: 0,
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        description: ''
      })
    }
    if (filteredExpenses.length % ITEMS_PER_PAGE === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const filteredExpenses = expenses.filter(expense => {
    const expenseMonth = new Date(expense.date).getMonth()
    const matchesMonth = selectedMonth === ALL_MONTHS || months[expenseMonth] === selectedMonth
    const matchesCategory = selectedCategory === ALL_CATEGORIES || expense.category === selectedCategory
    return matchesMonth && matchesCategory
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedExpenses = filteredExpenses.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const getChartData = () => {
    const currentMonth = selectedMonth === ALL_MONTHS ? months[new Date().getMonth()] : selectedMonth
    const monthIndex = months.indexOf(currentMonth)
    const year = new Date().getFullYear()

    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === monthIndex && expenseDate.getFullYear() === year
    })

    const categoryTotals = categories.map(category => {
      const total = monthExpenses
        .filter(exp => exp.category === category)
        .reduce((sum, exp) => sum + exp.amount, 0)
      return { name: category, total }
    })

    return categoryTotals.filter(item => item.total > 0)
  }

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  // CSV Export function
  const exportToCSV = () => {
    const headers = ['Date', 'Category', 'Amount (₹)', 'Description']
    const csvRows = [
      headers.join(','),
      ...filteredExpenses.map(expense => [
        expense.date,
        `"${expense.category}"`,
        expense.amount.toFixed(2),
        `"${expense.description}"`
      ].join(','))
    ]
    
    const csvContent = csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Expense Tracker</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Expense Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Expense' : 'Add New Expense'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount || ''}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Optional"
                />
              </div>
              
              <Button type="submit" className="w-full">
                {editingId ? 'Update Expense' : 'Add Expense'}
              </Button>
              
              {editingId && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setEditingId(null)
                    setFormData({
                      amount: 0,
                      category: 'Food',
                      date: new Date().toISOString().split('T')[0],
                      description: ''
                    })
                  }}
                >
                  Cancel
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
        
        {/* Expense List and Summary */}
        <div className="lg:col-span-2 space-y-8">
          {/* Filters and Summary */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Summary</CardTitle>
                <Button variant="outline" onClick={exportToCSV}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Filter by Month</Label>
                  <Select
                    value={selectedMonth}
                    onValueChange={(value) => {
                      setSelectedMonth(value)
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All months" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_MONTHS}>All months</SelectItem>
                      {months.map(month => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Filter by Category</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => {
                      setSelectedCategory(value)
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_CATEGORIES}>All categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold">₹{totalExpenses.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Number of Expenses</p>
                  <p className="text-2xl font-bold">{filteredExpenses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}`, 'Total']} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Expense Table with Pagination */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Expense History</CardTitle>
                {filteredExpenses.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {paginatedExpenses.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No expenses found</p>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount (₹)</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedExpenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell className="font-medium">
                            {new Date(expense.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{expense.category}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {expense.description || '-'}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            ₹{expense.amount.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(expense)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(expense.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-4">
                      <Button
                        variant="outline"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Previous
                      </Button>
                      <div className="text-sm">
                        Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredExpenses.length)} of {filteredExpenses.length} expenses
                      </div>
                      <Button
                        variant="outline"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ExpenseTracker