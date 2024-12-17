const db = require('../../connectors/db');
const { getSessionToken , getUser } = require('../../utils/session');

function handlePrivateFrontEndView(app) {

    app.get('/dashboard' , async (req , res) => {
        
        const user = await getUser(req);
        console.log('user info' , user)
        if(user.role == "admin" ){
            return res.render('admins', {name : user.username});
        }

        if(user.role == "standard_user" ){
            return res.render('users', {name : user.username});
        }
    });

    app.get('/cart', async(req, res)=>{

        const user= await getUser(req);
        console.log('user info' , user);
        if(user.role == "standard_user"){
            try{

                const cartitems= await db.select('*').from("public.cart").where('user_id', user.user_id);
                const equipmentinfo= await db.select().from("");
                return res.render('cart', {cartitems: cartitems});
            }
            catch(error){

                console.log("couldn't get items from the cart", err.message);
                return res.status(500).send("Failed to get cart items");
            }
        }
    }
)
}

module.exports = {handlePrivateFrontEndView};
