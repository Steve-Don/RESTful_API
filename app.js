
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const route = require("color-convert/route");

const app = express();

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title:String,
    content:String
};
 
//mongoose will make it "articles" after the word model
const Article = mongoose.model("Article",articleSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//fetch all the articles from db
app.get("/articles",function(req,res){
    Article.find(function(err,foundArticles){
        if(!err){
            res.send(foundArticles);
        }else{
            res.send(err);
        }
              
    })
}) 

app.post("/articles",function(req,res){
   
   
    const newArticle = new Article({
        title:req.body.title,
        contect:req.body.content
    });

    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added a new article")
        }else{
            res.send(err);
        }
    });
})

app.delete("/articles",function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all articles")
        }else{
            res.send(err);
        }
    })
})


// requests targetting a specific article by using route chain express
app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title:req.params.articleTitle},function(err,foundArticles){
        if(foundArticles){
            res.send(foundArticles);
        }else{
            res.send("NO articles found");
        }
    })
})

.put(function(req,res){
    Article.update(
        {title:req.params.articleTitle}, // First parameter: search condition where the title matches the search URL 
        {title:req.body.title,content:req.body.content},
        {overwrite:true},
        function(err){
            if(!err){
                res.send("successfully updated article");
            }
            
        }
    )
})

.patch(function(req,res){
    Article.update(
        {title:req.params.articleTitle},
        {content:req.body.content},
        function(err){
            if(!err){
                res.send("Successfully updated article")
            }else{
                res.send(err);
            }
        }
    )
})

.delete(function(req,res){
    Article.deleteOne(
        {title:req.params.articleTitle},
    function(err){
        if(!err){
            res.send("successfully deleted the corresponding article")
        }else{
            res.send(err);
        }
    })
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});