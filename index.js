const express = require('express');
const app = express();
const cors  = require('cors');
require('dotenv').config();
app.listen(3000,(_ =>{
    console.log("Server listening port 3000");
}));
app.use(express.json())
app.use(function(req,res,next){
    cors({origin:req.headers.origin})
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'PUT,GET,POST')
    res.header('Access-Control-Allow-Headers', 'X-Request-With,Accept,Content-Type,X-HTTP-Method-Override')
    res.header  ('Access-Control-Allow-Credentials', true)
    next();
})
app.post("/createPost", async function(req, res){
console.log("Creating post...");
const { Configuration, OpenAIApi } = require("openai");
console.log("KEY",process.env.OPENAI_API_KEY);
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
let image_url,text_url;
try {
    const image = await openai.createImage({
        prompt:req.body.image,
        n:1,
    });
     image_url = image.data.data[0].url;
    
     let text = await openai.createCompletion({
      model: "text-davinci-003",
      prompt:req.body.description,
      temperature: 0.6,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 1,
      presence_penalty: 1,
    });
    console.log(text.data.choices)
    text_url = text.data.choices[0].text;
} catch (error) {
    console.log(error.message)
}

return res.status(200).json({data:{image:image_url,text:text_url},});
});