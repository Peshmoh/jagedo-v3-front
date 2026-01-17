/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    MoreHorizontal,
    CheckCircle,
    XCircle
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import {
    getAllRegions,
    deleteRegion,
    toggleRegionStatus,
    Region
} from "@/api/regions.api";
import useAxiosWithAuth from "@/utils/axiosInterceptor";
import AddRegionForm from "./AddRegionForm";

export default function ShopRegions() {
    const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);
    const [regions, setRegions] = useState<Region[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Hardware");
    const [regionToDelete, setRegionToDelete] =
        useState<Region | null>(null);
    const [regionToToggle, setRegionToToggle] =
        useState<Region | null>(null);
    const [showAddRegion, setShowAddRegion] = useState(false);

    // Category tabs
    const categories = ["Hardware", "Design", "Custom Products", "Machinery"];

    // Fetch regions
    const fetchRegions = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAllRegions(axiosInstance);
            if (response.success) {
                //@ts-ignore
                setRegions(response.hashSet);
            }
        } catch (error) {
            console.error("Error fetching regions:", error);
            toast.error("Failed to fetch regions");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRegions();
    }, []);

    // Filter regions based on search term
    const filteredRegions = regions?.filter(
        (region) =>
            region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            region.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle edit region
    const handleEditRegion = () => {
        // For now, just show a toast - edit functionality can be added later
        toast("Edit functionality coming soon");
    };

    // Handle delete region
    const handleDeleteRegion = (region: Region) => {
        setRegionToDelete(region);
    };

    const deleteRegionHandler = async () => {
        if (!regionToDelete) return;

        try {
            const response = await deleteRegion(
                axiosInstance,
                regionToDelete.id
            );
            if (response.success) {
                toast.success("Region deleted successfully");
                fetchRegions();
            } else {
                toast.error(response.message || "Failed to delete region");
            }
        } catch (error) {
            console.error("Error deleting region:", error);
            toast.error("Failed to delete region");
        } finally {
            setRegionToDelete(null);
        }
    };

    // Handle toggle region status
    const handleToggleRegionStatus = (region: Region) => {
        setRegionToToggle(region);
    };

    const toggleRegionStatusHandler = async () => {
        if (!regionToToggle) return;

        try {
            const response = await toggleRegionStatus(
                axiosInstance,
                regionToToggle.id,
                regionToToggle.active
            );
            if (response.success) {
                toast.success(
                    `Region ${
                        regionToToggle.active ? "disabled" : "enabled"
                    } successfully`
                );
                fetchRegions();
            } else {
                toast.error(
                    response.message || "Failed to toggle region status"
                );
            }
        } catch (error) {
            console.error("Error toggling region status:", error);
            toast.error("Failed to toggle region status");
        } finally {
            setRegionToToggle(null);
        }
    };

    // Handle add region
    const handleAddRegion = () => {
        setShowAddRegion(true);
    };

    // If showing add region form, render it
    if (showAddRegion) {
        return (
            <AddRegionForm
                onBack={() => {
                    setShowAddRegion(false);
                }}
                onSuccess={() => {
                    setShowAddRegion(false);
                    fetchRegions();
                }}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Regions
                    </h1>
                    <p className="text-muted-foreground">
                        Manage regional availability and shipping zones.
                    </p>
                </div>
                <Button
                    onClick={handleAddRegion}
                    style={{ backgroundColor: "#00007A", color: "white" }}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Region
                </Button>
            </div>

            {/* Category Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            selectedCategory === category
                                ? "bg-blue-800 text-white"
                                : "text-blue-600 hover:bg-blue-50"
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Search and Actions */}
            <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search regions..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Regions Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Product Regions</CardTitle>
                    <CardDescription>
                        Manage regional availability and shipping zones for{" "}
                        {selectedCategory}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>Country</TableHead>
                                <TableHead>Region</TableHead>
                                <TableHead>Counties</TableHead>
                                <TableHead>Is Required</TableHead>
                                <TableHead>Is Filterable</TableHead>
                                <TableHead>Show To Customers</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="text-center py-8"
                                    >
                                        Loading regions...
                                    </TableCell>
                                </TableRow>
                            ) : filteredRegions?.length == 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="text-center py-8 text-muted-foreground"
                                    >
                                        No regions found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredRegions?.map((region, index) => (
                                    <TableRow key={region.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{region.country}</TableCell>
                                        <TableCell>{region.name}</TableCell>
                                        <TableCell>-</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    region.active
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {region.active ? "Yes" : "No"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    region.filterable
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {region.filterable ? "Yes" : "No"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    region.customerView
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {region.customerView ? "Yes" : "No"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEditRegion()}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleToggleRegionStatus(region)}>
                                                        {region.active ? (
                                                            <XCircle className="mr-2 h-4 w-4" />
                                                        ) : (
                                                            <CheckCircle className="mr-2 h-4 w-4" />
                                                        )}
                                                        {region.active ? "Disable" : "Enable"}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteRegion(region)}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            {regionToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Delete Region</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "{regionToDelete.name}"? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="outline"
                                onClick={() => setRegionToDelete(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={deleteRegionHandler}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Status Confirmation Dialog */}
            {regionToToggle && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">
                            {regionToToggle.active ? "Disable" : "Enable"} Region
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to {regionToToggle.active ? "disable" : "enable"} "{regionToToggle.name}"?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="outline"
                                onClick={() => setRegionToToggle(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant={
                                    regionToToggle.active ? "destructive" : "default"
                                }
                                onClick={toggleRegionStatusHandler}
                            >
                                {regionToToggle.active ? "Disable" : "Enable"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 