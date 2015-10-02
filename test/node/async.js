var fs = require('fs');
var Q = require("q");

var Docraptor = require("../../clients/node/docraptor.js");
var docraptor = new Docraptor.Test();
docraptor.setToken("YOUR_API_KEY_HERE", "user_credentials", true);

require('request').debug = true;

var request = docraptor.postAsync_docs({
  "doc": {
    "name": "swagger-node.pdf",
    "document_type": "pdf",
    "document_content": "<html><body>Swagger Node</body></html>",
    "test": true
  }
});

request.done(function(result) {
  var status_id = result.response.body.status_id;
  checkStatus(status_id);
});

function checkStatus(id) {
  var request = docraptor.getStatusById({ id: id });
  request.done(function(result) {
    var json = JSON.parse(result.response.body);
    if (json.status == "completed") {
      var request = docraptor.getDownloadById({id: json.download_id});
      request.done(function(result) {
        console.log(result.response.body);

        fs.writeFile('/tmp/node.pdf', result.response.body, 'binary', function(err){
          if (err) throw err
          console.log("The file /tmp/node.pdf was saved!");
          console.log("SHITS DONE!")
        });
      });

    } else {
      setTimeout(function() { checkStatus(id) }, 1000)
    }
  });
}
