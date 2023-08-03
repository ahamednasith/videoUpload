const express = require('express');
const profileRoute = require('./routes/profile.router');
const app = express();
const port = 7878;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/',profileRoute);
app.use('video',express.static('public/videos'));

app.listen(port,() => {
    console.log(`Server Is Running On ${port}`);
})