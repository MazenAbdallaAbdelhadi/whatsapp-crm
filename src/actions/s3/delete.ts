"use server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

import { S3 } from "@/lib/s3-client";

export async function deleteFromS3(key: string) {
    if (!key || typeof key !== "string") {
        return {
            success: false,
            error: "Key is required",
        }
    }

    try {
        const command = new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: key,
        });

        await S3.send(command);

        return {
            success: true,
            message: "File deleted successfully",
        }
    } catch (error) {
        return {
            success: false,
            error: "Failed to delete file",
        }
    }
}