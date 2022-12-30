const express = require('express');
const app = express();
const cors  = require('cors');
app.use(function(req,res,next){
    cors({origin:req.headers.origin})
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'PUT,GET,POST')
    res.header('Access-Control-Allow-Headers', 'X-Request-With,Accept,Content-Type,X-HTTP-Method-Override')
    res.header  ('Access-Control-Allow-Credentials', true)
    next();
})
require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
console.log("KEY",process.env.OPENAI_API_KEY);
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
app.listen(3000,(_ =>{
    console.log("Server listening port 3000");
}));
app.use(express.json({limit:"50mb"}))
app.post("/createPost", async function(req, res){
console.log("Creating post...");
let image_url,text_url;
try {
    let {title,description,file,type} = req.body;
    console.log(req.body);
    const prompt = `Generate an image of a ${type} with the title ${title} and the description ${description} overlaid on the image. Include the logo  ${file} in the image.`;
    const image = await openai.createImage({
        prompt:prompt,
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
    console.log(error)
}

return res.status(200).json({data:{image:image_url,text:text_url},});
});

app.post("/editPost",async (req,res) => {
    // const prompt = `Generate an image of a ${imageType} with the title "${title}" and the description "${description}" overlaid on the image. Include the logo "${logo.name}" in the image.`;
const image = await openai.createImage({
    prompt:`Generate a poster card containing ${req.body.file}`,
    n:1,
});
console.log(image.data);

return res.status(200).json({data:{image:image.data.data}})
})