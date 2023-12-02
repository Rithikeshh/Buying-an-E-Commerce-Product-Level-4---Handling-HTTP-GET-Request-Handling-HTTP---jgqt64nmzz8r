const fs = require('fs');
const express = require('express');
const app = express();


// Importing products from products.json file
const products = JSON.parse(
    fs.readFileSync(`${__dirname}/data/product.json`)
);


// Middlewares
app.use(express.json());

// Write PATCH endpoint to buy a product for the client here
// Endpoint /api/v1/products/:id
app.patch('/api/v1/products/:id', (req, res) => {
    const {id} = req.params;
    const searchedProduct = products.find((product)=>{
        return product.id === parseInt(id);
    })
    if(searchedProduct){
        if(searchedProduct.quantity > 0){
            const index = products.indexOf(searchedProduct);
            products[index] = {...products[index], quantity: searchedProduct.quantity-1}
            fs.writeFile(
                `${__dirname}/data/product.json`,
                JSON.stringify(products),
                (err)=>{
                    res.status(200).send({
                        "status": "success",
                        "message": `Thank you for purchasing ${searchedProduct.name}`,
                        "product": products[index]
                    })
                }
            )
        }
        else{
            res.status(404).send({
                "status": "success",
                "message": "Impact , Out of stock!"
            })
        }
    } 
    else{
        res.status(404).send({
            "status": "failed",
            "message": "Product not found!"
        })
    }
})




module.exports = app;
