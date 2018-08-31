var path = require("path");
var xlsx = require('node-xlsx');
var formidable = require("formidable");
var Admin = require("../model/admin.js")
// var Student = require("../model/Student.js")
// var Course = require("../model/Course.js")
var crypto = require("crypto");
var fs = require("fs");
// var nodeExcel = require('excel-export');
var url = require("url");
var leibie=require("../model/carClass.js");
var album = require("./shangchuan.js");



//管理员面板
exports.showAdmin = function(req,res){
    //使用这个页面需要登录！
    if(!(req.session.login && req.session.type == "admin")){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.sendFile(path.join(__dirname , "../views/admin.html"));
}

exports.tuichu = function (req, res) {
    req.session.login = "";
    res.json({"session":1});
}
//商品分类
exports.leibie = function(req,res){
    res.render("leibie");
}
//请求所有类别
exports.getallleibie = function(req,res){
    //读取page参数
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 10;
    //寻找条目总数
    leibie.count({},function(err,count){
        //第6页： limit(2)  skip(10)
        leibie.find({}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
}
//执行添加汽车类别
exports.upleibie = function(req,res){
    console.log("服务器收到了一个POST请求");
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //数据库持久
        leibie.addCategory(fields,function(result){
            res.json({"result" : result});
        });
    });
}
exports.gengleibie = function(req,res){
    var sid = req.params.sid;
    if(!sid){
        return;
    }
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //更改学生
        leibie.find({"sid" : sid},function(err,results){
            if(results.length == 0){
                res.json({"result" : -1});
                return;
            }
            var thestudent = results[0];
            //更改属性
            thestudent.sid = fields.sid;
            thestudent.name = fields.name;
            //持久化
            thestudent.save(function(err){
                if(err){
                    res.json({"result" : -1});
                }else{
                    res.json({"result" : 1});
                }
            });
        });
    });
}
exports.delleibie = function(req,res){
    //拿到学号
    var sid = req.params.sid;
    console.log(sid)
    //寻找这个学号的学生
    leibie.find({"sid" : sid},function(err,results){
        if(err || results.length == 0){
            res.json({"result" : -1});
            return;
        }
        //删除
        results[0].remove(function(err){
            if(err){
                res.json({"result" : -1});
                return;
            }
            res.json({"result" : 1});
        });
    });
}


