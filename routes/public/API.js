const db = require('../../connectors/db');

const {authMiddleware} = require('../../middleware/auth');
const { v4 } = require('uuid');
const bcrypt = require('bcrypt');

function HandleSEprojectBackendApi(app){

  app.post('/api/v1/user/login', async function(req, res) {
    // get users credentials from the JSON body
    const { username, password } = req.body
    if (!username) {
      // If the email is not present, return an HTTP unauthorized code
      return res.status(400).send('username is required');
    }
    if (!password) {
      // If the password is not present, return an HTTP unauthorized code
      return res.status(400).send('Password is required');
    }

    // validate the provided password against the password in the database
    // if invalid, send an unauthorized code
    let user = await db.select('*').from('SEproject.users').where('username', username);

    if (user.length == 0) {
      return res.status(400).send('user does not exist');
    }
    user = user[0];
  
      // Compare password using bcrypt asynchronously
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send('Password does not match');
      }
  

   
    // set the expiry time as 30 minutes after the current time
    const token = v4();
    const currentDateTime = new Date();
    const expiresAt = new Date(currentDateTime.getTime() + 18000000); // expire in 3 minutes

    // create a session containing information about the user and expiry time
    const session = {
      userId: user.user_id,
      token,
      expiresAt,
    };
    try {
      await db('SEproject.session').insert(session);
      // In the response, set a cookie on the client with the name "session_cookie"
      // and the value as the UUID we generated. We also set the expiration time.
      res.cookie("session_token", token, { expires: expiresAt, httpOnly: true })
        .status(200)
        .send('Login successful');
      } catch (e) {
      console.log(e.message);
      return res.status(400).send('Could not here register user');

    }
  }
  )
 
  app.post('/api/v1/user/new', async function(req, res) {
      const userExists = await db.select('*').from('SEproject.users').where('email', req.body.email);
      const usernameExists = await db.select('*').from('SEproject.users').where('username', req.body.username);
      if (userExists.length > 0) {
        return res.status(400).send('user exists');
        }
      if (usernameExists.length > 0) {
        return res.status(400).send('username is used pick a different one');
        }
      try {
        const newUser = req.body;
        newUser.password = await bcrypt.hash(newUser.password, 10);
        const user = await db('SEproject.users').insert(newUser).returning('*');
        console.log("user new",user);
        return res.status(200).send('User registerd succefully');
        } catch (e) {
        console.log(e.message);
        return res.status(400).send('Could not register user');
        }
        }
  )
    
  app.get('/api/v1/rating/:id', AuthorizedStandardUser, async (req, res)=>{

      const equipmentId = req.params.id;
      
      try{

        const ratings = await db('SEproject.rating')
        .where('equipment_id', equipmentId) // Filter by equipment ID
        .select('user_id', 'comment', 'score'); 

        if (!ratings || ratings.length === 0) {
          return res.status(404).json({
            message: `No ratings found for equipment ID ${equipmentId}.`
          });
        }
    
        // Return the ratings as a JSON response
        return res.status(200).json({
          equipment_id: equipmentId,
          ratings: ratings
        });

      }
      catch(error){
          console.error("Error fetching ratings:", err.message);
          return res.status(500).json({
            message: "An error occurred while fetching ratings."
    });
      }
    }
  )  

}
module.exports = {HandleSEprojectBackendApi};
