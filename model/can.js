var mongoose = require('mongoose');
var studentSchema = new mongoose.Schema({
    lei:String,
    name:String,
    monge:String,
    pai:String,
    shenhe:String,
    jingpin:String,
    rexiao:String,
    tu:String,
    miao:String
});

studentSchema.statics.search = function(word,callback){
    console.log("我是Course类，我收到了模糊查询次" + word);
    this.find(
        {
            "$or" : [
                {"lei" : new RegExp(word)},
                {"name" : new RegExp(word)},
                {"miao" : new RegExp(word)}
            ]
        }
    ).sort({"cid":1}).exec(
        function(err,results){
            callback(results);
        }
    );
}

var can = mongoose.model("can",studentSchema);

module.exports = can