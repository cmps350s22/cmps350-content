import studentRepository from '../repositories/StudentRepository.js';

class StudentService {
    async getStudents(req, res) {
        let students = await studentRepository.getStudents();
        res.json(students);
    }

    async getStudent(req, res) {
        try {
            let studentId = req.params.id;
            console.log('getStudent.req.params.id', studentId);

            let student = await studentRepository.getStudentCourses(parseInt(studentId));
            //console.log(JSON.stringify(student, null, 2))
            res.json(student);
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
}

export default new StudentService();