const db = require('../../connectors/db');

const { authMiddleware, AuthorizedAdmin } = require('../../middleware/auth'); 
const { getSessionToken, getUser} = require('../../utils/session'); 

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });  // Store files in memory


function handleAdminBackendApi(app) {
    app.get('/api/v1/users/view' , AuthorizedAdmin, async function(req , res) {
        try{
          const result = await db.raw(`select * from "public"."users" order by user_id`);
          return res.status(200).send(result.rows);
        }catch(err){
          console.log("error message",err.message);
          return res.status(400).send(err.message);
        }
      });
    
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
      
      });
      app.put('/api/v1/users/:id' ,AuthorizedAdmin, async (req , res) => {
        try{
          const {username , role,} = req.body;
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
      }); 
      app.post('/api/v1/equipment/new', AuthorizedAdmin, upload.single('image'), async (req, res) => {
        const { equipment_name, model_number, purchase_date, quantity, status, location, category_ID, supplier_id } = req.body;
   
        if (!equipment_name || !model_number || !purchase_date || !quantity || !status || !location || !category_ID || !supplier_id) {
          return res.status(400).json({ message: "Missing required fields" });
      }
        try {
            // Access the image binary data from req.file or set it to null
            const equipment_img = req.file ? req.file.buffer : null;
    
            // Insert data into the database
            const result = await db.raw(`
                INSERT INTO "public".equipments 
                (equipment_name, equipment_img, model_number, purchase_date, quantity, status, location, category_ID, supplier_id) 
                VALUES 
                (?, ?, ?, ?, ?, ?, ?, ?, ?) 
                RETURNING *;`, 
                [
                    equipment_name,
                    equipment_img, // Null if no file is uploaded
                    model_number,
                    purchase_date,
                    quantity,
                    status,
                    location,
                    category_ID,
                    supplier_id
                ]
            );
    
            return res.status(201).json({ message: "Successfully added equipment", equipment: result.rows[0] });
        } catch (err) {
            console.error("Error adding equipment:", err.message);
            return res.status(500).send("Failed to add equipment");
        }
    });
    
    app.put('/api/v1/equipment/:id', AuthorizedAdmin,async(req,res) => {
   
        try {
          const {equipment_name, quantity,status,location} = req.body;
          //console.log(req.body,salary); 
          //schema name is public and table name is equipments
          const query = `update "public"."equipments"     
                            set equipment_name = '${equipment_name}',
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
      
      })

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

  app.get('/api/v1/equipment/view',AuthorizedAdmin ,async(req,res) => {

    try{
      const result = await db.raw(`SELECT 
equipments.*, 
categories.category_name, 
suppliers.supplier_name 
FROM 
"public".equipments
JOIN 
"public".categories 
ON equipments.category_id = categories.category_id
JOIN 
"public".suppliers 
ON equipments.supplier_id = suppliers.supplier_id;
`
      );
      
      
      return res.status(200).send(result.rows);
    }catch(err){
      console.log("Error",err.message);
      return res.status(400).send(err.message);
    }
  })
  app.get('/api/v1/supplier/view', AuthorizedAdmin, async (req, res) => {
    try {
      const result = await db.raw(`
        SELECT supplier_name, supplier_id
        FROM  "public".suppliers;
      `);
  
       // For debugging purposes
      return res.status(200).json(result.rows);
    } catch (err) {
      console.error("Error fetching suppliers:", err.message); // Secure logging
      return res.status(500).json({ message: "Internal Server Error" }); // Generic error message
    }
  });
  
  app.get('/api/v1/categories/view', AuthorizedAdmin, async (req, res) => {
    try {
      const result = await db.raw(`
        SELECT category_name, category_id
        FROM "public".categories;
      `);
  
     // For debugging purposes only
      return res.status(200).json(result.rows);
    } catch (err) {
      console.error("Error fetching categories:", err.message); // Log the error securely
      return res.status(500).json({ message: "Internal Server Error" }); // Generic error response
    }
  });
  app.get('/api/v1/equipment/:id', AuthorizedAdmin, async (req, res) => {
    const equipmentId = req.params.id;  // Get the dynamic ID from the request parameters
    console.log(equipmentId);
    
    try {
        const result = await db.raw(`
            SELECT 
              equipments.*, 
              categories.category_name, 
              suppliers.supplier_name 
            FROM 
              "public".equipments
            JOIN 
              "public".categories 
            ON 
              equipments.category_id = categories.category_id
            JOIN 
              "public".suppliers 
            ON 
              equipments.supplier_id = suppliers.supplier_id
            WHERE 
              equipments.equipment_id = ${equipmentId}`);
        
        // Check if the image exists and convert it to base64 if available
        if (result.rows.length > 0) {
            const equipment = result.rows[0];
            if (equipment.equipment_img) {
                // Convert binary image data to base64
                const base64Image = Buffer.from(equipment.equipment_img).toString('base64');
                equipment.image_url = `data:image/jpeg;base64,${base64Image}`;
            }
            return res.status(200).json(equipment);
        } else {
            return res.status(404).send("Equipment not found");
        }
    } catch (err) {
        console.log("Error", err.message);
        return res.status(400).send(err.message);
    }
});
app.get('/api/v1/users/:id', AuthorizedAdmin, async (req, res) => {
  const userid = req.params.id;  // Get the dynamic ID from the request parameters
  console.log(userid);
  
  try {
      const result = await db.raw(`
          SELECT * FROM "public".users
          WHERE 
           user_id = ${userid}`);
      
      // Check if the image exists and convert it to base64 if available
      if (result.rows.length > 0) {
          const user = result.rows[0];
          return res.status(200).json(user);
      } else {
          return res.status(404).send("user not found");
      }
  } catch (err) {
      console.log("Error", err.message);
      return res.status(400).send(err.message);
  }
});


}
module.exports = {handleAdminBackendApi};
