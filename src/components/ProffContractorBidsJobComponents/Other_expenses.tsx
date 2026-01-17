/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { useState, useEffect, useMemo } from 'react';

const LOCAL_STORAGE_KEY = "expenses";

interface ExpenseItem {
  expenseType: string;
  amount: number;
}

interface OtherExpensesProps {
  onPrevClick: () => void;
  onNextClick: () => void;
  selectedBid?: { expenses?: ExpenseItem[] } | null;
  response: any;
}

const OtherExpenses = ({ onPrevClick, onNextClick, selectedBid, response }: OtherExpensesProps) => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // This useEffect now populates the component's state based on the props
  useEffect(() => {
    // Case 1: Admin is viewing a specific selected bid (read-only)
    if (selectedBid) {
      setIsReadOnly(true);
      setExpenses(selectedBid.expenses || []);
      return;
    }

    // Case 2: User is viewing their own submitted bid (read-only)
    if (response && response.stage !== 'BID_INVITED') {
      setIsReadOnly(true);
      setExpenses(response.userBid?.expenses || []);
    }
    // Case 3: User is creating a new bid (editable)
    else {
      setIsReadOnly(false);
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      setExpenses(savedData ? JSON.parse(savedData) : []);
    }
  }, [response, selectedBid]);

  const total = useMemo(() => {
    return expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  }, [expenses]);

  const handleInputChange = (index: number, field: keyof ExpenseItem, value: string | number) => {
    if (isReadOnly) return;
    const updatedExpenses = [...expenses];
    const processedValue = field === 'amount' ? Number(value) || 0 : value;
    updatedExpenses[index] = { ...updatedExpenses[index], [field]: processedValue };
    setExpenses(updatedExpenses);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedExpenses));
  };

  const handleDeleteRow = (indexToDelete: number) => {
    if (isReadOnly) return;
    const updatedExpenses = expenses.filter((_, index) => index !== indexToDelete);
    setExpenses(updatedExpenses);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedExpenses));
    setSaveMessage("Row removed successfully.");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const addNewRow = () => {
    if (isReadOnly) return;
    const newExpense: ExpenseItem = { expenseType: "", amount: 0 };
    setExpenses(prev => [...prev, newExpense]);
  };

  const clearTable = () => {
    if (isReadOnly) return;
    setExpenses([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setSaveMessage("Table cleared successfully.");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  return (
    <>
      <div className="container mx-auto p-4 md:p-6 bg-white shadow-lg rounded-lg border border-gray-200">
        <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Other Expenses</h2>
          {isReadOnly && (
            <div className="p-3 mb-4 rounded text-center text-yellow-800 bg-yellow-100 border border-yellow-300">
              This expense sheet is view-only and cannot be edited.
            </div>
          )}
          {saveMessage && (
            <div className={`p-3 mb-4 rounded text-center text-sm font-medium ${saveMessage.includes('removed') || saveMessage.includes('cleared') ? 'text-red-700 bg-red-100' : 'text-green-700 bg-green-100'}`}>
              {saveMessage}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-600 font-semibold">Expense Type</th>
                  <th className="px-4 py-3 text-right text-gray-600 font-semibold">Amount (Kes)</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={item.expenseType}
                        onChange={(e) => handleInputChange(index, "expenseType", e.target.value)}
                        className="w-full bg-transparent p-2 focus:outline-none focus:border-b focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="e.g., Travel"
                        disabled={isReadOnly}
                      />
                    </td>
                    <td className="px-4 py-2 text-right">
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => handleInputChange(index, "amount", e.target.value)}
                        className="w-32 text-right bg-transparent p-2 focus:outline-none focus:border-b focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="0"
                        disabled={isReadOnly}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDeleteRow(index)}
                        className="font-medium text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                        disabled={isReadOnly}
                      >
                        Clear
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={addNewRow}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isReadOnly}
            >
              Add Expense
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-end">
          <div className="w-full sm:w-auto sm:min-w-[300px] p-4 bg-gray-50 border border-gray-300 rounded-lg flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total Expenses (Kes)</span>
            <span className="font-bold text-xl text-gray-900">{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-8 space-y-4 md:space-y-0 md:space-x-4">
          <button onClick={onPrevClick} className="w-full md:w-auto bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 border border-gray-400">
            Back
          </button>
          <div className="w-full md:w-auto flex justify-end gap-4">
            <button
              onClick={clearTable}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed"
              disabled={isReadOnly}
            >
              Clear All
            </button>
            <button onClick={onNextClick} className="bg-blue-900 text-white font-semibold py-2 px-8 rounded-lg hover:bg-blue-800">
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OtherExpenses;