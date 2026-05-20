require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

const User = require('../models/User');
const Class = require('../models/Class');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const Notice = require('../models/Notice');
const Exam = require('../models/Exam');
const Fee = require('../models/Fee');

const seed = async () => {
  try {
    await connectDB();
    console.log('🌱 Seeding database...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Class.deleteMany({}),
      Teacher.deleteMany({}),
      Student.deleteMany({}),
      Subject.deleteMany({}),
      Notice.deleteMany({}),
      Exam.deleteMany({}),
      Fee.deleteMany({})
    ]);

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@school.com',
      password: 'admin123',
      role: 'admin',
      phone: '9876543210'
    });
    console.log('✅ Admin created: admin@school.com / admin123');

    // Create classes
    const classData = [
      { name: 'Class 1', section: 'A', capacity: 40, room: 'R101' },
      { name: 'Class 1', section: 'B', capacity: 40, room: 'R102' },
      { name: 'Class 2', section: 'A', capacity: 35, room: 'R201' },
      { name: 'Class 3', section: 'A', capacity: 35, room: 'R301' },
      { name: 'Class 4', section: 'A', capacity: 30, room: 'R401' },
      { name: 'Class 5', section: 'A', capacity: 30, room: 'R501' },
      { name: 'Class 6', section: 'A', capacity: 40, room: 'R601' },
      { name: 'Class 7', section: 'A', capacity: 40, room: 'R701' },
      { name: 'Class 8', section: 'A', capacity: 35, room: 'R801' },
      { name: 'Class 9', section: 'A', capacity: 35, room: 'R901' },
      { name: 'Class 10', section: 'A', capacity: 35, room: 'R1001' },
    ];
    const classes = await Class.insertMany(classData);
    console.log(`✅ ${classes.length} classes created`);

    // Create teachers
    const teacherData = [
      { firstName: 'Rajesh', lastName: 'Kumar', email: 'rajesh@school.com', phone: '9876543211', gender: 'Male', qualification: 'M.Sc Mathematics', experience: 8, salary: 45000, classTeacher: classes[0]._id },
      { firstName: 'Priya', lastName: 'Sharma', email: 'priya@school.com', phone: '9876543212', gender: 'Female', qualification: 'M.A English', experience: 5, salary: 40000, classTeacher: classes[1]._id },
      { firstName: 'Amit', lastName: 'Verma', email: 'amit@school.com', phone: '9876543213', gender: 'Male', qualification: 'M.Sc Physics', experience: 10, salary: 50000, classTeacher: classes[2]._id },
      { firstName: 'Sunita', lastName: 'Patel', email: 'sunita@school.com', phone: '9876543214', gender: 'Female', qualification: 'M.Sc Chemistry', experience: 7, salary: 42000 },
      { firstName: 'Vikram', lastName: 'Singh', email: 'vikram@school.com', phone: '9876543215', gender: 'Male', qualification: 'M.A Hindi', experience: 12, salary: 48000 },
      { firstName: 'Neha', lastName: 'Gupta', email: 'neha@school.com', phone: '9876543216', gender: 'Female', qualification: 'M.Sc Biology', experience: 6, salary: 41000 },
    ];
    const teachers = await Teacher.insertMany(teacherData.map((t, idx) => ({ ...t, teacherId: `TCH${String(idx + 1).padStart(5, '0')}` })));
    console.log(`✅ ${teachers.length} teachers created`);

    // Create students
    const firstNames = ['Arjun', 'Riya', 'Karan', 'Ananya', 'Rohit', 'Sneha', 'Dev', 'Pooja', 'Aakash', 'Meera', 'Vikas', 'Simran', 'Rahul', 'Nisha', 'Siddharth', 'Kavya', 'Manish', 'Divya', 'Suresh', 'Tanvi'];
    const lastNames = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Verma', 'Jain', 'Agarwal', 'Yadav', 'Reddy'];
    const studentData = [];

    for (let i = 0; i < 40; i++) {
      const classIdx = i % classes.length;
      studentData.push({
        studentId: `STU${String(i + 1).padStart(5, '0')}`,
        firstName: firstNames[i % firstNames.length],
        lastName: lastNames[i % lastNames.length],
        email: `student${i + 1}@school.com`,
        phone: `98765${String(43220 + i).padStart(5, '0')}`,
        dateOfBirth: new Date(2010 - classIdx, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        gender: i % 3 === 0 ? 'Female' : 'Male',
        class: classes[classIdx]._id,
        section: classes[classIdx].section,
        rollNumber: String(Math.floor(i / classes.length) + 1),
        bloodGroup: ['A+', 'B+', 'O+', 'AB+'][i % 4],
        parentInfo: {
          fatherName: `Mr. ${lastNames[(i + 1) % lastNames.length]}`,
          motherName: `Mrs. ${lastNames[(i + 2) % lastNames.length]}`,
          guardianPhone: `98765${String(53220 + i).padStart(5, '0')}`
        },
        address: { street: `${i + 1} Main Road`, city: 'Mumbai', state: 'Maharashtra', zipCode: '400001' }
      });
    }
    const students = await Student.insertMany(studentData);
    console.log(`✅ ${students.length} students created`);

    // Create subjects
    const subjectData = [];
    const subjectNames = [
      { name: 'Mathematics', code: 'MATH' },
      { name: 'English', code: 'ENG' },
      { name: 'Science', code: 'SCI' },
      { name: 'Hindi', code: 'HIN' },
      { name: 'Social Studies', code: 'SST' },
      { name: 'Computer Science', code: 'CS' }
    ];
    for (let c = 0; c < Math.min(5, classes.length); c++) {
      subjectNames.forEach((subj, idx) => {
        subjectData.push({
          ...subj,
          code: `${subj.code}${c + 1}`,
          class: classes[c]._id,
          teacher: teachers[idx % teachers.length]._id,
          totalMarks: 100,
          passingMarks: 35
        });
      });
    }
    const subjects = await Subject.insertMany(subjectData);
    console.log(`✅ ${subjects.length} subjects created`);

    // Create notices
    const notices = await Notice.insertMany([
      { title: 'Welcome to New Academic Year 2025-2026', description: 'We are excited to welcome all students and staff to the new academic year. Please check the updated schedule.', category: 'Academic', priority: 'high', audience: 'all', postedBy: admin._id },
      { title: 'Annual Day Celebration', description: 'Annual day will be celebrated on 20th December. All students must participate in at least one cultural activity.', category: 'Event', priority: 'medium', audience: 'all', postedBy: admin._id },
      { title: 'Parent-Teacher Meeting', description: 'PTM scheduled for 15th November. Parents are requested to attend.', category: 'General', priority: 'high', audience: 'parents', postedBy: admin._id },
      { title: 'Mid-Term Exam Schedule', description: 'Mid-term exams start from 1st October. Detailed schedule attached.', category: 'Exam', priority: 'urgent', audience: 'all', postedBy: admin._id },
      { title: 'Sports Day Announcement', description: 'Annual sports day on 25th January. Practice sessions begin next week.', category: 'Sports', priority: 'medium', audience: 'students', postedBy: admin._id }
    ]);
    console.log(`✅ ${notices.length} notices created`);

    // Create exams
    const exams = await Exam.insertMany([
      { name: 'Unit Test 1', type: 'Unit Test', class: classes[0]._id, subject: subjects[0]._id, date: new Date('2025-08-15'), totalMarks: 50, passingMarks: 18, status: 'completed' },
      { name: 'Mid Term Exam', type: 'Mid Term', class: classes[0]._id, subject: subjects[0]._id, date: new Date('2025-10-01'), totalMarks: 100, passingMarks: 35, status: 'scheduled' },
      { name: 'Final Exam', type: 'Final', class: classes[0]._id, subject: subjects[0]._id, date: new Date('2026-03-15'), totalMarks: 100, passingMarks: 35, status: 'scheduled' },
    ]);
    console.log(`✅ ${exams.length} exams created`);

    // Create fees
    const feeData = [];
    const months = ['January', 'February', 'March', 'April', 'May'];
    students.slice(0, 20).forEach((student, idx) => {
      months.forEach((month, mIdx) => {
        feeData.push({
          student: student._id,
          feeType: 'Tuition',
          amount: 5000,
          discount: idx % 5 === 0 ? 500 : 0,
          fine: 0,
          month,
          dueDate: new Date(2025, mIdx, 15),
          status: mIdx < 3 ? 'paid' : 'unpaid',
          paidAmount: mIdx < 3 ? 5000 - (idx % 5 === 0 ? 500 : 0) : 0,
          paidDate: mIdx < 3 ? new Date(2025, mIdx, 10) : null,
          paymentMethod: mIdx < 3 ? 'upi' : ''
        });
      });
    });
    const fees = await Fee.insertMany(feeData);
    console.log(`✅ ${fees.length} fee records created`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('📧 Login: admin@school.com');
    console.log('🔑 Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
