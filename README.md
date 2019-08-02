# bamazon


## ISSUES
There is a problem when reporting the invalid product id applied when performing a purchase. The code works but the display doesn't allow a new valid value to be entered.


## NOTES
If the error "ER_NOT_SUPPORTED_AUTH_MODE" occures run this in mySQL workbench:
    ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'mooselips123'

    ...as seen here (credit to stackoverflow):
        https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server

Copy-paste to get git bash to the local folder:
    cd  C:/data/Dropbox/Work/bootcamp/Homework/bamazon 
