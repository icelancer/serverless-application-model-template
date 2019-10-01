const sharp = require('sharp');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({ region: 'ap-northeast-1' });

const getImageFromS3 = async (sourceBucket, key) =>
    s3.getObject({ Bucket: sourceBucket, Key: key})
    .promise()
    .then(({ Body, ContentType }) => ({ imageData: Body, contentType: ContentType }));

/**
 *  @param key: String - S3 객체 키
 *  @param imageObject: Object - S3 객체
 *  @param imageObject.imageData: Buffer - 이미지 객체 버퍼
 *  @param imageObject.contentType: String - 객체 타입
 *  @param resizeOptions - 리사이즈 옵션
 *  @param resizeOptions.width - 가로 사이즈
 *  @param resizeOptions.directory - 대상 디렉터리
 *  @param resizeOptions.targetBucket - 대상 버킷명
 */
const resizeToWidth = async (key, { imageData, contentType }, { width, directory, targetBucket } ) => {
    const fileName = key.split('/').pop();

    const imageBuffer =  await sharp(imageData)
        .resize({ width })
        .toBuffer();

    await s3.putObject({
        Body: imageBuffer,
        Bucket: targetBucket,
        ContentType: contentType,
        Key: `${directory}/${fileName}`,
    }).promise();
};

const resizeImages = async (key, imageObject, resizeOptions) =>
    Promise.all(
        resizeOptions.map(resizeOption => resizeToWidth(key, imageObject, resizeOption))
    );

/**
 * S3 객체 키로 이미지를 리사이즈 한다.
 * @param sourceBucket - 이미지가 저장된 S3 버킷명
 * @param key: String - S3 객체 키
 * @param resizeOptions: Object[] - 리사이즈 옵션
 * @param resizeOptions.width - 가로 사이즈
 * @param resizeOptions.directory - 대상 디렉터리
 * @param resizeOptions.targetBucket - 대상 버킷명
 */
module.exports.resizeWithS3Key = async ({ sourceBucket, key, resizeOptions }) => {
    const imageObject = await getImageFromS3(sourceBucket, key);
    await resizeImages(key, imageObject, resizeOptions);
};