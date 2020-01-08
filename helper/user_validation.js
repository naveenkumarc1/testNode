module.exports = validateUser;
/**
 * validation the input data for creation of the  new user
 * @name
 * @mobile_num
 * @email_id
 * @user_role
 */
function validateUser(req, res) {
    if (req.body.name == "" || req.body.name == undefined) {
        return false;
    } else if (req.body.mobile_num == "" || req.body.mobile_num == undefined) {
        return false;
    } else if (req.body.user_role == "" || req.body.user_role == undefined) {
        return false;
    } else if (req.body.email_id == "" || req.body.email_id == undefined) {
        return false;
    } else {
        return true;
    }
}