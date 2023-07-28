var express=require('express')
var app=express()
var ejs=require('ejs')
app.set('view engine','ejs')
var mongodb=require('mongodb')
var url="mongodb://127.0.0.1:27017"
var MongoClient=mongodb.MongoClient
var bodyparser=require('body-parser')
 app.use(bodyparser.urlencoded({extended:true}))

app.use(express.json())
port=4444

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });


async function connect()
{
    var db=await MongoClient.connect(url)
    return db.db('productDB')
}
app.get('/', async (req, res) => {
    var dbo= await connect()
    const products = await dbo.collection('products').find({}).toArray();
    res.render('index', { products });
  });

app.get('/add', async function(req,res){
    res.render("add"); 
})
app.post('/add', async function(req,res){
    var name=req.body.name
    var price=req.body.price
    
    var values={
        name:name,
        price:price,
        

    }
    var dbo= await connect()
    var data=await dbo.collection('products').insertOne(values)
    res.redirect('/');  

})


app.get('/edit/:id', async (req, res) => {
    const productId = req.params.id;
    var dbo= await connect()
    const { ObjectId } = require('mongodb');
    const product = await dbo.collection('products').findOne({ _id: new ObjectId(productId) });

    res.render('edit', { product });
  });

  app.post('/edit/:id', async (req, res) => {
    const productId = req.params.id;
    const updatedProduct = req.body;
    const { ObjectId } = require('mongodb');
    var dbo= await connect()
   
   await dbo.collection('products').updateOne(
      { _id: new ObjectId(productId) },
      { $set: updatedProduct }
    );
    res.redirect('/');
  });

//////////////////////////////////////////////////////

app.get('/delete/:id', async (req, res) => {
    const productId = req.params.id;
    const db = await MongoClient.connect(url);
  
    try {
      const dbo = db.db('productDB');
      const ObjectId = mongodb.ObjectId; 
      await dbo.collection('products').deleteOne({ _id: new ObjectId(productId) });
  
      res.redirect('/');
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).send('Error deleting product.');
    } finally {
      db.close();
    }
  });
















