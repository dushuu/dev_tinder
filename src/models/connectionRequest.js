const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema({
  //formUserID is senderId
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required:true
  },
  //recever userId
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required:true
  },
  status: {
    type: String,
    enum: {
      values: ["ignore", "interested", "accepted", "rejected"],
      message:`{value} is not supported`
    },
    required:true
  },
},
{ timestamps: true }
);

const ConnectionRequestModel = new mongoose.model("ConnectionRequest",connectionRequestSchema)

module.exports = ConnectionRequestModel
