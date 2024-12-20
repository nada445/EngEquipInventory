const express = require ('express');
const app = express();
const bodyParser = require("body-parser");
const {handleAdminBackendApi}= require('./routes/private/AdminAPI');
const {HandlePublicBackendApi}= require('./routes/public/API');
const {handleStandardUserBackendApi}= require('./routes/private/UserAPI');
const {authMiddleware, AuthorizedAdmin, AuthorizedStandardUser}= require('./middleware/auth.js');
const {handlePublicFrontEndView} = require('./routes/public/view');
const {handlePrivateFrontEndView} = require('./routes/private/view');

//app.use(Authenticate);

app.set('views', './views');
app.set('view engine', 'hjs');
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


handlePublicFrontEndView(app);
HandlePublicBackendApi(app);

app.use(authMiddleware);
handlePrivateFrontEndView(app);
handleAdminBackendApi(app);
handleStandardUserBackendApi(app);

app.get('/', (req, res)=>
{
    res.send('A simple Node App is running on this server')
    res.end();
})

const PORT = process.env.PORT|| 5000;
app.listen(PORT, console.log(`server sterted on port ${PORT}`))
