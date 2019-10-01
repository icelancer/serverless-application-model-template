const sharpLayer = require('/opt/sharp-layer');

const SOURCE_BUCKET = 'icelancer-image-bucket';

module.exports.handler = async ({ key }) => {
    console.log(key);
    return sharpLayer.resizeWithS3Key({
        sourceBucket: SOURCE_BUCKET,
        key,
        resizeOptions: [
            { width: 1024, directory: '1024', targetBucket: SOURCE_BUCKET },
            { width: 512, directory: '512', targetBucket: SOURCE_BUCKET },
        ]
    })
};