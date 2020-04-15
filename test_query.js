
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

express = require('express');
AWS = require('aws-sdk');
app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

AWS.config.update({
  region: 'us-east-2',
  accessKeyId: 'AKIAJV4YVFG3QP7BEP3Q',
  secretAccessKey: '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'
});

docClient = new AWS.DynamoDB.DocumentClient();
params = {
    TableName: 'instagram_posts_v3',
    KeyConditionExpression: 'is_comic = :correct',
    ExpressionAttributeValues: {':correct' : 1}
}
var info = [];

docClient.query(params, (err, data) => {
    if (err) {
        console.log(err);
    }
    else {
        data.Items.forEach(item => {
            let post = new GuessPicture();
            post.id = item.id;
            post.media_url = item.media_url;
            post.caption = item.caption;
            info.push(post);
        })

        info.sort(function(a, b) {
            return a.id - b.id;
        });
        console.log(info)
        console.log("Served : " + info.length + " items")

    }
});

class GuessPicture {
  constructor() {
    this.id;
    this.media_url = "";
    this.caption = "";
  }
}
