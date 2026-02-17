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

const ConnectionRequestModel = new mongoose.model("ConnectionRequest",connectionRequestSchema)

module.exports = ConnectionRequestModel
