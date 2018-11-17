/**
 * @file Manages routings and api designs.
 */

const blockChainRouter = require('express').Router();
const { blockModel, blockChainModel } = require('./mongoose-db');
const apiMsg = require('./apiMsg');

// blockChain api
blockChainRouter.get('/read', upload.fields(readWebform),async (req, res, next)=>{
    console.log('api: read webform');
    const {formId} = req.body
    let returnedWebForm = {};
    await webForms.find({formId: formId}, function(err, forms){
        if(err){
            console.log(`find webform error: ${err}`);
            res.status(200).json({apiMsg: apiMsg.webformReadUnSuccessfully});
        }
        console.log(`the result ${forms}`);
        returnedWebForm = forms[0];
    });
    // As loading the webForm, components are also queried from the DB.
    await components.find({formId: req.body.formId}, function(err, components){
        if(err){
            console.log(`find components error: ${err}`);
            res.status(200).json({apiMsg: apiMsg.webformReadUnSuccessfully});
        }
        console.log(`the result is: ${components}`);
        res.status(200).json({webFormInfo: returnedWebForm, components: components, apiMsg: apiMsg.webformReadSuccessfully});
    })
});

blockChainRouter.post('/create', upload.fields(createWebform),async (req, res, next)=>{
    console.log('api: create webform', );
    const newForm = new webForms({
        formId: req.body.formId,
        title: req.body.title,
        author: req.body.author
    });
    await newForm.save(function(err){
        if(err){
            console.log(`webform saved  error: ${err}`);
            res.status(200).json({apiMsg: apiMsg.webformSavedUnSuccessfully});
        }
        else{
            console.log('webform saved successfully');
            res.status(200).json({apiMsg: apiMsg.webformSavedSuccessfully});
        }
    });
});

blockChainRouter.delete('/delete', upload.fields(deleteWebform), async (req, res, next)=>{
    console.log('api: delete webform');
    await webForms.deleteOne({formId: req.body.formId}, 
        function(err){
            if(err){
            console.log(`delete webform error: ${err}`); res.status(200).json({apiMsg: apiMsg.webformDeletedUnSuccessfully})              
            }
     });
    res.status(200).json({apiMsg: apiMsg.webformDeletedSuccessfully});
});

blockChainRouter.put('/update', upload.fields(modifyWebform), async(req, res, next)=>{
    console.log('api: update webform');
    webForms.update({formId: req.body.formId}, {author: req.body.author, title: req.body.title}, function(err){
        if(err){
            console.log(`update webform error: ${err}`);
            res.status(200).json({apiMsg: apiMsg.webformUpdatedUnSuccessfully});
        }
     });
     res.status(200).json({apiMsg: apiMsg.webformUpdatedSuccessfully});
})

module.exports = {
    blockChainRouter
};
