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


connectionRequestSchema.index({fromUserId:1,toUserId:1},  { unique: true })
//it we get called pre save mean save is kind of event before saveing it will get called

connectionRequestSchema.pre("save", async  function () {
  if (this.fromUserId.equals(this.toUserId)) {
    const err = new mongoose.Error.ValidationError(this);
    err.addError(
      "fromUserId",
      new mongoose.Error.ValidatorError({
        message: "You cannot send connection request to yourself.",
      })
    );
    return next(err);
  }

  // next();
});

//for manage massive data we need indexing in data base and it will use full to maange queery and operation like findOne 
//it help for make queery like searching , finding and delteiing operation
//always use indexing on unquie and if u add a unquie on any field mongo db add indexing on it automatically 
//there are three type of index ,unique indexing, spare ,compond indexing.
const ConnectionRequestModel = new mongoose.model("ConnectionRequest",connectionRequestSchema)

module.exports = ConnectionRequestModel
