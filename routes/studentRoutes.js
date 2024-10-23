const express = require('express');
const {createStudent,createDormitoryAndBed,getAllStudents,getStudentById,getStudentsByDormitory,updateStudent,deleteStudent,getAllDormitoriesWithBeds} = require('../controllers/studentController');

const router = express.Router();


router.post('/students', createStudent);
router.post('/dormitories', createDormitoryAndBed);
router.get('/students/:uuid', getStudentById);
router.patch('/students/:uuid', updateStudent);
router.delete('/students/:uuid', deleteStudent);
router.get('/students', getAllStudents);
router.get('/dormitories', getAllDormitoriesWithBeds);
router.get('/students/dormitory/:dormitoryId',getStudentsByDormitory);

module.exports = router;
