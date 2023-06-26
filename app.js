const express=require("express");
const app=express();
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
const request=require("request");
const https=require("https");

app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
});

app.post("/",function(req,res){
    const first=req.body.firstName;
    const last=req.body.lastName;
    const email=req.body.email;

    const data = {
        members: [
          {
            email_address: email,
            status: "subscribed",
            merge_fields: {
              FNAME: first,
              LNAME: last
            }
          }
        ]
      };

    const jsonData=JSON.stringify(data);

    const url="https://us21.api.mailchimp.com/3.0/lists/fba620d19c";

    const options={
        method: "POST",
        auth: "sanya:83a71a42588026af19278f5b0dd81603-us21"
    }

    const mailchimpRequest= https.request(url,options,function(response){

        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        })

    });

    mailchimpRequest.write(jsonData);
    mailchimpRequest.end();
});

app.post("/failure",function(req,res){
    res.redirect("/");
});

app.post("/success",function(req,res){
    res.redirect("/");
});



app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running.");
});


//apiKey- 83a71a42588026af19278f5b0dd81603-us21
//list id- fba620d19c
