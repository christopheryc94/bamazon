# bamazon

This application will read data from a database hosted by mySQL PRO.
When application is started through Node, a table will be printed in bash to show
the customer all the items available.
Within this table will list the id of the product, name of the product, department the product is in, price of the product, and available stock.

Then user will be prompted (by inquirer) on which product id they would like to purchase and then the quantity. 
If customer requests more stock than is available, the order will not process and let the customer know that there 
is not enough product to fulfill that order request. 
If there is enough stock for the order request, a function will run to process the order giving the customer their total and 
update the available stock in the database. 

After every order the customer will be asked if they would wish to continue to shop or exit out of the application. 

Video walkthrough to show the application works! https://youtu.be/ASZHfIgT-DI