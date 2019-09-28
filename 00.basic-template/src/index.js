module.exports.handler = async () => ({
    statusCode: 200,
    body: JSON.stringify( {
        message: "hello serverless application model"
    })
});
