/**
 * Schedule Controller
 * Handles HTTP requests for schedule operations
 */
class ScheduleController {
    constructor(scheduleService) {
        this.scheduleService = scheduleService;
    }

    /**
     * Create schedule
     * POST /api/schedules
     */
    async create(req, res) {
        try {
            const schedule = await this.scheduleService.createSchedule(req.body);
            res.status(201).json({
                success: true,
                data: schedule,
                message: 'Schedule created successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get schedule by ID
     * GET /api/schedules/:id
     */
    async getById(req, res) {
        try {
            const schedule = await this.scheduleService.getScheduleById(req.params.id);
            res.status(200).json({
                success: true,
                data: schedule
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get instructor schedule
     * GET /api/schedules/instructor/:instructorId
     */
    async getInstructorSchedule(req, res) {
        try {
            const { startDate, endDate } = req.query;
            let schedules;
            
            if (startDate && endDate) {
                schedules = await this.scheduleService.getInstructorScheduleByDateRange(
                    req.params.instructorId,
                    startDate,
                    endDate
                );
            } else {
                schedules = await this.scheduleService.getInstructorSchedule(req.params.instructorId);
            }
            
            res.status(200).json({
                success: true,
                data: schedules,
                count: schedules.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get instructor schedule for a specific date
     * GET /api/schedules/instructor/:instructorId/date/:date
     */
    async getInstructorScheduleByDate(req, res) {
        try {
            const schedules = await this.scheduleService.getInstructorScheduleByDate(
                req.params.instructorId,
                req.params.date
            );
            res.status(200).json({
                success: true,
                data: schedules,
                count: schedules.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Update schedule
     * PUT /api/schedules/:id
     */
    async update(req, res) {
        try {
            const schedule = await this.scheduleService.updateSchedule(req.params.id, req.body);
            res.status(200).json({
                success: true,
                data: schedule,
                message: 'Schedule updated successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Delete schedule
     * DELETE /api/schedules/:id
     */
    async delete(req, res) {
        try {
            await this.scheduleService.deleteSchedule(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Schedule deleted successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Copy previous week schedule
     * POST /api/schedules/instructor/:instructorId/copy-week
     */
    async copyPreviousWeek(req, res) {
        try {
            const schedules = await this.scheduleService.copyPreviousWeek(req.params.instructorId);
            res.status(201).json({
                success: true,
                data: schedules,
                message: 'Schedule copied successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = ScheduleController;
