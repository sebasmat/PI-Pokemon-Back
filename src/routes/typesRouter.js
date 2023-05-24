const express = require("express");
const typesRouter = express.Router();
const findAllTypes = require('../Controllers/findAllTypes');

typesRouter.get("/", async (req,res)=>{
    try {
        const types = await findAllTypes();
        res.status(200).json(types);
    } catch (error) {
        res.status(400).json({error:error.message});
    }
});

module.exports = typesRouter;