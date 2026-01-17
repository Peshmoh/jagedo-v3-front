/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { useState, useEffect, useMemo } from "react";

const LOCAL_STORAGE_KEY = "professionalFeesWithWorkPlans";

interface WorkPlan {
  billName: string;
  duration: number;
  startDate: string;
  endDate: string;
}

interface ApiWorkPlan {
  name: string;
  startDate: string;
  endDate: string;
  durationDays: number;
}

const toYMDFormat = (isoString: string): string => {
  if (!isoString || !isoString.includes('T')) return isoString;
  try {
    return isoString.split('T')[0];
  } catch {
    return "";
  }
};

const toISOString = (dateString: string): string => {
  if (!dateString) return "";
  try {
    return new Date(dateString + 'T00:00:00.000Z').toISOString();
  } catch {
    return "";
  }
};

interface ProffWorkPlanProps {
  onPrevClick: () => void;
  onNextClick: () => void;
  selectedBid?: { workPlans?: ApiWorkPlan[] } | null;
  response: any; // The full job data object from the parent
}

const ProffWorkPlan = ({ onPrevClick, onNextClick, selectedBid, response }: ProffWorkPlanProps) => {
  const [workPlans, setWorkPlans] = useState<WorkPlan[]>([]);
  const [saveMessage, setSaveMessage] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Helper function to calculate duration
  const calculateDurationInDays = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDate = new Date(start + 'T00:00:00Z');
    const endDate = new Date(end + 'T00:00:00Z');
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate < startDate) return 0;
    const diffTime = endDate.getTime() - startDate.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive duration
  };

  // Helper function to save to localStorage
  const saveToLocalStorage = (currentWorkPlans: WorkPlan[]) => {
    const dataToSave = currentWorkPlans.map(plan => ({
      ...plan,
      startDate: toISOString(plan.startDate),
      endDate: toISOString(plan.endDate),
    }));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
  };

  // Set read-only status based on props
  useEffect(() => {
    if (selectedBid || (response && response.stage !== 'BID_INVITED')) {
      setIsReadOnly(true);
    } else {
      setIsReadOnly(false);
    }
  }, [response, selectedBid]);

  // useMemo to derive the work plans from the correct source (props or localStorage)
  const derivedWorkPlans = useMemo(() => {
    // Case 1: Admin viewing a specific selected bid
    if (selectedBid) {
      const bidWorkPlans = selectedBid.workPlans || [];
      return bidWorkPlans.map((plan: ApiWorkPlan) => ({
        billName: plan.name,
        duration: plan.durationDays,
        startDate: toYMDFormat(plan.startDate),
        endDate: toYMDFormat(plan.endDate),
      }));
    }

    // Case 2: User viewing their own submitted bid
    if (response && response.stage !== 'BID_INVITED') {
      const apiWorkPlans = response.userBid?.workPlans || [];
      return apiWorkPlans.map((plan: ApiWorkPlan) => ({
        billName: plan.name,
        duration: plan.durationDays,
        startDate: toYMDFormat(plan.startDate),
        endDate: toYMDFormat(plan.endDate),
      }));
    }

    // Case 3: User is creating a new bid
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const loadedPlans: WorkPlan[] = JSON.parse(savedData);
        return loadedPlans.map((plan) => {
          const startDate = toYMDFormat(plan.startDate);
          const endDate = toYMDFormat(plan.endDate);
          return {
            billName: plan.billName || "",
            startDate,
            endDate,
            duration: calculateDurationInDays(startDate, endDate),
          };
        });
      } catch (err) {
        console.error("Failed to parse work plans from localStorage:", err);
        return [];
      }
    }

    return [];
  }, [response, selectedBid]);

  useEffect(() => {
    setWorkPlans(derivedWorkPlans);
  }, [derivedWorkPlans]);

  const handleInputChange = (index: number, field: keyof WorkPlan, value: string | number) => {
    if (isReadOnly) return;
    const updatedWorkPlans = workPlans.map((plan, i) => {
      if (i !== index) return plan;
      const updatedPlan = { ...plan, [field]: value };
      const newDuration = calculateDurationInDays(updatedPlan.startDate, updatedPlan.endDate);
      return { ...updatedPlan, duration: newDuration };
    });
    setWorkPlans(updatedWorkPlans);
    saveToLocalStorage(updatedWorkPlans);
  };

  const addNewRow = () => {
    if (isReadOnly) return;
    const newPlan: WorkPlan = { billName: "", duration: 0, startDate: "", endDate: "" };
    const updated = [...workPlans, newPlan];
    setWorkPlans(updated);
    saveToLocalStorage(updated);
  };

  const handleDeleteRow = (indexToDelete: number) => {
    if (isReadOnly) return;
    const updatedWorkPlans = workPlans.filter((_, index) => index !== indexToDelete);
    setWorkPlans(updatedWorkPlans);
    saveToLocalStorage(updatedWorkPlans);
    setSaveMessage("Row removed successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleSaveDraft = () => {
    setSaveMessage("Draft saved successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const clearTable = () => {
    if (isReadOnly) return;
    setWorkPlans([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setSaveMessage("Table cleared successfully.");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  return (
    <>
      <div className="container mx-auto p-4 md:p-6 bg-white shadow-lg rounded-lg border border-gray-200" id="WorkPlan">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Work Plan</h2>
        {isReadOnly && (
          <div className="p-3 mb-4 rounded text-center text-yellow-800 bg-yellow-100 border border-yellow-300">
            This work plan is view-only and cannot be edited.
          </div>
        )}
        {saveMessage && (
          <div className={`p-3 mb-4 rounded text-center text-sm font-medium ${saveMessage.includes('removed') || saveMessage.includes('cleared') ? 'text-red-700 bg-red-100' : 'text-green-700 bg-green-100'}`}>
            {saveMessage}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Id</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Start Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">End Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Duration (Days)</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {workPlans.map((row, index) => (
                <tr key={index}>
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">
                    <input type="text" value={row.billName} onChange={(e) => handleInputChange(index, "billName", e.target.value)} className="w-full p-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" disabled={isReadOnly} />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="date"
                      value={row.startDate}
                      min={response?.startDate ? toYMDFormat(response.startDate) : undefined}
                      onChange={(e) => handleInputChange(index, "startDate", e.target.value)}
                      className="w-full p-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      disabled={isReadOnly}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="date"
                      value={row.endDate}
                      onChange={(e) => handleInputChange(index, "endDate", e.target.value)}
                      className="w-full p-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      disabled={isReadOnly}
                      min={row.startDate}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input type="text" value={row.duration} readOnly className="w-full p-1 bg-transparent border-b border-gray-300 text-gray-500 focus:outline-none" />
                  </td>
                  <td className="px-4 py-3">
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
          <button onClick={addNewRow} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={isReadOnly}>Add Row</button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-8 space-y-4 md:space-y-0 md:space-x-4">
          <button onClick={onPrevClick} className="w-full md:w-auto bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 border border-gray-400">Back</button>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            <button onClick={handleSaveDraft} className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={isReadOnly}>Save as Draft</button>
            <button onClick={clearTable} className="w-full sm:w-auto bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed" disabled={isReadOnly}>Clear Table</button>
          </div>
          <button onClick={onNextClick} className="w-full md:w-auto bg-blue-900 text-white font-semibold py-2 px-8 rounded-lg hover:bg-blue-800">Next</button>
        </div>
      </div>
    </>
  );
};

export default ProffWorkPlan;