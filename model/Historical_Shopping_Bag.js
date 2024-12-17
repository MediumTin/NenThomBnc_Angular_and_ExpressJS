const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistoricalShoppingBagSchema = new Schema({
    Username : {
        type: String,
        required: true
    },
    Email : {
        type: String,
        required: true
    },
    Visa_number : {
        type: String,
        required: true
    },
    Visa_valid_date : {
        type: String,
        required: true
    },
    Visa_cvv : {
        type: String,
        required: true
    },
    Nation_buyer : {
        type: String,
        required: true
    },
    Nation_zip_buyer : {
        type: String,
        required: true
    },
    Nation_state_buyer : {
        type: String,
        required: true
    },
    VAT_number_buyer : {
        type: String,
        required: true
    },
    Total_Price_Before_VAT : {
        type: String,
        required: true
    },
    Total_VAT : {
        type: String,
        required: true
    },
    Total_Price_After_VAT : {
        type: String,
        required: true
    },
    Selected_List :{
        type: Array,
        required : false
    }
});
module.exports = mongoose.model('HistoricalBag',HistoricalShoppingBagSchema);