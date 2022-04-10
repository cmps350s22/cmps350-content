import courseRepository from './../models/CourseRepository.js';

class CourseService {
    async getPrograms(req, res) {
        const programs = await courseRepository.getPrograms();
        res.json(programs);
    }

    async getCourses(req, res) {
        try {
            const program = req.params.program
            console.log('getCourses.req.params.program', program);

            const courses = await courseRepository.getCourses( program );
            res.json(courses);
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }

    async index (req, res) {
        const programs = await courseRepository.getPrograms();
        //res.json(programs);
        res.render('course', { programs });
    }
}

export default new CourseService();