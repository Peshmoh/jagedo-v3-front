/* eslint-disable @typescript-eslint/no-explicit-any */
// s3Utils.js
import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand
} from "@aws-sdk/client-s3";

// Create S3 client
const s3 = new S3Client({
    region: import.meta.env.VITE_AWS_REGION,
    credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
    }
});

export async function uploadFile(file) {
    console.log("Uploading file:", file);
    
    if (!file) throw new Error("No file provided for upload");
    
    // Generate unique file name with original extension
    const fileExtension = file.name.split('.').pop();
    const key = `uploads/${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 15)}.${fileExtension}`;

    const command = new PutObjectCommand({
        Bucket: import.meta.env.VITE_AWS_S3_BUCKET_NAME,
        Key: key,
        Body: file, // File object should work, but let's handle it properly
        ContentType: file.type,
        // Add ACL if your bucket policy requires it
        // ACL: 'public-read'
    });

    try {
        await s3.send(command);
        return `https://${import.meta.env.VITE_AWS_S3_BUCKET_NAME}.s3.${
            import.meta.env.VITE_AWS_REGION
        }.amazonaws.com/${key}`;
    } catch (error) {
        console.error("S3 Upload Error:", error);
        throw new Error(`Failed to upload file: ${error.message}`);
    }
}

// Alternative approach if the above still doesn't work:
export async function uploadFileAlternative(file: any, name: any) {
    console.log("Uploading file:", file);

    if (!file) throw new Error("No file provided for upload");

    // Just prepend a unique prefix to avoid collisions
    const uniquePrefix = `${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}`;

    const key = `uploads/${uniquePrefix}_${name}`;

    // Convert file to array buffer first, then to Uint8Array
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const command = new PutObjectCommand({
        Bucket: import.meta.env.VITE_AWS_S3_BUCKET_NAME,
        Key: key,
        Body: uint8Array,
        ContentType: file.type,
        ContentLength: file.size,
    });

    try {
        await s3.send(command);

        const url = `https://${import.meta.env.VITE_AWS_S3_BUCKET_NAME}.s3.${
            import.meta.env.VITE_AWS_REGION
        }.amazonaws.com/${key}`;

        return { url, key };
    } catch (error) {
        console.error("S3 Upload Error:", error);
        throw new Error(`Failed to upload file: ${error.message}`);
    }
}

export function extractOriginalName(key) {
    return key.split("_").slice(2).join("_"); 
    // "report final v2.pdf"
}

/**
 * Update file in S3 (basically same as upload, overwrites if exists)
 */
export async function updateFile(file) {
    return uploadFile(file);
}

/**
 * Delete file from S3
 * @param {string} key - File path in bucket
 */
export async function deleteFile(key) {
    const command = new DeleteObjectCommand({
        Bucket: import.meta.env.VITE_AWS_S3_BUCKET_NAME,
        Key: key
    });

    try {
        await s3.send(command);
        return `Deleted ${key} from ${import.meta.env.VITE_AWS_S3_BUCKET_NAME}`;
    } catch (error) {
        console.error("S3 Delete Error:", error);
        throw new Error(`Failed to delete file: ${error.message}`);
    }
}

export async function uploadFileSimple(file) {
    if (!file) throw new Error("No file provided for upload");
    
    const fileExtension = file.name.split('.').pop();
    const key = `uploads/${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 15)}.${fileExtension}`;

    // Use fetch to upload the file directly
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`https://${import.meta.env.VITE_AWS_S3_BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${key}`, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type,
            },
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }

        return `https://${import.meta.env.VITE_AWS_S3_BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
        console.error("S3 Upload Error:", error);
        throw new Error(`Failed to upload file: ${error.message}`);
    }
}

