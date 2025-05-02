const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    personal_shopping_bag :{
        type: Array,
        required : false
    }
});
module.exports = mongoose.model('User_information',userSchema);