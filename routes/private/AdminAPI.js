const db = require('../../connectors/db');

const { authMiddleware, AuthorizedAdmin } = require('../../middleware/auth'); 
const { getSessionToken, getUser} = require('../../utils/session'); 

function handleAdminBackendApi(app) {

    app.get('/api/v1/users/view' , AuthorizedAdmin, async (req , res)=> {
        try{
          const result = await db.raw(`select * from "public"."users" order by user_id`);
          return res.status(200).send(result.rows);
        }catch(err){
          console.log("error message",err.message);
          return res.status(400).send(err.message);
        }
      }
    )
    
    app.delete('/api/v1/users/:id',AuthorizedAdmin, async (req, res)=> {
        const userId = req.params.id;

        const trx = await db.transaction();
        try {
          await trx('public.equipment_order')
          .join('public.orders', 'equipment_order.order_id', '=', 'orders.order_id')
          .where('orders.user_id', userId)
          .del();
          await trx('public.orders').where('user_id', userId).del();
          await trx('public.cart').where('user_id', userId).del();
          await trx('public.rating').where('user_id', userId).del();
          const result = await trx('public.users').where('user_id', userId).del();
        
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
      
    }
    )
    
    app.put('/api/v1/users/:id' ,AuthorizedAdmin, async (req , res) => {
        try{
          const {username , role} = req.body;
          const query = `update "public"."users"
          set username = '${username}',
          role = '${role}'
          where user_ID = ${req.params.id}`;
          const result = await db.raw(query);
          return res.status(200).send("Updated succesfully");
        }catch(err){
            console.log("error message",err.message);
            return res.status(400).send('could not update');
        }
      }
    )
    
    app.post('/api/v1/equipment/new',AuthorizedAdmin,  async(req,res) => {
      //  UserID= getUser().userId;

        const {equipmentID,equipment_name,equipment_img,rating,model_number,purchase_date,quantity,status,location,category_ID,supplier_id}= req.body;

        try{
            const result = await db.raw(`INSERT INTO "public".equipments (equipment_name,equipment_img,rating,model_number,purchase_date,quantity,status,location,category_ID,supplier_id) 
            VALUES ('${equipment_name}','${equipment_img}','${rating}','${model_number}','${purchase_date}','${quantity}','${status}','${location}','${category_ID}','${supplier_id}');`);

        return res.status(201).json({ message: "Successfully added equipment", rating: result.rows[0] });
        }
        
        catch(err){
            console.error("Error adding equipment:", err.message);
        return res.status(500).send("Failed to add equipment");
        }

    }
    )

    app.put('/api/v1/equipment/:id', AuthorizedAdmin,async(req,res) => {
    
        try {
          const {rating , purchase_date, quantity,status,location} = req.body;
          //console.log(req.body,salary); 
          //schema name is public and table name is equipments
          const query = `update "public"."equipments"     
                          set rating = '${rating}',
                            purchase_date = '${purchase_date}',
                            quantity = '${quantity}',
                            status = '${status}',
                            location = '${location}'
                            where equipment_ID = ${req.params.id}`
          const result = await db.raw(query);
          return res.status(200).send("Updated succesfully");
        } 
        catch (err) {
          console.log("Error", err.message);
          return res.status(400).send("failed to update equipment info");
        }
      
    }
    )

    app.delete('/api/v1/equipment/:id', AuthorizedAdmin, async (req, res) => {
      const equipmentId = req.params.id;
  
      const trx = await db.transaction();
      try {
     
          // Delete related entries in the rating table
          await trx('public.rating')
              .where('equipment_id', equipmentId)
              .del();
  
          await trx('public.cart')
          .where('equipment_id', equipmentId)
          .del();

          await trx('public.equipment_order')
          .where('equipment_id', equipmentId)
          .del();
  
          // Delete the equipment entry
          const result = await trx('public.equipments')
              .where('equipment_id', equipmentId)
              .del();
  
          if (result === 0) {
              await trx.rollback();
              return res.status(404).send("Equipment not found");
          }
  
          await trx.commit();
          return res.status(200).send("deleted successfully");
      } catch (err) {
          console.log("error message", err.message);
          await trx.rollback();
          return res.status(400).send("failed to delete equipment");
      }
  }
)

}
module.exports = {handleAdminBackendApi};
