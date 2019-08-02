
var mysql = require("mysql");
var inquirer = require("inquirer");
var g_item_id_low = 0;
var g_item_id_high = 0;

var log = console.log;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "mooselips123",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id" + connection.threadId);
});

function prompt_first() {
    log("Welcome to Bamazon");
    log(" * * suggested that you widen your git bash window to allow each row to display on a single line. *  * ");
    prompt_main();
}

function prompt_main() {
  log('');
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "List Products",
        "Make a Purchase",
        "exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "List Products":
        listProducts();
        break;

      case "Make a Purchase":
        prompt_purchase();
        break;

      case "exit":
        connection.end();
        break;
      }
    });
}

var listProducts = function () {
  resetGlobalIDs();
  var query = "Select * FROM products";
  connection.query(query, function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      log("id: " + res[i].item_id +
        " || name: " + res[i].product_name +
        " || dept: " + res[i].department_name +
        " || price: " + res[i].price +
        " || qty: " + res[i].stock_quantity);
      applyIDtoGlobals(res[i].item_id);
    }
      prompt_main();
  });
}

function prompt_purchase() {
  inquirer.prompt([
    {
      name: "ID",
      type: "input",
      message: "Enter 'id' for item you would like to purchase:",
      validate: validateItemId,
      filter: Number
    },
    {
      name: "Quantity",
      type: "input",
      message: "Quantity:",
      filter: Number
    },

  ]).then(function (answers) {
    var quantityNeeded = answers.Quantity;
    var IDrequested = answers.ID;
    purchaseOrder(IDrequested, quantityNeeded);
  });
  function validateItemId(item_id){
    //log("item_id:" + item_id + " g_item_id_low:" + g_item_id_low + " g_item_id_high:" + g_item_id_high);
    //return ((item_id >= g_item_id_low) && (item_id <= g_item_id_high));
      if ((item_id >= g_item_id_low) && (item_id <= g_item_id_high)) {
        return true
      } else {
        return "Please enter a valid id";
      }
    }; 
};

function purchaseOrder(ID, Quantity) {
  console.log("");
  connection.query('Select * FROM products WHERE item_id = ' + ID, function (err, res) {
    if (err) { console.log(err) };
    if (Quantity <= res[0].stock_quantity) {
      var totalCost = res[0].price * Quantity;
      console.log("Your total cost for " + Quantity + " " + res[0].product_name + " is $" + totalCost);
      connection.query("UPDATE products SET stock_quantity = stock_quantity - " + Quantity + " WHERE item_id = " + ID);
    } else {
      console.log("Quantity insufficient. There are not enough " + res[0].product_name + "in stock to complete your order.");
    };
    prompt_main();
  });
};

prompt_first();

function resetGlobalIDs() {
  g_item_id_low = 9999999;
  g_item_id_high = 0;
}
function applyIDtoGlobals(id) {
  if (g_item_id_low > id) g_item_id_low = id;
  if (g_item_id_high < id) g_item_id_high = id;
}