var can = require("../model/can")

exports.showleibie = function (req, res) {
    res.render("liebiao")
}
exports.quanbudecai = function (req, res) {
    can.find({}).exec(function(err,results){
        res.json({
            "results" : results
        });
    });
}
exports.zhao  =function (req, res) {
    var name = req.params.name;
    console.log(name)
    //直接用类名打点调用find，不需要再Student类里面增加一个findStudentBySid的方法。
    can.find({"name" : name},function(err,results){
        if(results.length == 0){
            res.send("查无此人，请检查网址");
            return;
        }
        res.json({info: results[0]});
    });
}