const db = require('../models');
const { Student, Bed, Dormitory, Sequelize } = db;

// Create and assign a student to a bed in a dormitory
const createStudent = async (req, res) => {
    try {
        const { firstName, lastName, regNo, class: studentClass, bedName, dormitoryName } = req.body;

        // Find the dormitory by name
        let dormitory = await Dormitory.findOne({ where: { name: dormitoryName } });
        if (!dormitory) {
            // If the dormitory doesn't exist, create it
            dormitory = await Dormitory.create({ name: dormitoryName });
        }

        // Find the bed by name and dormitory ID
        let bed = await Bed.findOne({ where: { bedName, dormitoryId: dormitory.id } });

        if (bed) {
            // Check if the bed is already assigned
            if (bed.status === 'assigned') {
                return res.status(400).json({ message: `Bed ${bed.bedName} is already assigned.` });
            }
        } else {
            // If the bed doesn't exist, create it
            bed = await Bed.create({
                bedName,
                dormitoryId: dormitory.id,
                status: 'available',
            });
        }

        // Create the student and assign the bed
        const student = await Student.create({
            firstName,
            lastName,
            regNo,
            class: studentClass,
            bedId: bed.id,
        });

        // Update the bed status to 'assigned'
        await bed.update({ status: 'assigned' });

        res.status(201).json({
            message: `Student assigned to bed ${bed.bedName} in dormitory ${dormitory.name}`,
            student,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createDormitoryAndBed = async (req, res) => {
    try {
        const { dormitoryName, bedName } = req.body;
        console.log(req.body)

        // Check if the dormitory already exists
        let dormitory = await Dormitory.findOne({ where: { name: dormitoryName } });

        if (!dormitory) {
            // If the dormitory does not exist, create it
            dormitory = await Dormitory.create({ name: dormitoryName });
        } else {
            console.log(`Dormitory "${dormitoryName}" already exists.`);
        }

        // Check if the bed already exists in the dormitory
        let bed = await Bed.findOne({ where: { bedName, dormitoryId: dormitory.id } });

        if (!bed) {
            // If the bed does not exist, create it and set status to 'available'
            bed = await Bed.create({
                bedName,
                dormitoryId: dormitory.id,
                status: 'available',
            });
        } else {
            console.log(`Bed "${bedName}" already exists in dormitory "${dormitoryName}".`);
        }

        res.status(201).json({
            message: `Dormitory "${dormitoryName}" and bed "${bedName}" created successfully.`,
            dormitory,
            bed,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Get a student by ID (UUID) with bed and dormitory details
const getStudentById = async (req, res) => {
    try {
        const student = await Student.findOne({
            where: { uuid: req.params.uuid },
            include: {
                model: Bed,
                as: 'bed',
                include: {
                    model: Dormitory,
                    as: 'dormitory',
                },
            },
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update student details
const updateStudent = async (req, res) => {
    try {
        const { firstName, lastName, regNo, class: studentClass, selectedDormitory, selectedBed } = req.body;
        console.log(req.body)

        const student = await Student.findOne({ where: { uuid: req.params.uuid } });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Update student details
        student.firstName = firstName || student.firstName;
        student.lastName = lastName || student.lastName;
        student.regNo = regNo || student.regNo;
        student.class = studentClass || student.class;

        // Update bed and dormitory names
        if (selectedBed && selectedDormitory) {
            student.bedName = selectedBed; // Save the bed name
            student.name = selectedDormitory; // Save the dormitory name
        }

        await student.save();

        res.json({ message: 'Student details updated successfully', student });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a student
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findOne({ where: { uuid: req.params.uuid } });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        await student.destroy();
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllStudents = async (req, res) => {
    try {
        const students = await Student.findAll({
            include: [{
                model: Bed,
                as: 'bed',
                include: [{
                    model: Dormitory,
                    as: 'dormitory'
                }]
            }],
            attributes: [
                'id', 'uuid', 'firstName', 'lastName', 'regNo', 'class',
                [Sequelize.col('bedName'), 'bedName'],
                [Sequelize.col('name'), 'name']
            ]
        });

        const formattedStudents = students.map(student => {
            const plainStudent = student.get({ plain: true });
            return {
                ...plainStudent,
                bedName: plainStudent.bed?.bedName || null,
                dormitoryName: plainStudent.bed?.dormitory?.dormitoryName || null,
                bed: undefined  // Remove the nested bed object
            };
        });

        res.json(formattedStudents);
    } catch (err) {
        console.error('Error in getAllStudents:', err);
        res.status(500).json({ error: err.message, stack: err.stack });
    }
};

// Get all dormitories with their associated beds
const getAllDormitoriesWithBeds = async (req, res) => {
    try {
        const dormitories = await Dormitory.findAll({
            include: {
                model: Bed,
                as: 'beds', // Ensure this matches the association in the Bed model
            },
        });

        // Format the response to combine dormitory and beds into a single object
        const formattedDormitories = [];

        dormitories.forEach(dormitory => {
            // For each dormitory, add its beds
            dormitory.beds.forEach(bed => {
                formattedDormitories.push({
                    dormitoryId: dormitory.id,
                    dormitoryUuid: dormitory.uuid,
                    dormitoryName: dormitory.name,
                    createdAt: dormitory.createdAt,
                    updatedAt: dormitory.updatedAt,
                    bedId: bed.id,
                    bedUuid: bed.uuid,
                    bedName: bed.bedName,
                    status: bed.status,
                });
            });
        });

        // Send the formatted dormitory data as a response
        res.json(formattedDormitories);
      
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all students in a specific dormitory
const getStudentsByDormitory = async (req, res) => {
    try {
        const { dormitoryId } = req.params;

        // Find the dormitory
        const dormitory = await Dormitory.findByPk(dormitoryId, {
            include: {
                model: Bed,
                as: 'beds',
                include: {
                    model: Student,
                    as: 'students',
                },
            },
        });

        if (!dormitory) {
            return res.status(404).json({ error: 'Dormitory not found' });
        }

        // Get all students assigned to the beds in the dormitory
        const students = dormitory.beds.reduce((acc, bed) => {
            return acc.concat(bed.students);
        }, []);

        res.json({
            dormitory: dormitory.name,
            students,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createStudent,
    getStudentById,
    updateStudent,
    deleteStudent,
    getAllStudents,
    getStudentsByDormitory, 
    getAllDormitoriesWithBeds,
    createDormitoryAndBed,
};

