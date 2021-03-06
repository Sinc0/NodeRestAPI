const country = require('../country');
const mongoose = require('mongoose');
const token = require('../token');
const dbCollectionTokens = mongoose.connection.collection('tokens');

exports.getAll = async(req, res, next) => {
    console.log(req.ip + " requests " + "/countries");

    //let arrayQueryParams = Object.values(req.query);
    //let queryParams = arrayQueryParams.length;
    //let title = req.query.title;
    //console.log(req.query)
    //console.log(arrayQueryParams.length);
    //console.log(req.ip);
    //console.log(req.headers);
    //let t = req.headers.token;
    //console.log(t);
    //console.log(req.body);
    
    let tkn = req.headers.token;
    let countriesArray = [];
    
    const updateDb = await dbCollectionTokens.updateOne({id: tkn}, {$inc: {"/countries": 1}});
    
    const countries = await country.find();
    
    let c = 0;
    for(c = 0; c < countries.length; c++)
    {
        countriesArray.push({
            id: countries[c].id,
            name: countries[c].name,
            population: countries[c].population,
            capital: countries[c].capital,
            currency: countries[c].currency
        });
    }
    
    //console.log(countriesArray);
    
    res.status(201).json({
        message: 'List of all stored countries',
        post: 
        { 
            countries: countriesArray
        }
    });
   
}

exports.getSpecific = async(req, res, next) => {
    console.log(req.ip + " requests " + "/country");
    //console.log(req.query);
    //console.log(req.body);
    
    let queryParams = Object.values(req.query);

    if(queryParams.length == 0)
    {
        queryParams = req.body.params.replace(/\s/g, "");;
    }

    let paramsToString = queryParams.toString();
    let paramsToLowerCase = paramsToString.toLowerCase();
    let paramsDirtyArray = paramsToLowerCase.split(',');
    let paramsCleanArray = [];
    let numberOfParams = paramsDirtyArray.length;
    let tkn = req.headers.token;
    let cntry;
    
    let c = 0;
    for(c = 0; c < numberOfParams; c++)
    {
        let paramsToUpperCaseFirstLetter = paramsDirtyArray[c].charAt(0).toUpperCase() + paramsDirtyArray[c].substring(1);
        
        if(paramsToUpperCaseFirstLetter == "Usa")
        paramsToUpperCaseFirstLetter = "USA";
        
        paramsCleanArray.push(paramsToUpperCaseFirstLetter);
    }

    const updateDb = await dbCollectionTokens.updateOne({id: tkn}, {$inc: {"/country": 1}});

    if(numberOfParams == 1)
    {
        cntry = await country.find({name: paramsCleanArray.toString()});
    
        if(cntry.length == 0)
        {
            res.status(404).json({
                message: '404 Country not found'
            });
        }

        else
        {
            res.status(201).json({
                message: 'Specific Country',
                post: 
                { 
                    country: 
                    {
                        id: cntry[0].id,
                        name: cntry[0].name,
                        population: cntry[0].population,
                        capital: cntry[0].capital,
                        currency: cntry[0].currency
                    }
                }
            });
        }
        
    }
    
    else
    {
        let countriesArray = [];
        
        for(let c = 0; c < numberOfParams; c++)
        {
            cntry = await country.find({name: paramsCleanArray[c]})

                if(cntry.length == 0)
                {
                    res.status(404).json({
                        message: '404 Countries not found'
                    });
                }
                
                countriesArray.push({
                    id: cntry[0].id,
                    name: cntry[0].name,
                    population: cntry[0].population,
                    capital: cntry[0].capital,
                    currency: cntry[0].currency
                });
        }

        if(countriesArray == 0)
        {
            res.status(404).json({
                message: '404 Countries not found'
            });
        }

        else
        {
            res.status(201).json({
                message: 'Specific Countries',
                post: 
                { 
                    countries: countriesArray
                }
            });
        }
    }
    
}

exports.createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;

    //should create post in db
    res.status(201).json({
        message: 'Post created successfully',
        post: 
        { 
            id: Math.random(), 
            title: title, 
            content: content 
        }
    });
}

/*
if(queryParams == 0)
{
    res.status(200).json({
        posts: [{title: "Post Test", content: 'Hello this is a test'}]
    });   
}

else
{
    res.status(200).json({
        posts: [{title: title, content: 'Hello this uses req query parameters'}]
    });   
}
*/