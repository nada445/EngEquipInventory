const db = require('../../connectors/db');

const {authMiddleware, AuthorizedStandardUser} = require('../../middleware/auth'); 
const { getSessionToken, getUser} = require('../../utils/session'); 
function handleStandardUserBackendApi(app) {

      app.get('/api/v1/equipment/view' ,async(req,res) => {
        UserID= getUser().userId;
        

        try{
          const result = await db.raw(`SELECT equipment.*, categories.category_name, suppliers.supplier_name FROM "SEproject".equipment 
            JOIN categories ON equipment.category_id = categories.category_id 
            JOIN suppliers ON equipment.supplier_id = suppliers.supplier_id;`
          );
          console.log(`Results`,result.rows);
          return res.status(200).send(result.rows);
        }catch(err){
          console.log("Error",err.message);
          return res.status(400).send(err.message);
        }
      })
    
}
module.exports = {handleStandardUserBackendApi};
