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
    getAllAttributes,
    deleteAttribute,
    toggleAttributeStatus,
    Attribute
} from "@/api/attributes.api";
import useAxiosWithAuth from "@/utils/axiosInterceptor";
import AddAttributeForm from "./AddAttributeForm";

export default function ShopAttributes() {
    const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);
    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Hardware");
    const [attributeToDelete, setAttributeToDelete] =
        useState<Attribute | null>(null);
    const [attributeToToggle, setAttributeToToggle] =
        useState<Attribute | null>(null);
    const [showAddAttribute, setShowAddAttribute] = useState(false);

    // Category tabs
    const categories = ["Hardware", "Design", "Custom Products", "Machinery"];

    // Fetch attributes
    const fetchAttributes = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAllAttributes(axiosInstance);
            if (response.success) {
                //@ts-ignore
                setAttributes(response.hashSet);
            }
        } catch (error) {
            console.error("Error fetching attributes:", error);
            toast.error("Failed to fetch attributes");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAttributes();
    }, []);

    // Filter attributes based on search term
    const filteredAttributes = attributes?.filter(
        (attribute) =>
            attribute.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            attribute.values.toLowerCase().includes(searchTerm.toLowerCase()) ||
            attribute.attributeGroup
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    // Handle edit attribute
    const handleEditAttribute = () => {
        // For now, just show a toast - edit functionality can be added later
        toast("Edit functionality coming soon");
    };

    // Handle delete attribute
    const handleDeleteAttribute = (attribute: Attribute) => {
        setAttributeToDelete(attribute);
    };

    const deleteAttributeHandler = async () => {
        if (!attributeToDelete) return;

        try {
            const response = await deleteAttribute(
                axiosInstance,
                attributeToDelete.id
            );
            if (response.success) {
                toast.success("Attribute deleted successfully");
                fetchAttributes();
            } else {
                toast.error(response.message || "Failed to delete attribute");
            }
        } catch (error) {
            console.error("Error deleting attribute:", error);
            toast.error("Failed to delete attribute");
        } finally {
            setAttributeToDelete(null);
        }
    };

    // Handle toggle attribute status
    const handleToggleAttributeStatus = (attribute: Attribute) => {
        setAttributeToToggle(attribute);
    };

    const toggleAttributeStatusHandler = async () => {
        if (!attributeToToggle) return;

        try {
            const response = await toggleAttributeStatus(
                axiosInstance,
                attributeToToggle.id,
                attributeToToggle.active
            );
            if (response.success) {
                toast.success(
                    `Attribute ${
                        attributeToToggle.active ? "disabled" : "enabled"
                    } successfully`
                );
                fetchAttributes();
            } else {
                toast.error(
                    response.message || "Failed to toggle attribute status"
                );
            }
        } catch (error) {
            console.error("Error toggling attribute status:", error);
            toast.error("Failed to toggle attribute status");
        } finally {
            setAttributeToToggle(null);
        }
    };

    // Handle add attribute
    const handleAddAttribute = () => {
        setShowAddAttribute(true);
    };

    // If showing add attribute form, render it
    if (showAddAttribute) {
        return (
            <AddAttributeForm
                onBack={() => {
                    setShowAddAttribute(false);
                }}
                onSuccess={() => {
                    setShowAddAttribute(false);
                    fetchAttributes();
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
                        Attributes
                    </h1>
                    <p className="text-muted-foreground">
                        Manage product attributes and specifications.
                    </p>
                </div>
                <Button
                    onClick={handleAddAttribute}
                    style={{ backgroundColor: "#00007A", color: "white" }}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Attribute
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
                        placeholder="Search attributes..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Attributes Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Product Attributes</CardTitle>
                    <CardDescription>
                        Manage product specifications and features for{" "}
                        {selectedCategory}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>Attribute Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Attribute Values</TableHead>
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
                                        Loading attributes...
                                    </TableCell>
                                </TableRow>
                            ) : filteredAttributes?.length == 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="text-center py-8 text-muted-foreground"
                                    >
                                        No attributes found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredAttributes?.map((attribute, index) => (
                                    <TableRow key={attribute.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell className="font-medium">
                                            {attribute.type}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {attribute.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {attribute.values}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    attribute.active
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {attribute.active
                                                    ? "Yes"
                                                    : "No"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    attribute.filterable
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {attribute.filterable
                                                    ? "Yes"
                                                    : "No"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    attribute.customerView
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {attribute.customerView
                                                    ? "Yes"
                                                    : "No"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <span className="sr-only">
                                                            Open menu
                                                        </span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleEditAttribute()
                                                        }
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleToggleAttributeStatus(
                                                                attribute
                                                            )
                                                        }
                                                    >
                                                        {attribute.active ? (
                                                            <XCircle className="mr-2 h-4 w-4" />
                                                        ) : (
                                                            <CheckCircle className="mr-2 h-4 w-4" />
                                                        )}
                                                        {attribute.active
                                                            ? "Disable"
                                                            : "Enable"}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleDeleteAttribute(
                                                                attribute
                                                            )
                                                        }
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
            {attributeToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">
                            Delete Attribute
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "
                            {attributeToDelete.type}"? This action cannot be
                            undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="outline"
                                onClick={() => setAttributeToDelete(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={deleteAttributeHandler}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Status Confirmation Dialog */}
            {attributeToToggle && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">
                            {attributeToToggle.active ? "Disable" : "Enable"}{" "}
                            Attribute
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to{" "}
                            {attributeToToggle.active ? "disable" : "enable"} "
                            {attributeToToggle.type}"?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="outline"
                                onClick={() => setAttributeToToggle(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant={
                                    attributeToToggle.active
                                        ? "destructive"
                                        : "default"
                                }
                                onClick={toggleAttributeStatusHandler}
                            >
                                {attributeToToggle.active
                                    ? "Disable"
                                    : "Enable"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
