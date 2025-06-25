// Load environment variables from a .env file into process.env
require('dotenv').config();

// Import required AWS SDK modules for interacting with S3
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

// Import function to generate a pre-signed URL (so users can access a private S3 object temporarily)
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// This is the S3 client configuration.
// It initializes the S3 client with your region and credentials
// These credentials will be used to authenticate AWS API calls
const s3Client = new S3Client({
    region: 'ap-south-1',  // AWS region where your S3 bucket is hosted
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,            // Your AWS Access Key (from .env file)
        secretAccessKey: process.env.SECRET__ACCESS_KEY    // Your AWS Secret Key (from .env file)
    }
});


// This async function takes a file key (filename or path in bucket) and generates a pre-signed URL
// Pre-signed URLs allow temporary, secure access to private S3 objects without making them public
async function getObjectUrl(key){
    // Create a GetObjectCommand which tells AWS SDK which object we want from which bucket
    const command = new GetObjectCommand({
        Bucket: 'ayush-prvt-bkt', // Name of the S3 bucket
        Key: key                  // The object's key (filename/path in the bucket)
    });

    // Generate a pre-signed URL using the command and your S3 client
    // This URL will be valid for a default time (15 minutes unless specified)
    const url = await getSignedUrl(s3Client, command);

    // Return the generated pre-signed URL
    return url;
}


// This function initializes the process and logs the URL to the console
async function init(){
    // The URL generated below will give temporary access to the file `myimage.png` from your private bucket
    // Anyone with this URL can access/download the file until it expires
    console.log("URL for myimage.png is: ", await getObjectUrl('myimage.png'));
}

// Call the init function to start the process
init();
