import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { createAttribute, AttributeCreateRequest } from '@/api/attributes.api';
import useAxiosWithAuth from '@/utils/axiosInterceptor';

interface AddAttributeFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function AddAttributeForm({ onBack, onSuccess }: AddAttributeFormProps) {
  const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AttributeCreateRequest>({
    type: '',
    values: '',
    attributeGroup: '',
    filterable: false,
    active: true,
    customerView: false
  });
  const [attributeType, setAttributeType] = useState('text');
  const [attributeValues, setAttributeValues] = useState<string[]>([]);
  const [newValue, setNewValue] = useState('');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type.trim()) {
      toast.error('Attribute name is required');
      return;
    }

    if (attributeType === 'select' || attributeType === 'multiselect') {
      if (attributeValues.length === 0) {
        toast.error('At least one attribute value is required for select/multiselect types');
        return;
      }
    }

    try {
      setLoading(true);
      
      const submitData: AttributeCreateRequest = {
        ...formData,
        values: attributeValues.join(',')
      };

      const response = await createAttribute(axiosInstance, submitData);
      
      if (response.success) {
        toast.success('Attribute created successfully');
        onSuccess();
      } else {
        toast.error(response.message || 'Failed to create attribute');
      }
    } catch (error) {
      console.error('Error creating attribute:', error);
      toast.error('Failed to create attribute');
    } finally {
      setLoading(false);
    }
  };

  // Handle adding new attribute value
  const handleAddValue = () => {
    if (newValue.trim() && !attributeValues.includes(newValue.trim())) {
      setAttributeValues([...attributeValues, newValue.trim()]);
      setNewValue('');
    }
  };

  // Handle removing attribute value
  const handleRemoveValue = (index: number) => {
    setAttributeValues(attributeValues.filter((_, i) => i !== index));
  };

  // Handle discard
  const handleDiscard = () => {
    onBack();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDiscard}
          className="p-0 h-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create a new attribute</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Section */}
          <Card>
            <CardHeader>
              <CardTitle>General</CardTitle>
              <CardDescription>
                Basic attribute information and configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter attribute name"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label>Type</Label>
                <RadioGroup
                  value={attributeType}
                  onValueChange={setAttributeType}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="text" id="text" />
                    <Label htmlFor="text">Text</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="select" id="select" />
                    <Label htmlFor="select">Select</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="multiselect" id="multiselect" />
                    <Label htmlFor="multiselect">Multiselect</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="textarea" id="textarea" />
                    <Label htmlFor="textarea">Textarea</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Values (for select/multiselect) */}
              {(attributeType === 'select' || attributeType === 'multiselect') && (
                <div className="space-y-2">
                  <Label>Values</Label>
                  <div className="flex space-x-2">
                    <Select>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="option1">Option 1</SelectItem>
                        <SelectItem value="option2">Option 2</SelectItem>
                        <SelectItem value="option3">Option 3</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      onClick={handleAddValue}
                      disabled={!newValue.trim()}
                      style={{ backgroundColor: "#00007A", color: "white" }}
                    >
                      Add
                    </Button>
                  </div>
                  
                  {/* Add new value input */}
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter new value"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddValue())}
                    />
                  </div>

                  {/* Display added values */}
                  {attributeValues.length > 0 && (
                    <div className="space-y-2">
                      <Label>Added Values:</Label>
                      <div className="flex flex-wrap gap-2">
                        {attributeValues.map((value, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-md"
                          >
                            <span className="text-sm">{value}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveValue(index)}
                              className="h-4 w-4 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Attribute Group */}
              <div className="space-y-2">
                <Label htmlFor="attributeGroup">Attribute Group</Label>
                <Select
                  value={formData.attributeGroup}
                  onValueChange={(value) => setFormData({ ...formData, attributeGroup: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className='bg-white'>
                    <SelectItem value="physical">Physical Properties</SelectItem>
                    <SelectItem value="appearance">Appearance</SelectItem>
                    <SelectItem value="technical">Technical Specs</SelectItem>
                    <SelectItem value="dimensions">Dimensions</SelectItem>
                    <SelectItem value="materials">Materials</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Setting Section */}
          <Card>
            <CardHeader>
              <CardTitle>Setting</CardTitle>
              <CardDescription>
                Configure attribute behavior and visibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Is Filterable */}
              <div className="space-y-2">
                <Label>Is Filterable?</Label>
                <RadioGroup
                  value={formData.filterable ? 'yes' : 'no'}
                  onValueChange={(value) => setFormData({ ...formData, filterable: value === 'yes' })}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="filterable-no" />
                    <Label htmlFor="filterable-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="filterable-yes" />
                    <Label htmlFor="filterable-yes">Yes</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Show to customers */}
              <div className="space-y-2">
                <Label>Show to customers?</Label>
                <RadioGroup
                  value={formData.customerView ? 'yes' : 'no'}
                  onValueChange={(value) => setFormData({ ...formData, customerView: value === 'yes' })}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="customer-no" />
                    <Label htmlFor="customer-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="customer-yes" />
                    <Label htmlFor="customer-yes">Yes</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handleDiscard}
            className="border-red-500 text-red-500 hover:bg-red-50"
          >
            Discard
          </Button>
          <Button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: "#00007A", color: "white" }}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
} 