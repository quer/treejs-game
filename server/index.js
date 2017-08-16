const path = require('path');
const express = require('express');
const app = express();
const port = 3000;

app.use("/js/", express.static(path.resolve(__dirname, '../client/js/')));//express.static(__dirname + '/../client/js'));
app.get('/', function (req, res) {
	res.sendfile(path.resolve(__dirname, '../client/index.html'));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})