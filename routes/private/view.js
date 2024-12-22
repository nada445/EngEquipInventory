const db = require('../../connectors/db');
const { getSessionToken , getUser } = require('../../utils/session');

function handlePrivateFrontEndView(app) {

    app.get('/dashboard' , async (req , res) => {
        
        const user = await getUser(req);
        if(user.role == "admin" ){
            return res.render('admins', {name : user.username});
        }

        if(user.role == "standard_user" ){
            return res.render('users', {name : user.username});
        }
    });

    app.get('/cart', async (req, res) => {
        const user = await getUser(req);
        //console.log('user info:', user);
    
        if (user.role === "standard_user") {
        try {
            
            const cartitems = await db
            .select('*')
            .from("SEproject.cart")
            .where('user_id', user.user_id);

            
            const equipmentIds = cartitems.map(item => item.equipment_id); 
            const equipmentsname = await db
            .select('equipment_id', 'equipment_name') 
            .from("SEproject.equipments")
            .whereIn('equipment_id', equipmentIds);

            const combinedCart = cartitems.map(cartItem => {
                
                const equipment = equipmentsname.find(equip => equip.equipment_id === cartItem.equipment_id);
                
                return {
                    cart_id: cartItem.cart_id,
                    equipment_id: cartItem.equipment_id,
                    quantity: cartItem.quantity,
                    equipment_name: equipment ? equipment.equipment_name : 'Unknown' // Handle missing names
                };
            });
            
            return res.render('cart', { combinedCart: combinedCart });
        } catch (error) {
            console.log("Couldn't get items from the cart:", error.message);
            return res.status(500).send("Failed to get cart items");
        }
        } else {
        return res.status(403).send("Access denied. Only standard users can access the cart.");
        }
    }
    )
    app.get('/userequipments', async(req, res)=>{

        const user = await getUser(req);
        if (user.role === "standard_user") {
            try{

            //equipments reduced info
            const equipmentsRI = await db
            .select('*')
            .from("SEproject.equipments");

            //putting the suppliers, categories ids in two serparate arrays
            const supplierIds = equipmentsRI.map(item => item.supplier_id); 
            const categoryIds = equipmentsRI.map(item => item.category_id); 

            //getting supplier names by id
            const suppliernames = await db
            .select('*')
            .from("SEproject.suppliers")
            .whereIn('supplier_id', supplierIds);

            //getting category names by id
            const categorynames = await db
            .select('category_id', 'category_name')
            .from("SEproject.categories")
            .whereIn('category_id', categoryIds);

            //equipments important info
            const equipmentsII = await db
            .select('equipment_id','equipment_img', 'equipment_name', 'model_number', 'quantity', 'location', 'status', 'rating', 'category_id', 'supplier_id' ) 
            .from("SEproject.equipments")

            //equipments All Info
            const equipmentsAI = equipmentsII.map(equipmentItem => {
                
                const suppliers = suppliernames.find(equip => equip.supplier_id === equipmentItem.supplier_id);
                const categories = categorynames.find(equip => equip.category_id === equipmentItem.category_id);
                if (equipmentItem.equipment_img) {
                    // Convert binary image data to base64
                    const base64Image = Buffer.from(equipmentItem.equipment_img).toString('base64');
                    equipmentItem.image_url = `data:image/jpeg;base64,${base64Image}`;
                }
                return {
                    equipment_id: equipmentItem.equipment_id,
                    equipment_img:  equipmentItem.image_url,
                    equipment_name: equipmentItem.equipment_name,
                    model_number: equipmentItem.model_number,
                    quantity: equipmentItem.quantity,
                    status: equipmentItem.status,
                    location: equipmentItem.location,
                    rating: equipmentItem.rating,
                    category:categories ? categories.category_name : 'Unknown',
                    supplier:suppliers ? suppliers.supplier_name : 'Unknown'
                };
            });

            return res.render('userequipments', { equipmentsAI: equipmentsAI, categorynames: categorynames,
                suppliernames: suppliernames });
            }
            catch(error){

            console.log("Couldn't get equipment info:", error.message);
            return res.status(500).send("Failed to get equipment info");
            }
        }
        else {
            return res.status(403).send("Access denied. Only standard users can access the equipments page.");
            }
    }
    )
    app.get('/equipments' , async (req , res) => {
        
        const user = await getUser(req);
        console.log('user info' , user)
        if(user.role == "admin" ){
            return res.render('equipmentmanage', {name : user.username});
    
    
            
        }
        
    
       
    });
app.get('/addequipment', (req, res) => {
    res.render('addequipment'); // Ensure the file is correctly named and located in your views folder
});
app.get('/usermanagement', (req, res) => {
    res.render('usermanagement'); // Ensure the file is correctly named and located in your views folder
});
app.get('/orders', async(req, res)=>{

    const user= await getUser(req);
    const UserId= user.user_id;
        if (user.role === "standard_user") {
            try{

            const OrderIds = await db
            .select('order_id', 'date')
            .from("SEproject.orders")
            .where('user_id', UserId)

            const orderIdArray=[];
            for(let order of OrderIds ){
            //console.log("order id: ",order.order_id);
            orderIdArray.push(order.order_id) ;
            }

            const orderdetails= await db
            .select('order_id' ,' equipment_id', 'quantity')
            .from("SEproject.equipment_order")
            .whereIn('order_id', orderIdArray);

            const equipmentIdArray=[];
            for(let order of orderdetails ){
            //console.log("order id: ",order.equipment_id);
            equipmentIdArray.push(order.equipment_id) ;
            }
            //console.log("equipmentIdArray: ", equipmentIdArray);

            const equipmentdetails= await db
            .select('equipment_id' ,'equipment_name', 'model_number','category_id', 'supplier_id' ) 
            .from("SEproject.equipments")
            .whereIn('equipment_id', equipmentIdArray);

            const supplieridArray=[];
            for(let supplier of equipmentdetails ){
                //console.log("supplier_id: ",supplier.supplier_id);
                supplieridArray.push(supplier.supplier_id) ;
            }

            const suppliers= await db
            .select('*')
            .from("SEproject.suppliers")
            .whereIn('supplier_id', supplieridArray);

            //const caregoryidArray = equipmentdetails.map(detail => detail.category_id);
            const categoryidArray=[];
            for(let category of equipmentdetails ){
                //console.log("category_id: ",category.category_id);
                categoryidArray.push(category.category_id) ;
            }

            const categories= await db
            .select('*')
            .from("SEproject.categories")
            .whereIn('category_id', categoryidArray);

            // Combine all details into the desired structure
            const ordersWithDetails = OrderIds.map(order => {
                const items = orderdetails
                    .filter(detail => detail.order_id === order.order_id) // Match order_id
                    .map(detail => {
                        const equipment = equipmentdetails.find(equip => equip.equipment_id === detail.equipment_id);
                        const supplier = suppliers.find(supp => supp.supplier_id === equipment.supplier_id);
                        const category = categories.find(cat => cat.category_id === equipment.category_id);

                        return {
                            equipment_id:  equipment ? equipment.equipment_id : "unnowm", 
                            equipment_name: equipment ? equipment.equipment_name : "unnown",
                            model_number: equipment ? equipment.model_number : "Unknown",
                            supplier_name: supplier ? supplier.supplier_name : "Unknown",
                            category_name: category ? category.category_name : "Unknown",
                            quantity: detail.quantity
                        };
                    });

                return {
                    order_id: order.order_id,
                    date: order.date,
                    items: items
                };
            });

            /*console.log("Orders With Details:", ordersWithDetails);
            console.log("items: ",ordersWithDetails[0].items[1] );*/
            
            return res.render('orders', { ordersAllDetails: ordersWithDetails});
            }

            catch(error){

                console.log("Couldn't get equipment info:", error.message);
                return res.status(500).send("Failed to get orders info");
                }
            }
            else {
                return res.status(403).send("Access denied. Only standard users can access the equipments page.");
                }

}
    )
}

module.exports = {handlePrivateFrontEndView};