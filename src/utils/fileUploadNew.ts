/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Upload a file using the new API endpoint /api/files/upload-with-dto
 * @param axiosInstance - The axios instance to use for the request
 * @param file - The file to upload
 * @param fileName - The name for the file
 * @returns Promise with the uploaded file URL
 */
export const uploadFileNew = async (axiosInstance: any, file: File, fileName: string): Promise<string> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', fileName);

        const response = await axiosInstance.post('/api/files/upload-with-dto', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Extract the URL from the response data
        return response.data.data; // Returns the image URL from the data property
    } catch (error: any) {
        console.error('Error uploading file:', error);
        throw new Error(error.response?.data?.message || 'Failed to upload file');
    }
};
