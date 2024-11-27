const express = require ('express');

const app = express();

app.get('/', (req, res)=>
{
    res.send('A simple Node App is running on this surver')
    res.end();
})

const PORT = process.env.PORT|| 5000;
app.listen(PORT, console.log(`server sterted on port ${PORT}`))
