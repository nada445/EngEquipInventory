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
 app.post('/api/v1/equipment/new',  async(req,res) => {
        UserID= GetUser();

        const {equipmentID,equipment_name,equipment_img,rating,model_number,purchase_date,quantity,status,location,category_ID,supplier_id}= req.body;

        try{
            const result = await db.raw(`INSERT INTO "equipments" (equipmentID,equipment_name,equipment_img,rating,model_number,purchase_date,quantity,status,location,category_ID,supplier_id) 
            VALUES ('${equipmentID}', '${equipment_name}','${equipment_img}','${rating}','${model_number}','${purchase_date}','${quantity}','${status}','${location}','${category_ID}','${supplier_id}');`);

        return res.status(201).json({ message: "Successfully added equipment", rating: result.rows[0] });
        }
        
        catch(err){
            console.error("Error adding equipment:", err.message);
        return res.status(500).send("Failed to add equipment");
        }

    }
    )
    app.put('/api/v1/equipment/:id', async(req,res) => {
        UserID= GetUser();
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
                             where id = ${req.params.id}`
          const result = await db.raw(query);
          return res.status(200).send("Updated succesfully");
        } 
        catch (err) {
          console.log("Error", err.message);
          return res.status(400).send("failed to update equipment info");
        }
      
      })

      app.delete('/api/v1/equipment/:id',async(req,res) => {
    
        try {
          const query = `delete from "public"."equipments" where id=${req.params.id}`; //shcema name public , table is equipments
          const result = await db.raw(query);
          return res.status(200).send("deleted succesfully");
        }
         catch (e) {
          console.log("Error", err.message);
          return res.status(400).send("failed to delete equipment");
        }
      
      })




}
module.exports = {handleAdminBackendApi};
