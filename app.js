const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const fs = require("fs");

// connect to mongoDB
mongoose
  .connect("mongodb://localhost:27017/exampledb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDb"))
  .catch((err) => {
    console.log("Connected fail");
    console.err(err);
  });

app.use(express.static("public"));

// define a schema
/* vaildation(for insert, update needs another parameter to control) example => 
 name: {
     type: String,
     required: [true, "error message"]
 }
 scholarShip: {
    merit: {
       type: Number,
       default: 0
    },
    other: {
       type: Number,
       required : function(){
           return expression
       }
    },
  }
*/
const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  major: String,
  scholarShip: {
    merit: Number,
    other: Number,
  },
});

//** middleware belongs to schema
studentSchema.pre("save", async function () {
  fs.appendFile("record.txt", "\nsuccessz save!!!", (e) => {
    if (e) throw e;
  });
});

// create instance method belongs schema
// import points => () arrow function defines, function scope "this"  represent window object
studentSchema.methods.getTotalScholarPrize = function () {
  return this.scholarShip.merit + this.scholarShip.other;
};

//create static method belongs model
studentSchema.statics.setOtherToZero = function () {
  return this.update({}, { "scholarShip.other": 0 });
};

// create a model for student
const Student = mongoose.model("Student", studentSchema);

// Student.setOtherToZero()
//   .then(() => {
//     console.log("set success");
//   })
//   .catch((err) => {
//     console.error(err);
//   });

// **modal relative API reference => https://mongoosejs.com/docs/api/model.html#model_Model.find
// **model.find()  => always return an array
// Student.find({ "scholarShip.merit": { $gte: 1200 } }).then((data) => {
//   console.log(data);
// });
// **model.findOne()  => always return an object
// Student.find().then((data) => {
//   console.log(data);
// });

// **model.updateOne()
// Student.updateOne({ name: "Jason Wu" }, { name: "Jason Wen" }).then((meg) => {
//   console.log(meg);
// });
// **model.findOneAndUpdate()
// Student.findOneAndUpdate(
//   { name: "Jason Wen" },
//   { name: "Jason Chiang" },
//   { new: true }
// ).then((meg) => {
//   console.log(meg);
// });

//**creaue a object
const Jason = new Student({
  name: "Jack",
  age: 27,
  major: "EOE",
  scholarShip: {
    merit: 1100,
    other: 3400,
  },
});

//**save Jason to DB
Jason.save()
  .then(() => {
    console.log("Jason has been saved.");
  })
  .catch((err) => {
    console.log("save error!");
    console.error(err);
  });

// Student.find({  })
//   .then((data) => {
//     data.forEach(student =>{})
//     let result = data.getTotalScholarPrize();
//     console.log(result);
//   })
//   .catch((err) => {
//     console.log("error!!!");
//     console.error(err);
//   });

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.listen("3000", () => {
  console.log("running at server 3000.");
});
