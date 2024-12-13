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
    "SEproject".equipments
JOIN 
    "SEproject".categories 
    ON equipments.category_id = categories.category_id
JOIN 
    "SEproject".suppliers 
    ON equipments.supplier_id = suppliers.supplier_id;
`
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
