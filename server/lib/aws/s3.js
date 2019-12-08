import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  endpoint: "nyc3.digitaloceanspaces.com",
  accessKeyId: Meteor.settings.AWS_ACCESS_KEY,
  secretAccessKey: Meteor.settings.AWS_SECRET_ACCESS_KEY
});

export const uploadImage = (file, filename) => {
  const params = {
    Bucket: 'secret-santa', // pass your bucket name
    Key: filename, // file will be saved as testBucket/contacts.csv
    Body: file,
    ContentType: 'image/png',
    ACL:'public-read'
  };
  return s3.upload(params).promise();
};

export const cdnUrl = (key) => {
  return `https://secret-santa.nyc3.cdn.digitaloceanspaces.com/${key}`;
};