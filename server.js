/**
 * Importe Express Module
 */
const express = require('express');
/**
 * Importe Body Parser Module
 * for get data in request body
 */
var bodyParser = require('body-parser');
/**
 * Created Object of the express 
 * & using constant variable
 */
const app = express();
/**
 * Today Date
 */
var today = new Date();
/**
 * Settingup Port
 */
const port = 6500;
/**
 * For data base Connection i am usining this file 
 * This file located in inside helper
 * its connected to mysql server
 */
require('./helper/dbconnect.js');
/**
 * Body data converted to Json Format
 */
app.use(bodyParser.json());
let message = "";
let status = false;
let data = {};
/** 
 * Assignment 1
 * @name
 * @mobile_num
 * @user_role
 * @email_id
 * API :name->/registerUser
 * Method:->POST()
 */
app.post(['/registerUser'], function (req, res) {
    /**
     * for input validation i am using this file and import to here
     * if all inputs are correct it will return True else false
     * and sending response
     */
    const user_validation = require('./helper/user_validation.js')(req, res);
    if (user_validation == true) {
        /**
         * Validation sql Query
         * checking the user role while creating the new user
         */
        let sql_validation = "SELECT * FROM user_role where user_role='" + req.body.user_role + "' AND user_role='admin'";
        /**
         * con is the sql connection i am taking as global variable 
         * it's located inside helper/dbconnect.js
         */
        con.query(sql_validation, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                if (result.length > 0) {
                    message = "The User Role already Exist";
                    status = false;
                    data = {
                        status: status,
                        message: message
                    }
                    res.json(data);
                } else {
                    /**
                     * This the Json array data i am creating for insertion
                     */
                    var insert_data = {
                        "name": req.body.name,
                        "email": req.body.email_id,
                        "mobile_num": req.body.mobile_num,
                        "created_on": today
                    }
                    let insert_sql = "INSERT INTO user SET ?";
                    con.query(insert_sql, insert_data, function (err, result) {
                        if (err) {
                            console.log(err);
                        } else {
                            /**
                             * After Insertion Done need to take the inserted id for to create a new role in user role table
                             * and sending json response
                             */
                            let user_id = result.insertId
                            /**
                             * Create new Role method initiating
                             */
                            createRole(req, res, user_id);
                            message = "New user Created Successfully";
                            status = true;
                            data = {
                                status: status,
                                message: message
                            }
                            res.json(data);
                        }
                    });
                    /**
                     * createRole Method Action
                     * @user_id 
                     */
                    function createRole(req, res, user_id) {
                        console.log("enter");
                        let user_role = {
                            "user_id": user_id,
                            "user_role": req.body.user_role,
                            "created_on": today
                        }
                        /**
                         * Inser Query for user_role
                         */
                        let sel_inser = "INSERT INTO user_role SET ?";
                        con.query(sel_inser, user_role, function (err, result) {
                            if (err) {
                                return false;
                            } else {
                                return true;
                            }
                        })
                    }
                }
            }
        })
    } else {
        /**
         * While Creating New User the required field are not there it's sending response 
         */
        message = "Please Send Required Field";
        status = false;
        data = {
            status: status,
            message: message
        }
        res.json(data);
    }
});
/*<!-------------------------- Assignment 1 END---------------------------------------------------- >*/
/**
 * Assignment 2
 * @id
 * id as categorie id 
 * API :name->/deleteProduct
 * Method:->DELETE()
 */
app.delete(['/deleteProduct'], function (req, res) {
    let get_product = "SELECT * FROM products where categorie_id='" + req.body.id + "'";
    con.query(get_product, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            /**
             * Deleting Products list sending Here
             * after calling deletProduct method
             */
            if (result.length > 0) {
                deleteProduct(req, res);
                message = "These Are All the Deleted records";
                status = true;
                data = {
                    status: status,
                    message: message,
                    data: result
                }
                res.json(data);
            } else {
                message = "There is no Records";
                status = false;
                data = {
                    status: status,
                    message: message,
                    data: result
                }
                res.json(data);
            }
        }
    })
    /**
     * deleteProduct
     * @id
     * id as categorie_id
     */
    function deleteProduct(req, res) {
        let delete_sql = "DELETE FROM products WHERE categorie_id='" + req.body.id + "'";
        console.log(delete_sql);
        con.query(delete_sql, function (err, result) {
            if (err) {
                return false;
            } else {
                return true;
            }
        })
    }
})
/*<!-------------------------- Assignment 2 END---------------------------------------------------- >*/
/**
 * Assignment 3
 * for all product under each categories
 * API :name->/getProducts
 * Method:->GET()
 */
app.get(['/getProducts'], function (req, res) {
    /**
     * Joining Category and Product table 
     */
    let select_sql = "SELECT c.id as categorie_id, c.category_name, p.id as product_id, p.product_name from categories as c LEFT JOIN products as p on p.categorie_id = c.id";
    console.log(select_sql);
    con.query(select_sql, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            /**
             * if the record Exist sending Json data
             */
            if (result.length > 0) {
                message = "These Are All The Products belongs to the categories !";
                status = true;
                data = {
                    status: status,
                    message: message,
                    data: result
                }
                res.json(data);
            } else {
                /**
                * if the record doesnot Exist sending Json data
                */
                message = "These is no Records Found!";
                status = false;
                data = {
                    status: status,
                    message: message,
                    data: result
                }
                res.json(data);
            }
        }
    })
});
/**
 * Creating HTTP server Object
 */
app.listen(port, () => {
    console.log("The Node Server Running On port " + port);
})
module.exports = app;