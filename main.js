express = require('express');
bodyParser = require('body-parser');
app = express();

// var store = require('store')

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.listen(8080);

AWS = require('aws-sdk');
AWS.config.update({
  region: 'ap-southeast-1',
  accessKeyId: 'AKIAJV4YVFG3QP7BEP3Q',
  secretAccessKey: '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'
});
docClient = new AWS.DynamoDB.DocumentClient();
params = {
  TableName: 'instagram_posts',
  FilterExpression: 'is_comic = :is_comic',
  ExpressionAttributeValues: {':is_comic' : true}
}

class GuessPicture {
  constructor() {
    this.media_url = "";
    this.caption = "";
  }
}
app.get('/', (req, res) => {
  var info = [];
  docClient.scan(params, (err, data) => {
    if (err) {
      console.log(err);
    }
    else {
      data.Items.forEach(item => {
        let post = new GuessPicture();
        post.media_url = item.media_url;
        post.caption = item.caption;
        info.push(post);
      })
      res.json(info);
      // res.end();
    }
  })

})

// function checkAnswer() {
//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//      document.getElementById("demo").innerHTML = this.responseText;
//     }
//   };
//   xhttp.open("GET", "requirements.txt", true);
//   xhttp.send();
// }