// Feedback Storage Utility
// This simulates a backend by using localStorage
// Replace this with actual API calls when backend is ready

const STUDENT_FEEDBACK_KEY = 'drivingSchool_studentFeedback';
const INSTRUCTOR_FEEDBACK_KEY = 'drivingSchool_instructorFeedback';

// Initialize with dummy data if empty
const initializeDummyData = () => {
  // Student Feedback (to instructors)
  if (!localStorage.getItem(STUDENT_FEEDBACK_KEY)) {
    const dummyStudentFeedback = [
      { 
        id: 1, 
        studentName: 'Jane Smith',
        studentId: '1',
        instructorName: 'John Doe',
        course: 'Two Wheeler Only', 
        date: '2025-11-03', 
        rating: 5, 
        comment: 'Amazing instructor, very patient and clear! I learned so much in just a few sessions.' 
      },
      { 
        id: 2, 
        studentName: 'Mike Johnson',
        studentId: '2',
        instructorName: 'John Doe',
        course: 'Four Wheeler Only', 
        date: '2025-11-02', 
        rating: 4, 
        comment: 'Good session, but wished we spent more time on parking techniques.' 
      },
    ];
    localStorage.setItem(STUDENT_FEEDBACK_KEY, JSON.stringify(dummyStudentFeedback));
  }

  // Instructor Feedback (to students)
  if (!localStorage.getItem(INSTRUCTOR_FEEDBACK_KEY)) {
    const dummyInstructorFeedback = [
      {
        id: 1,
        instructorName: 'Jane Smith',
        instructorId: 'instructor1',
        instructorAvatar: 'JS',
        studentName: 'John Doe',
        studentId: '1',
        lessonType: 'Two Wheeler Only',
        lessonDate: '2025-11-03',
        rating: 5,
        strengths: 'Excellent control of the vehicle. Smooth gear changes and very attentive to road signs. Shows great confidence when riding in traffic.',
        areasForImprovement: 'Need to practice balancing at low speeds more. Also, remember to check blind spots more frequently, especially when changing lanes.',
        overallComments: 'Great progress! You are doing very well and showing consistent improvement. Keep up the good work and stay focused.',
        recommendations: 'Next lesson, we will focus on highway riding and merging techniques. Practice checking your mirrors regularly.'
      },
    ];
    localStorage.setItem(INSTRUCTOR_FEEDBACK_KEY, JSON.stringify(dummyInstructorFeedback));
  }
};

// Student Feedback Functions (Students giving feedback to Instructors)
export const getStudentFeedback = () => {
  initializeDummyData();
  const data = localStorage.getItem(STUDENT_FEEDBACK_KEY);
  return data ? JSON.parse(data) : [];
};

export const addStudentFeedback = (feedback) => {
  const allFeedback = getStudentFeedback();
  const newFeedback = {
    ...feedback,
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
  };
  allFeedback.push(newFeedback);
  localStorage.setItem(STUDENT_FEEDBACK_KEY, JSON.stringify(allFeedback));
  return newFeedback;
};

export const getStudentFeedbackByInstructor = (instructorName) => {
  const allFeedback = getStudentFeedback();
  return allFeedback.filter(f => f.instructorName === instructorName);
};

// Instructor Feedback Functions (Instructors giving feedback to Students)
export const getInstructorFeedback = () => {
  initializeDummyData();
  const data = localStorage.getItem(INSTRUCTOR_FEEDBACK_KEY);
  return data ? JSON.parse(data) : [];
};

export const addInstructorFeedback = (feedback) => {
  const allFeedback = getInstructorFeedback();
  const newFeedback = {
    ...feedback,
    id: Date.now(),
    date: new Date().toISOString(),
  };
  allFeedback.push(newFeedback);
  localStorage.setItem(INSTRUCTOR_FEEDBACK_KEY, JSON.stringify(allFeedback));
  return newFeedback;
};

export const getInstructorFeedbackByStudent = (studentId) => {
  const allFeedback = getInstructorFeedback();
  return allFeedback.filter(f => f.studentId === studentId);
};

export const getInstructorFeedbackByInstructor = (instructorId) => {
  const allFeedback = getInstructorFeedback();
  return allFeedback.filter(f => f.instructorId === instructorId);
};

// Clear all feedback (for testing)
export const clearAllFeedback = () => {
  localStorage.removeItem(STUDENT_FEEDBACK_KEY);
  localStorage.removeItem(INSTRUCTOR_FEEDBACK_KEY);
  initializeDummyData();
};
