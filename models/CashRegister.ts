import mongoose, { model, Schema } from "mongoose";

const cashRegisterSchema = new Schema({
  password: {
    type: String,
    required: true,
  },
  balances: {
    primary: {
      amount: {
        type: Number,
        required: true,
        default: 0,
      },
      currency: {
        type: String,
        required: true,
      },
    },
    secondary: {
      amount: {
        type: Number,
        required: true,
        default: 0,
      },
      currency: {
        type: String,
        required: true,
      },
    },
  },
  exchangeRate: {
    type: Number,
    required: true,
    default: 1,
  },
});

const CashRegister = mongoose.models.CashRegister || model("CashRegister", cashRegisterSchema);
export default CashRegister
