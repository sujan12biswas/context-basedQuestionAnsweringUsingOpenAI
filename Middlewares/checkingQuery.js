async function checkingReqBody(req,res,next){
    try {
        //Getting the payload 
        const {query} = req.body;

        //if query and tableName is not present in the payload
        if(!query){
            console.log("Please provide the query ");
            return res.status(400).send("Please provide the query"); 
        }      
        next();
        
    } catch (error) {
        console.log(error);
    }
}

module.exports.checkingReqBody = checkingReqBody;