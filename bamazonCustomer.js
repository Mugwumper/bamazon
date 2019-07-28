var mysql = require("mysql");
var inquirer = require("inquirer");
var g_item_id_low = 0;
var g_item_id_high = 0;

//  cd  C:/data/Dropbox/Work/bootcamp/Homework/bamazon 

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "mooselips123",
    database: "bamazon"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    prompt_main();
  });

  var log = console.log;
  
  function prompt_first() {
    log("Welcome to Bamazon");
    log(" * * suggested that you widen your git bash window to allow each row to display on a single line. *  * ");
    listProducts();
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
          //purchasePrompt();
          break;
  
        case "exit":
          connection.end();
          break;
        }
      });
  }

  // item_id INT NOT NULL AUTO_INCREMENT,
  // product_name VARCHAR(45) NULL,
  // department_name VARCHAR(12) NULL,
  // price DECIMAL(10,2) NULL,
  // stock_quantity INT NULL,
  
  function listProducts() {
    log('');
    resetGlobalIDs();
    var query = "SELECT * from products";
    connection.query(query, function(err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        log("id: "    + res[i].item_id + 
        " || name: "  + res[i].product_name +
        " || deptt: " + res[i].department_name +
        " || price: " + res[i].price +
        " || qty: "   + res[i].stock_quantity);
        applyIDtoGlobals(res[i].item_id);
      }
    });
    prompt_main();
  }

  function resetGlobalIDs() {
    g_item_id_low = 9999999;
    g_item_id_high = 0;
  }
  function applyIDtoGlobals(id) {
    if (g_item_id_low > id) g_item_id_low = id;
    if (g_item_id_high < id) g_item_id_high = id;
  }

  function prompt_purchase() {
    log('');
    var questions = [
      {
        type: "number",
        name: "item_id",
        message: "Enter 'id' for item you would like to purchase:",
        validate: validateItemId
      },{
        type: "number",
        name: "stock_quantity",
        message: "Quantity:"
      },
    ];
    function validateItemId(item_id){
      //log("item_id:" + item_id + " g_item_id_low:" + g_item_id_low + " g_item_id_high:" + g_item_id_high);
      //return ((item_id >= g_item_id_low) && (item_id <= g_item_id_high));
      if ((item_id >= g_item_id_low) && (item_id <= g_item_id_high)) {
        return true
      } else {
        return "Please enter a valid id";
      }
    }; 
    inquirer.prompt(questions, processAnswers);
  }
  function processAnswers(answers){
    log(answers);
    if (purchaseValid(answers.item_id, answers.stock_quantity)) {
    }
  };

  function purchasePrompt(){
    inquirer.prompt([
    {
      name: "ID",
      type: "input",
      message:"Please enter Item ID you like to purhcase.",
      filter:Number
    },
    {
      name:"Quantity",
      type:"input",
      message:"How many items do you wish to purchase?",
      filter:Number
    },
  
   ]).then(function(answers){
     var quantityNeeded = answers.Quantity;
     var IDrequested = answers.ID;
     purchaseOrder(IDrequested, quantityNeeded);
   });
  };

  function purchaseValid(item_id, stock_quantity) {
    var query = "SELECT * from products WHERE item_id = " + item_id ;
    connection.query(query, function(err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        log("id: " + res[i].item_id + 
        " || name: " + res[i].product_name +
        " || deptt: " + res[i].department_name +
        " || price: " + res[i].price +
        " || qty: " + res[i].stock_quantity);
      }
      return (res[i].stock_quantity > stock_quantity);
    });
  }


  function purchaseOrder(ID, amtNeeded){
    connection.query('Select * FROM products WHERE item_id = ' + ID, function(err,res){
      if(err){console.log(err)};
      if(amtNeeded <= res[0].stock_quantity){
        var totalCost = res[0].price * amtNeeded;
        console.log("Good news your order is in stock!");
        console.log("Your total cost for " + amtNeeded + " " +res[0].product_name + " is " + totalCost + " Thank you!");
  
        connection.query("UPDATE products SET stock_quantity = stock_quantity - " + amtNeeded + " WHERE item_id = " + ID);
      } else{
        console.log("Insufficient quantity, sorry we do not have enough " + res[0].product_name + "to complete your order.");
      };
     // prompt_main();
    });
  };
