module.exports.handler = async () => ({
    statusCode: 200,
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify( {
        message: "hello serverless application model"
    })
});
