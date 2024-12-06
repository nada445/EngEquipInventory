const db = require('../connectors/db');

async function GetUser(query){
    try{
    const result= await db.raw(query);

    return result.rows;
    }

    catch(error){
        console.error("the user data wasn't found in the data base", error.message);
    }
}

async function Authenticate(req, res, next){

    const token= req.header('authorization');

    if(!token){
        res.status(401).send('Access denied, no token provided');
    }

    try{
        decoded= JWT.verify(token, process.env.JWT_SECRET);
        req.user= decoded;

        next();
    }

    catch(EX){
        res.status(400).send('invalid token.');
    }
}

async function AuthorizedAdmin(req, res, next){

    if(req.User.role !== 'admin'){
        res.status(400).send('Access denied. ONLY ADMINS have permission to perform this action.');
    }
    next();
}

async function AuthorizedStandardUser(req, res, next){

    if(req.User.role != 'standard_user'){
        res.status(400).send('Access denied. ONLY STANDARD USERS have permission to perform this action.');
    }
    next();
}

module.exports = {GetUser ,Authenticate, AuthorizedAdmin, AuthorizedStandardUser};