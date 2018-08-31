//引用模块
var express = require("express");
var session = require('express-session')
var mongoose = require("mongoose");
//路由
var common_router = require("./router/common_router.js");
var admin_router = require("./router/admin_router.js");
var shangchuan = require("./router/shangchuan.js");
var liebiao = require("./router/liebiao.js");
var router = require("./router/router.js");
// var student_router = require("./router/student-admin_router.js");
//创建APP
var app = express();
//mongoose在链接数据库，此时这两条语句要写在app.js中而不是每个模块中
//因为mongoose底层是在帮我们监听是不是在连接数据。在需要使用mongoose实例的地方，请重新require它。而不要connect它！
mongoose.connect('mongodb://localhost:27017/diancanxitong');

//设置默认模板引擎
app.set("view engine","ejs");


//设置session
//使用一个中间件，就是session中间件。这个中间件必须排在第一个
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'xuanxiukebaomingxitong', //加密字符串，我们下发的随机乱码都是依靠这个字符串加密的
    resave: false,
    saveUninitialized: true
}));

app.use ("/public"                          ,express.static("public"));
app.use("/uploads"    ,express.static("uploads"));


//路由清单
app.get ("/"                                ,common_router.showIndex);          //首页
app.post("/checklogin"                      ,common_router.checklogin);         //Ajax接口，检查登录是否成功，能够返回{result:-2}
app.get ("/admin"                           ,admin_router.showAdmin);           //管理员管理面板

app.get ("/leibie"                      ,admin_router.leibie);           //商品分类
app.get ("/leibie1"                      ,admin_router.getallleibie);           //请求所有分类
app.post ("/leibie"                     ,admin_router.upleibie);           //商品分类
app.post ("/leibie3/:sid"                     ,admin_router.gengleibie);           //更改商品分类
app.delete ("/leibie2/:sid"                     ,admin_router.delleibie);           //删除商品分类


app.get("/zengjia"                     ,shangchuan.zengjia);           //增加商品
app.post("/uploads"                      ,shangchuan.upload);           //上传图片和商品信息

app.get("/liebiao"                 ,liebiao.showleibie);// 展示商品列表
app.get("/caixi"                ,liebiao.quanbudecai);//全部的菜
app.get("/chazhao/:name"           ,liebiao.zhao);//

app.post("/xinde"                 ,router.gaixin)
app.delete  ('/shan/:name'	      , router.shanle);
app.get("/caileiba"                 ,router.cailei);
app.get("/search"                ,router.search)

//静态资源服务
app.get ("/*"                               ,common_router.show404);            //404页面
//退出账号
app.get("/tuichu",admin_router.tuichu);

//监听
app.listen(3001);