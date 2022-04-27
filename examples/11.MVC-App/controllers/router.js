import express from 'express';
import courseService from './CourseService.js';
let router = express.Router();

router.get('/api/programs', courseService.getProgramsJson );
router.get('/api/courses/:program', courseService.getCoursesJson );

router.get('/', (req, res) => res.render('index') );
router.get('/courses', courseService.getCourses );
router.post('/courses', courseService.getCourses );

export default router;