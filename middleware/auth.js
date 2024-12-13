const db = require('../connectors/db');
const {getSessionToken,getUser} = require('../utils/session');
async function authMiddleware(req, res, next) {
    const sessionToken = getSessionToken(req);
    //console.log(sessionToken)
    if (!sessionToken) {
      console.log("sesison token is null")
      return res.status(301).redirect('/');
    }
    // We then get the session of the user from our session map
    // that we set in the signinHandler
    const userSession = await db.select('*').from('SEproject.session').where('token', sessionToken).first();
    if (!userSession) {
      console.log("user session token is not found")
      // If the session token is not present in session map, return an unauthorized error
      return res.status(301).redirect('/');
    }
    // if the session has expired, return an unauthorized error, and delete the 
    // session from our map
    if (new Date() > userSession.expiresAt) {
      console.log("expired session");
      return res.status(301).redirect('/');
    }
    const user = await db.select('user_id', 'role').from('SEproject.users').where('user_id', userSession.userId).first();
    
    if (!user) {
        console.log("user not found");
        return res.status(301).redirect('/');
    }

    // Attach user details to req.user for later use
    req.user = user;
    
    // Proceed to next middleware or route handler
  
    // If all checks have passed, we can consider the user authenticated
    next();
  };
/*async function GetUser(query){
    try{
    const result= await db.raw(query);

    return result.rows;
    }

    catch(error){
        console.error("the user data wasn't found in the data base", error.message);
    }
}*/

/*async function Authenticate(req, res, next){

    const token= req.header('authorization');

    if(!token){
        return res.status(401).send('invailed tocken');
    }

    try{
        decoded= JWT.verify(token, process.env.JWT_SECRET);
        req.user= decoded;

        next();
    }

    catch(EX){
        return res.status(400).send('invalid token.');
    }
}*/

async function AuthorizedAdmin(req, res, next){
try {
    if(req.user.role !== 'admin'){
        return res.status(400).send('Access denied. ONLY ADMINS have permission to perform this action.');
    }
} catch (error) {
}
    next();  
   
  
}

async function AuthorizedStandardUser(req, res, next){

    try {
        if(req.user.role !== 'standerd_user'){
            return res.status(400).send('Access denied. ONLY users have permission to perform this action.');
        }
    } catch (error) {
         }
              next();  
    
}

module.exports = {authMiddleware , AuthorizedAdmin, AuthorizedStandardUser, authMiddleware};