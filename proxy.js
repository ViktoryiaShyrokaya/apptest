var proxy = require("express-http-proxy");
var app = require("express")();
var cors = require("cors");

app.use(cors());

app.use("/proxy", proxy("http://services.odata.org/", {
    forwardPath: function(req, res) {
        console.log(require('url').parse(req.url).path);
        return require('url').parse(req.url).path;
    }
}));

app.listen(5000, function(){
    console.log("Proxy listening on port 5000!");
});