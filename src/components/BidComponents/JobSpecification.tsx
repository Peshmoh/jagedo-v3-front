import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { TiTick } from "react-icons/ti";
import { useNavigate } from "react-router-dom"

interface JobSpecificationProps {
  jobData: any;
}

function JobSpecification({ jobData }: JobSpecificationProps) {
  const navigate = useNavigate()
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  return (
    <section className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
        <h1 className="text-2xl font-bold text-gray-800">{jobData?.jobId || "N/A"}</h1>
        <h2 className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
          Created: {formatDateTime(jobData?.createdAt)}
        </h2>
      </div>

      {/* Job Detail Section */}
      <div className="p-8 my-6 rounded-xl shadow-lg bg-white hover:shadow-xl transition-all duration-300 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Job Details</h2>

        <div className="flex justify-between gap-8">
          {/* Left Column */}
          <div className="w-1/2 space-y-4">
            {[
              { label: "Job Type", value: jobData?.jobType || "N/A" },
              { label: "Skill", value: jobData?.skill || "N/A" },
              { label: "Location", value: jobData?.location || "N/A" },
              { label: "Start Date", value: formatDate(jobData?.startDate) },
              { label: "End Date", value: formatDate(jobData?.endDate) },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200"
              >
                <span className="font-semibold text-gray-800 w-24">
                  {item.label}:
                </span>
                <span className="text-gray-700">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="w-1/2 pl-8 border-l border-gray-200 space-y-4">
            {/* Download Receipt Section */}
            {jobData?.payments.length > 0 && (
              <div
                className="flex items-center space-x-2 bg-green-500 p-4 rounded-lg border border-gray-200 opacity-60 cursor-pointer hover:bg-green-600 hover:opacity-100 hover:shadow-md"
                onClick={() => navigate(`/receipts/${jobData?.payments[jobData?.payments.length - 1].id}`)}
              >
                {/* Download Icon */}
                <ArrowDownTrayIcon
                  className="h-6 w-6 text-white"
                />
                <span className="font-medium text-white">
                  Download Receipt
                </span>
              </div>)}

            {/* Managed by Jagedo Section */}
            <div className="bg-blue-50 p-4 rounded-2xl shadow-md border border-gray-200">
              <h3 className="text-2xl font-bold text-blue-900">
                Managed by {jobData?.managedBy || "Jagedo"}
              </h3>
            </div>

            {/* Package Details Section */}
            <div className="bg-blue-50 p-4 rounded-2xl shadow-md mt-4 border border-gray-200">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">
                Package details
              </h3>
              <p className="text-lg font-semibold text-gray-800">
                Jagedo Oversees
              </p>

              <ul className="space-y-3 mt-4 text-gray-700">
                <li className="flex items-center">
                  <TiTick className="text-green-500 mr-2 text-xl" />
                  Arrival time
                </li>
                <li className="flex items-center">
                  <TiTick className="text-green-500 mr-2 text-xl" />
                  Scope budget
                </li>
                <li className="flex items-center">
                  <TiTick className="text-green-500 mr-2 text-xl" />
                  Quality through a peer review & professionalism
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Job Description and Attachments */}
      <div className="grid grid-cols-4 gap-6 bg-white p-8 shadow-lg rounded-xl border border-gray-200">
        {/* Job Description */}
        <div className="col-span-2 pr-6 border-r border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Job Description
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {jobData?.description || jobData?.customerNotes || "No description available"}
          </p>
        </div>

        {/* Files Table */}
        <div className="col-span-2">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                  File Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                  Attachment
                </th>
              </tr>
            </thead>
            <tbody>
              {jobData?.attachments && jobData.attachments.length > 0 ? (
                jobData.attachments.map((file: any, index: number) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4 border-t border-gray-200">
                      {file.name || `Attachment ${index + 1}`}
                    </td>
                    <td className="px-6 py-4 border-t border-gray-200 flex items-center gap-4">
                      <a
                        href={file.url || "#"}
                        download
                        className="text-blue-900 hover:text-blue-700 flex items-center gap-2 transition-colors"
                      >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                        Download
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-center text-gray-500">
                    No attachments available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <br className="my-6 border-gray-200" />

      {/* Admin Notes and Admin Attachments */}
      <div className="grid grid-cols-4 gap-6 bg-white p-8 shadow-lg rounded-xl border border-gray-200">
        <div className="col-span-2 pr-6 border-r border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Admin Notes
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {jobData?.adminNotes || "No admin notes available"}
          </p>
        </div>

        {/* Admin Files Table */}
        <div className="col-span-2">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                  File Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                  Attachment
                </th>
              </tr>
            </thead>
            <tbody>
              {jobData?.adminAttachments && jobData.adminAttachments.length > 0 ? (
                jobData.adminAttachments.map((file: any, index: number) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4 border-t border-gray-200">
                      {file.name || `Admin Attachment ${index + 1}`}
                    </td>
                    <td className="px-6 py-4 border-t border-gray-200 flex items-center gap-4">
                      <a
                        href={file.url || "#"}
                        download
                        className="text-blue-900 hover:text-blue-700 flex items-center gap-2 transition-colors"
                      >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                        Download
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-center text-gray-500">
                    No admin attachments available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default JobSpecification;
