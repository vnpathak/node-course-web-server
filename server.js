const express=require('express');
const hbs=require('hbs');
const fs=require('fs');
const port=process.env.PORT || 3000;   //process.env staores all environmental variables as key value pair

var app=express();  //initializes express

hbs.registerPartials(__dirname+'/views/partials')    //takes directory u wanna use for all handlebar partial files
app.set('view engine','hbs');   //uses hbs as view engine
app.use(express.static(__dirname/*specifies absolute directory*/+'/public'));   //considers ./public as static directory. v teach express how to read from a static directory.app.use registers middleware(it can do anything-execute code/change req or res object/etc) and v prvide middleware function we want to use

app.use((req,res,next)=>{
    var now = new Date().toString();
    var log=`${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log',log+'\n',(err)=>{    //not mandatory to have callback func here bt as v r getting deprecatedWarning we took it here
        if(err)
        {
            console.log('Unable to append to server.log');
        }
    });
    next(); //to tell express that middleware execution is done. app continues to run
});

// app.use((req,res,next)=>{
//     res.render('maintenance.hbs');  //as we haven't written next() no matter u render any page, u will get maintenance page only
// });

hbs.registerHelper('getCurrentYear',()=>{   //helps run the function in 2nd parameter to be executed when getCurrentYear is written (no need to have date().getFullYear() everytime we want to display current year)
    return new Date().getFullYear()
});

hbs.registerHelper('screamIt',(text)=>{
    return text.toUpperCase();
});

app.get('/',(req,res)=>{    //let us set up a handler for http get request
    //res.send('<h1>Hello Express!</h1>');
    //************************************************************************//
    // res.send({
    //     name:'Vishwa',
    //     likes:[
    //         'composing poems',
    //         'ecompany natural beauty'
    //     ]
    // });
    //************************************************************************//
    res.render('home.hbs',{
        pageTitle:'Home Page',
        //currentYear:new Date().getFullYear(),
        welcomeMsg:'Hello welcome to my website.'
    });
});

app.get('/about',(req,res)=>{
    //res.send('About Page');
    res.render('about.hbs',{
        pageTitle:'About Page',
        //currentYear:new Date().getFullYear()  //no need because we used hbs helper
    });    //renders any template to the response
});

app.get('/bad',(req,res)=>{
    res.send({
        error: 'Bad Page',
        errorMessage: 'URL not appropriate. Check the credentials'
    });
});

app.listen(port,()=>{
    console.log(`Server is ready to go on port ${port}`);
});