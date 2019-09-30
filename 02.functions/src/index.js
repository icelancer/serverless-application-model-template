const _ = require('lodash');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    region: 'ap-northeast-2'
});

const pickEventProperties = record => ({
    bucket: _.get(record, 's3.bucket.name'),
    key: _.get(record, 's3.object.key')
});

const copyObject = record => s3.copyObject({
    CopySource: `/${record.bucket}/${record.key}`,
    Bucket: record.bucket,
    Key: `cloned/${record.key.split('/').pop()}`
}).promise();

module.exports.handler = async (event) => {
    const { Records: records } = event;
    console.log(JSON.stringify(event, null, 2));

    const promises = _.chain(records)
        .map(pickEventProperties)
        .map(copyObject)
        .values();

    return Promise.all(promises);
};