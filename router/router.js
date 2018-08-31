var formidable = require("formidable");
// var db = require("../model/db")
var df = require("date-format");
var fs = require("fs");
var path = require("path")
var url = require("url")
var can = require("../model/can")
exports.jiacai = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req,function (err, fields) {
        db.addStudent(fields,function(result){
            res.json({"result" : result});
        });
    })
}


exports.gaixin = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields,file) {
        console.log(fields);
        var newnames = df('yyyyMMddhhmmssSSS', new Date());
        fs.rename(file.tu.path , "./uploads/" + newnames + ".jpg",function(err) {
            can.find({"name" :fields.name},function(err,results){
                var thestudent = results[0];
                console.log(thestudent)
                thestudent.lei = fields.lei;
                thestudent.name = fields.name;
                thestudent.monge = fields.monge;
                thestudent.pai = fields.pai;
                thestudent.shenhe = fields.shenhe;
                thestudent.jingpin = fields.jingpin;
                thestudent.rexiao = fields.rexiao;
                thestudent.tu = newnames;
                thestudent.miao = fields.miao;
                thestudent.save(function(err){
                    if(err){
                        console.log(err);
                        res.json({"result" : -1});
                    }else{
                        res.redirect("/whole");
                    }
                });
            });
        });
    })
}

exports.shanle = function(req,res){
    var name = req.params.name;
    can.find({"name" : name},function(err,results){
        if(err || results.length == 0){
            res.json({"result" : -1});
            return;
        }
        results[0].remove(function(err){
            if(err){
                res.json({"result" : -1});
                return;
            }
            res.json({"result" : 1});
        });
    });
}

exports.cailei = function (req, res) {
    var lei = url.parse(req.url,true).query.lei;
    console.log(lei)
    can.find({"lei":lei}).exec(function(err,results){
        res.json({
            "results" : results
        });
    });
}

exports.search = function (req, res) {
    var sou = url.parse(req.url,true).query.sou;
    console.log(sou)
    can.search(sou,function(results){
        res.json({"results" : results});
    });
}