const db = require('../DataBase/db');

const { Authenticate, AuthorizedStandardUser, GetUser } = require('../middleware/auth'); 

function handleStandardUserBackendApi(app) {

    app.post('/api/v1/rating/new', Authenticate, AuthorizedStandardUser, GetUser, async(req,res) => {

        

    }
    )


    app.post('/api/v1/cart/new', Authenticate, AuthorizedStandardUser, GetUser, async(req,res) => {

        

    }
    )

    app.delete('/api/v1/cart/delete/:cartId', Authenticate, AuthorizedStandardUser, GetUser, async(req,res) => {

        

    }
    )

    app.post('/api/v1/order/new', Authenticate, AuthorizedStandardUser, GetUser, async(req,res) => {

        

    }
    )
}