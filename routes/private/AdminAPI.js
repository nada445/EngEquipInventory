const db = require('../../connectors/db');

const { Authenticate, AuthorizedAdmin } = require('../../middleware/auth'); 

function handleAdminBackendApi(app) {
    app.get('/api/v1/users/view' , async function(req , res) {
        try{
          const result = await db.raw(`select * from "SEproject"."users" order by user_id`);
          return res.status(200).send(result.rows);
        }catch(err){
          console.log("error message",err.message);
          return res.status(400).send(err.message);
        }
      });
    
      app.delete('/api/v1/users/:id', async (req, res)=> {
        const userId = req.params.id;

        const trx = await db.transaction();
        try {
          await trx('SEproject.equipment_order')
          .join('SEproject.orders', 'equipment_order.order_id', '=', 'orders.order_id')
          .where('orders.user_id', userId)
          .del();
          await trx('SEproject.orders').where('user_id', userId).del();
          await trx('SEproject.cart').where('user_id', userId).del();
          await trx('SEproject.rating').where('user_id', userId).del();
          const result = await trx('SEproject.users').where('user_id', userId).del();
        
          if (result === 0) {
            await trx.rollback();
            return res.status(404).send("User not found");
        }
        await trx.commit();
          return res.status(200).send("deleted succesfully");
        } catch (err) {
          console.log("eror message", err.message);
          return res.status(400).send("failed to delete employee");
        }
      
      })




}
module.exports = {handleAdminBackendApi};