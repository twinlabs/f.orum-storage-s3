var AWS = require('aws-sdk');
var s3 = new AWS.S3();

module.exports = {
  send: function(data, configuration) {
    var promise = new Promise(function(resolve, reject){
      try {
        var file = require('fs').readFileSync(data.files["files[]"].path)
      } catch(error) {
        console.error(error);

        return reject(error);
      }

      var headParams = {
        Bucket: configuration.bucket,
        Key: data.files["files[]"].name,
      }
      var uploadParams = Object.assign({
        ContentType: data.files["files[]"].mimetype,
        Body: file,
      }, headParams)


      s3.headObject(headParams, function (err, metadata) {
        if (err && err.code === 'NotFound') {
          return reallySend(uploadParams, resolve)
        }

        if (err) {
          return console.error(err);
        }

        console.warn('!!! key collision detected:', params);
      });

    });

    return promise;
  },
  configuration: {
    bucket: process.env.AWS_BUCKET
  }
}

function reallySend(params, resolve) {
  s3.putObject(params, function(err, data) {
    if (err) {
      console.log(err);
      return reject(err)
    }

    return resolve({
      ETag: data.ETag,
      url: `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`,
    });
  });
}

