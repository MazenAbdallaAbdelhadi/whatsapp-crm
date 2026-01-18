"use server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import * as z from "zod";
import { nanoid } from "nanoid";

import { S3 } from "@/lib/s3-client";

const uploadSchema = z.object({
    fileName: z.string(),
    contentType: z.string(),
    size: z.number(),
});

export async function generatePresignedUrl(fileData: unknown) {
    try {
        const result = uploadSchema.safeParse(fileData);

        if (!result.success) {
            return {
                error: result.error.message,
                success: false,
            }
        }

        const { fileName, contentType, size } = result.data;
        const uniqueKey = `${nanoid()}-${fileName}`;

        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: uniqueKey,
            ContentType: contentType,
            ContentLength: size,
        });


        const presignedURL = await getSignedUrl(S3, command, {
            expiresIn: 60 * 10, // 10 min
        });

        const response = {
            presignedURL,
            key: uniqueKey,
            success: true,
        };

        return response;
    } catch (error) {
        return {
            error: "Failed to generate signed URL",
            success: false,
        }
    }
}