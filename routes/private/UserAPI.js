const db = require('../../connectors/db');

const {authMiddleware, AuthorizedStandardUser} = require('../../middleware/auth'); 
const { getSessionToken, getUser} = require('../../utils/session'); 

function handleStandardUserBackendApi(app) {

    app.get('/api/v1/equipment/view',AuthorizedStandardUser ,async(req,res) => {

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
          console.log(`Results`,result.rows);
          return res.status(200).send(result.rows);
        }catch(err){
          console.log("Error",err.message);
          return res.status(400).send(err.message);
        }
      }
    )

    app.post('/api/v1/rating/new', AuthorizedStandardUser, async (req, res) => {
      //await checkUser(req);
    
      const { equipment_id, comment, score } = req.body;  // Changed 'equipmentID' to 'equipment_id'
      const User= await getUser(req);
      const UserId = User.user_id;
    
      if (!equipment_id || !score) {
        return res.status(400).send("Equipment ID and score are required.");
      }
    
      try {
        // Check if equipment exists
        const equipmentExists = await db('public.equipments')
          .where('equipment_id', equipment_id)
          .first(); // Retrieves the first match
    
        if (!equipmentExists) {
          return res.status(404).send("Equipment not found.");
        }
    
        const query = 
      `INSERT INTO "public"."rating" (user_id, equipment_id, comment, score)
      VALUES ('${UserId}', '${equipment_id}', '${comment}', ${score});`;

      const result = await db.raw(query);
    
        return res.status(200).send("rating added successfully");
      } catch (err) {
        console.error("Error adding rating:", err.message);
        return res.status(500).send("Failed to add rating");
      }
    }
    )

    app.post('/api/v1/cart/new', AuthorizedStandardUser, async(req,res) => {
      //await checkUser(req);

      const { equipment_id, quantity}=req.body;

      if(!equipment_id || !quantity){
        return res.status(400).send("Equipment ID and quantity are required.");
      }

      if (quantity <= 0) {
        return res.status(400).send("Quantity must be greater than zero.");
      }

      const User= await getUser(req);
      const UserId = User.user_id;

        try{
                const equipment = await db('public.equipments')
                .where('equipment_id', equipment_id)
                .first();

                if (!equipment) {
                return res.status(404).send("Equipment not found.");
                }

                if (quantity > equipment.quantity) {
                return res.status(400).send("Requested quantity exceeds available stock.");
                }

                const result = await db.raw(`INSERT INTO "cart" (User_id, equipment_id, quantity) 
                VALUES ('${UserId}' ,'${equipment_id}', '${quantity}');`);

            return res.status(201).send("Equipment successfully added to the cart.");
        }
        catch(err){
            
                console.log("failed adding item in cart", err.message);
            return res.status(500).send("Failed to add item in cart");
        }
    }
    )

    app.delete('/api/v1/cart/delete/:cartId', AuthorizedStandardUser, async(req,res) => {

      //await checkUser(req);
      const User= await getUser(req);
      const UserId = User.user_id;
      const cartId = req.params.cartId;

      try{
        const cart = await db('public.cart')
        .where('user_id' , UserId)
      .andWhere('cart_id', cartId)  // Check if the user owns the cart item
      .first();  // Get the first result, assuming cart_ID is unique per user


    if (!cart) {
      return res.status(404).send("Cart not found or you do not have permission to delete this item.");
    }

        const result = await db('public.cart')
        .where('user_id' , UserId)
      .andWhere('cart_id', cartId)  // Check if the user owns the cart item
      .del();  // Use `del()` to delete the record

    
    if (result === 0) {
      return res.status(404).send("Cart item not found.");
    }

    return res.status(200).send("Successfully deleted the cart item." );
        }
        catch(err){
                console.log("couldn't delete item", err.message);
            return res.status(500).send("Failed to delete item");     
        }

    }
    )

    app.post('/api/v1/order/new', AuthorizedStandardUser, async (req, res) => {
      const User= await getUser(req);
      const UserId = User.user_id;
    
      try {
        const trx = await db.transaction();
    
        try {
          // Step 2: Retrieve the user's cart
          const cartItems = await trx('public.cart')
            .where('user_id', UserId)
            .select('equipment_id', 'quantity');
    
          if (!cartItems || cartItems.length === 0) {
            await trx.rollback();
            return res.status(400).send("Your cart is empty. Add items to your cart before placing an order.");
          }
    
          // Combine duplicate equipment entries in the cart
          const combinedCartItems = cartItems.reduce((acc, item) => {
            const existingItem = acc.find(i => i.equipment_id === item.equipment_id);
            if (existingItem) {
              existingItem.quantity += item.quantity; // Combine quantities
            } else {
              acc.push(item);
            }
            return acc;
          }, []);
    
          // Step 3: Create a new order
          const [orderIdObj] = await trx('public.orders')
            .insert({ user_id: UserId })
            .returning('order_id');
          const orderId = orderIdObj.order_id;
    
          // Step 4: Insert into equipment_order
          const equipmentOrderData = combinedCartItems.map(item => ({
            order_id: orderId,
            equipment_id: item.equipment_id,
            quantity: item.quantity
          }));
          await trx('public.equipment_order').insert(equipmentOrderData);
    
          // Step 5: Reduce equipment quantities
          for (const item of combinedCartItems) {
            const equipment = await trx('public.equipments')
              .where('equipment_id', item.equipment_id)
              .select('quantity')
              .first();
    
            if (!equipment || equipment.quantity < item.quantity) {
              await trx.rollback();
              return res.status(400).send(`Not enough stock for equipment ID ${item.equipment_id}.`);
            }
    
            await trx('public.equipments')
              .where('equipment_id', item.equipment_id)
              .update({
                quantity: equipment.quantity - item.quantity
              });
          }
    
          // Step 6: Clear the cart
          await trx('public.cart')
            .where('user_id', UserId)
            .del();
    
          await trx.commit();
          return res.status(201).json({
            message: "Order placed successfully.",
            order_ID: orderId
          });
        } catch (err) {
          await trx.rollback();
          console.error("Transaction failed:", err.message);
          return res.status(500).send("Failed to place the order.");
        }
      } catch (err) {
        console.error("Error:", err.message);
        return res.status(500).send("An unexpected error occurred.");
      }
    }
    )

    app.get('/api/v1/rating/:id', AuthorizedStandardUser, async (req, res)=>{

      const equipmentId = req.params.id;
      
      try{

        const ratings = await db('public.rating')
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
module.exports = {handleStandardUserBackendApi};
