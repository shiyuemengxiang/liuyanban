//简易留言板
var express=require("express");
var db=require("./models/db.js");
var sd=require("silly-datetime");
var obj=require("mongodb").ObjectId;
var formidable=require("formidable");
var app=express();
//设置模板引擎
app.set("view engine","ejs");
app.get("/",function(req,res){
    db.getCount("liuyanban",function(count){
        res.render("index",{
            count:Math.ceil(count/4)
        });

    })


   console.log(sd.format(new Date()))
})
//提供前台Ajax使用数据接口
app.get("/api",function(req,res){
    var count=parseInt(req.query.count)||4;
    var page=parseInt(req.query.page) ||0;
    console.log(page);
    db.find("liuyanban",{},{"pagescount":count,"skipnum":page,"sort":{"date":-1}},function(err,doc){
        res.send(doc)
    })
})
//查询数据数量
app.get("/count",function(req,res){
    db.getCount("liuyanban",function(count){
        // res.send(count);
        console.log("数据数:"+count);
        res.json(count);
    })

})
//删除留言
app.get("/del",function(req,res){
    var id=req.query.id;
    console.log(id);
   db.deleteMany("liuyanban",{"_id":obj(id)},function(err,result){
       if (err){
           res.send("删除失败，请重试！");
           return;
       }
       //删除留言返回首页(重定向)
       res.redirect("/");


   })
})
//处理留言
app.post("/tj",function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields){
        //写入数据库
        db.insertMany("liuyanban",[{"Uname":fields.Uname,"neirong":fields.neirong,"date":sd.format(new Date())}],function(err,result){
           if(err){
               res.json(-1)
               return;
           }
                res.json(1);
        })
    })
})
//静态
app.use(express.static("./public"))
app.listen(3000)