var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
 
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  printProducts();
});

function printProducts() {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // instantiate 
	var table = new Table({
	    head: ['ID', 'Product Name', 'Department', 'Price', 'In Stock']
	});
	for(let i = 0; i < res.length; i++){
		// table is an Array, so you can `push`, `unshift`, `splice` and friends 
		table.push(
		    [res[i].item_id, res[i].product_name, res[i].department_name,
		    res[i].price, res[i].stock_quantity])	
	}    // Log all results of the SELECT statement
    console.log(table.toString());
    // connection.end();
    promptUser();
  });
}

function promptUser() {
	var questions = [
	  {
	    type: 'input',
	    name: 'idcheck',
	    message: "What is the ID number of the product you would like to order?"
	  },
	  {
	    type: 'input',
	    name: 'quantity',
	    message: "How many of this item would you like to order?",
	  }
	];

	inquirer.prompt(questions).then(answers => {
	  // console.log(JSON.stringify(answers, null, '  '));
	  var id = answers.idcheck;
	  var quantity = answers.quantity;
	  // console.log(id, quantity);
	  connection.query("SELECT * FROM products WHERE ?", { item_id: id }, function(err, res) {
	  	var newStockQuantity = res[0].stock_quantity - quantity;
	  	// console.log(res[0].stock_quantity);
	  	if(quantity > res[0].stock_quantity){
	  		console.log("Sorry! Not enough product in stock to meet order request.");
	  		promptUser();
	  	} else{
	  	var total = quantity * res[0].price;
	  	updateProduct(id, newStockQuantity)
	  	console.log("Your total is: $" + total);	  	

	  }
	});
})

}

function updateProduct(id, newStockQuantity) {
  console.log("Updating Products.....");
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: newStockQuantity
      },
      {
        item_id: id
      }
    ],
    function(err, res) {
      newOrder();
      // Call deleteProduct AFTER the UPDATE completes
      // end.connection();
    });
  };

function newOrder() {
	inquirer.prompt([
	{
		type: "confirm",
		message: "Would you like to place another order?",
		name: "shop"
	}
	]).then(answers => {
		if(answers.shop) {
			printProducts();
		} else {
			console.log("Thank you for shopping with Bamazon!");
			connection.end();
		}
	})
}








