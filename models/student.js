const mongoose = require('./db');

const now = new Date();
const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

const { ObjectId } = mongoose.Types;

const studentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  subjects: {
    type: [String],
    required: true,
  },
  class: { type: ObjectId, ref: 'class', required: true },

  society: {
    type: [{ type: ObjectId, ref: 'society' }],
    required: false,
  },
  year: {
    type: Number,
    required: true,
  },

},
{ timestamps: true });

const classSchema = mongoose.Schema({
  name: { type: String },
});

const societySchema = mongoose.Schema({
  name: { type: String },
});

const ClassModel = mongoose.model('class', classSchema);
const StudentModel = mongoose.model('student', studentSchema);
const SocietyModel = mongoose.model('society', societySchema);

async function addStudent(student) {
  const Student = new StudentModel(student);
  const ClasseNames = await ClassModel.find();
  const societyNames = await SocietyModel.find();
  const className = ClasseNames.find((e) => e.name === student.class);
  Student.society = [];
  student.society.forEach((e) => {
    const i = societyNames.findIndex((f) => e === f.name);
    if (i === -1) {
      const society = SocietyModel({ name: e }).save();
      Student.society.push(ObjectId(society.id));
    } else {
      Student.society.push(ObjectId(societyNames[i].id));
    }
  });
  if (!className) throw new Error('Invalid Class');
  Student.class = mongoose.Types.ObjectId(className.id);
  const result = await Student.save();
  console.log(result);
  return result;
}

async function getStudent(id) {
  const student = await StudentModel
    .findById(id)
    .populate({ path: 'class', select: 'name -_id' })
    .populate({ path: 'society', select: 'name -_id' });
  console.log(student);
}

async function userRegToday(className = 'science', society = 'theatre') {
  const classId = await ClassModel.findOne({ name: className });
  const societyId = await SocietyModel.findOne({ name: society });
  const result = await StudentModel.aggregate([{
    $match: {
      class: ObjectId(classId.id),
      society: ObjectId(societyId.id),
      createdAt: {
        $gte: startOfToday,
      },
    },
  },
  // {
  //   $lookup: {
  //     from: 'classes',
  //     localField: 'class',
  //     foreignField: '_id',
  //     as: 'class',
  //   },
  // },
  // { $unwind: '$class' },
  ]).count('name').exec();
  const num = result[0].name;
  return num;
}

async function studentAbove15(society = 'swimming', className = ['arts', 'science']) {
  let classId = await ClassModel.find({
    name: {
      $in: className,
    },
  });
  let societyId = await SocietyModel.findOne({ name: society });
  societyId = societyId.id;
  classId = classId.map((e) => ObjectId(e.id));
  const result = await StudentModel.aggregate([{
    $match: {
      class: {
        $in: classId,
      },
      society: ObjectId(societyId),
      year: {
        $gte: 15,
      },
    },
  },
  {
    $project: {
      society: 0,
      _id: 0,
    },
  },
  {
    $lookup: {
      from: 'classes',
      localField: 'class',
      foreignField: '_id',
      as: 'class',
    },
  },
  { $unwind: '$class' },
  ]).exec();
  return result;
}

// addStudent({
//   name: 'rock',
//   contact: '90777',
//   society: ['theatre', 'cycling'],
//   year: 14,
//   subjects: ['xyz', 'yzx'],
//   class: 'science',
// });

// userRegToday();

// studentAbove15();

module.exports = {
  addStudent, userRegToday, studentAbove15,
};
