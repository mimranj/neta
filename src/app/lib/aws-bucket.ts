import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_REGION, // Specify your AWS region
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Your AWS Access Key
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Your AWS Secret Key
    },
} as any);

export const uploadFileToS3 = async (profile_img: any) => {
    const { b64Img, name, type } = profile_img;
    const base64Data = await b64Img.replace(/^data:image\/\w+;base64,/, "");
    const binaryData = Buffer.from(base64Data, "base64");

    const params = {
        Bucket: "mobile-app-images-netaai", // Your S3 bucket name
        Key: name, // File name
        Body: binaryData, // Binary data to upload
        ContentType: type,
        // ACL: 'public-read', // MIME type (e.g., "image/jpeg")
    };
    try {
        const command = new PutObjectCommand(params);
        const response = await s3Client.send(command);
        console.log("Image uploaded successfully:", response);
        const s3PublicUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${name}`;
        return s3PublicUrl;

    } catch (error) {
        console.error("Error uploading image to S3:", error);
        throw error;
    }
}
