var formidable = require("formidable");
var df = require("date-format");
var fs = require("fs");
var can = require("../model/can.js")
var path = require("path")


//增加商品
exports.zengjia = function (req, res) {
    res.render("zengjia");
}
exports.upload = function(req,res,next){
    var form = new formidable.IncomingForm();
    form.uploadDir = "./uploads";
    form.parse(req,function (err, filders,file) {
        console.log(filders)
        var newname = df('yyyyMMddhhmmssSSS', new Date());
        fs.rename(file.tu.path , "./uploads/" + newname + ".jpg",function(err){
            if (err){
                res.send("上传文件发生了错误")
                return
            }
            can.create({
                lei:filders.lei,
                name:filders.name,
                monge:filders.monge,
                pai:filders.pai,
                shenhe:filders.shenhe,
                jingpin:filders.jingpin,
                rexiao:filders.rexiao,
                tu:newname,
                miao:filders.miao
            },function (err,result) {
                res.redirect("/liebiao");
            })
        })
    })
}