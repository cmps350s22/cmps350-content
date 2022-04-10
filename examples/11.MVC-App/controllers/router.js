import express from 'express';
import courseService from './CourseService.js';
let router = express.Router();

router.get('/api/programs', courseService.getPrograms );
router.get('/api/courses/:program', courseService.getCourses );

router.get('/', (req, res) => res.render('index') );
router.get('/courses', courseService.index );

export default router;