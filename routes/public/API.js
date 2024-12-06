const db = require('../../connectors/db');

const { Authenticate} = require('../../middleware/auth');
const { v4 } = require('uuid');
const bcrypt = require('bcrypt');

function HandlePublicBackendApi(app){
 app.post('/api/v1/user/new', async function(req, res) {
          const userExists = await db.select('*').from('schem.userstable').where('email', req.body.email);
          console.log("UE",userExists)
          if (userExists.length > 0) {
            return res.status(400).send('user exists');
          }
          
          try {
            const newUser = req.body;
            newUser.password = await bcrypt.hash(newUser.password, 10);
            const user = await db('schem.userstable').insert(newUser).returning('*');
            console.log("user new",user);
            return res.status(200).json(user);
          } catch (e) {
            console.log(e.message);
            return res.status(400).send('Could not register user');
          }
        })
    
        
}
module.exports = {HandlePublicBackendApi};
