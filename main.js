express = require('express');
AWS = require('aws-sdk');
app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.listen(8080);

AWS.config.update({
  region: 'ap-southeast-1',
  accessKeyId: 'AKIAJV4YVFG3QP7BEP3Q',
  secretAccessKey: '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'
});

docClient = new AWS.DynamoDB.DocumentClient();
params = {
  TableName: 'instagram_posts_v2',
  FilterExpression: 'is_comic = :is_comic',
  ExpressionAttributeValues: {':is_comic' : true}
}
var info = [];

scanAWS();

setInterval(() => {
  scanAWS();
}, 86400000) // every 86400000 milliseconds = 24 hours

app.get('/', (req, res) => {
  console.log("Requested");
  res.json(info);
})

class GuessPicture {
  constructor() {
    this.id;
    this.media_url = "";
    this.caption = "";
  }
}

function scanAWS() {
  docClient.scan(params, (err, data) => {
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
      console.log("Scanned at : ");
      var datetime = new Date();
      console.log(datetime);
      console.log("\n");
    }
  });
}
