/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaEye } from "react-icons/fa";
import type { ReactNode } from "react";

interface JobOrderCardProps {
    item: any;
    getStatusColor: (status: string) => string;
    getStatusIcon: (status: string) => ReactNode;
    onViewDetail: (item: any) => void;
}

const JobOrderCard = ({ item, getStatusColor, getStatusIcon, onViewDetail }: JobOrderCardProps) => {

    const isJob = !!item.jobType;
    if (isJob) {
        const shouldHideStage = item.jobType === "FUNDI" && item.stage === "BID_INVITED";
        return (
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all my-4 w-full">
                {/* Top Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-center mb-4 text-sm sm:text-base">
                    <span className="font-semibold text-gray-800">{item.jobId}</span>
                    <span className="text-gray-600 font-medium">
                        Managed by {item.managedBy === "JAGEDO" ? "JaGedo" : "Self"}
                    </span>
                    <span className="text-gray-600 font-medium">
                        Req Date: {item.startDate ? new Date(item.startDate).toLocaleDateString('en-GB') : 'N/A'}
                    </span>
                    <div className="flex flex-col items-start md:items-end gap-2">
                        <Badge className={`${getStatusColor(item.status)}`}>
                            <div className="flex items-center gap-1">
                                {getStatusIcon(item.status)}
                                {item.status}
                            </div>
                        </Badge>
                        {item.stage && !shouldHideStage && (
                            <Badge variant="outline" className="text-blue-600 border-blue-400">
                                Stage: {item.stage}
                            </Badge>
                        )}
                    </div>
                </div>
                <hr className="border-gray-200 my-3" />
                {/* Bottom Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-center">
                    <span className="text-gray-700 font-medium">{item.skill}</span>
                    <span className="text-gray-600 font-medium">
                        Location: {item.location}
                    </span>
                    <span className="text-gray-600 font-medium">
                        Start Date: {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : 'N/A'}
                    </span>
                    <div className="flex justify-start md:justify-end">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onViewDetail(item)}
                            className="text-gray-500 hover:text-[#00007a] transition-colors"
                        >
                            <FaEye className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // RENDER ORDER CARD
    return (
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all my-4 w-full">
            {/* Top Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-center mb-4 text-sm sm:text-base">
                <span className="font-semibold text-gray-800 col-span-2">
                    Order #{item.id} - {item.type}
                </span>
                <span className="text-gray-600 font-medium">
                    Order Date: {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : 'N/A'}
                </span>
                <div className="flex flex-col items-start md:items-end gap-2">
                    <Badge className={`${getStatusColor(item.status)}`}>
                        <div className="flex items-center gap-1">
                            {getStatusIcon(item.status)}
                            {item.status}
                        </div>
                    </Badge>
                    {item.stage && (
                        <Badge variant="outline" className="text-blue-600 border-blue-400">
                            {item.stage}
                        </Badge>
                    )}
                </div>
            </div>
            <hr className="border-gray-200 my-3" />
            {/* Bottom Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-center">
                <span className="text-gray-700 font-medium">
                    Items: {(item.items || item.orderItems)?.length || 0}
                </span>
                <span className="text-gray-600 font-medium">
                    Subtotal: Ksh {item.subTotal?.toLocaleString() || '0.00'}
                </span>
                <span className="text-gray-600 font-medium col-span-1">
                    {/* Empty space for alignment */}
                </span>
                <div className="flex justify-start md:justify-end">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewDetail(item)}
                        className="text-gray-500 hover:text-[#00007a] transition-colors"
                    >
                        <FaEye className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default JobOrderCard;