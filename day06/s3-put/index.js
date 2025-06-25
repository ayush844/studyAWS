
require('dotenv').config();

const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");

const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,        
        secretAccessKey: process.env.SECRET__ACCESS_KEY    
    }
});


async function getObjectUrl(key){

    const command = new GetObjectCommand({
        Bucket: 'ayush-prvt-bkt', 
        Key: key                  
    });


    const url = await getSignedUrl(s3Client, command);

    return url;
}


async function putObject(filename, contentType){
    const command = new PutObjectCommand({
        Bucket: 'ayush-prvt-bkt', 
        Key: `uploads/user-uploads/${filename}`,
        ContentType: contentType
    })

    const url = await getSignedUrl(s3Client, command, {expiresIn: 3600}); // URL valid for 1 hour

    return url;
}


async function init(){
    console.log("URL for uploading the image is: ", await putObject(`myimage-${Date.now()}.png`, 'image/png'));
    // using this url we will be able to go to postman and upload the file
    // to the bucket ayush-prvt-bkt in the uploads/user-uploads/ folder
    // the file will be uploaded with the name myimage-<timestamp>.png

    // After uploading, you can use the getObjectUrl function to get the URL for accessing the uploaded file using its key
    // console.log("URL for myimage.png is: ", await getObjectUrl('uploads/user-uploads/myimage-1750819242059.png'));
}

init();
