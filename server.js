const express = require ('express');
const app = express();
const bodyParser = require("body-parser");
const {handleAdminBackendApi}= require('./routes/private/AdminAPI');
const {HandlePublicBackendApi}= require('./routes/public/API');
const {handleStandardUserBackendApi}= require('./routes/private/UserAPI');
const {authMiddleware, AuthorizedAdmin, AuthorizedStandardUser}= require('./middleware/auth.js');

//app.use(Authenticate);
app.use(bodyParser.json());

HandlePublicBackendApi(app);

app.use(authMiddleware);
handleAdminBackendApi(app);
handleStandardUserBackendApi(app);

app.get('/', (req, res)=>
{
    res.send('A simple Node App is running on this server')
    res.end();
})

const PORT = process.env.PORT|| 5000;
app.listen(PORT, console.log(`server sterted on port ${PORT} on http://localhost:5000/`))
