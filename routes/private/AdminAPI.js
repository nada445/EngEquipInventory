const db = require('../../connectors/db');

const { Authenticate, AuthorizedAdmin } = require('../../middleware/auth'); 

function handleAdminBackendApi(app) {
    app.get('/api/v1/users/view' , async function(req , res) {
        try{
          const result = await db.raw(`select * from "SEproject"."users" order by id`);
          return res.status(200).send(result.rows);
        }catch(err){
          console.log("error message",err.message);
          return res.status(400).send(err.message);
        }
      });
      app.put('/employee/:id', async (req, res)=> {
    
        try {
          
          const {username ,role } = req.body;
          const query = `update "SEproject"."users"
                             set username = '${username}',
                             role = '${role}'
                             where id = ${req.params.id}`
          const result = await db.raw(query);
          return res.status(200).send("updated succesfully");
        } catch (err) {
          return res.status(400).send("failed to update employee");
        }

      
      });
      app.delete('/api/v1/users/:id', async (req, res)=> {
    
        try {
          const query = `delete from "SEproject"."users" where id=${req.params.id}`;
          const result = await db.raw(query);
          return res.status(200).send("deleted succesfully");
        } catch (err) {
          console.log("eror message", err.message);
          return res.status(400).send("failed to delete employee");
        }
      
      })




}
module.exports = {handleAdminBackendApi};