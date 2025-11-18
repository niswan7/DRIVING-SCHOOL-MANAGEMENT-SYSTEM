import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Download, Award, User, BookOpen } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { apiRequest } from '../utils/apiHelper';
import { API_ENDPOINTS } from '../config/api';
import './GenerateCertificate.css';

const GenerateCertificate = ({ navigate }) => {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [completedCourses, setCompletedCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const certificateRef = useRef(null);

    useEffect(() => {
        fetchStudents();
        fetchCourses();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await apiRequest(API_ENDPOINTS.USERS, {
                method: 'GET'
            });
            if (response.success) {
                const studentUsers = response.data.filter(user => user.role === 'student');
                setStudents(studentUsers);
            }
        } catch (err) {
            console.error('Error fetching students:', err);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await apiRequest(API_ENDPOINTS.COURSES, {
                method: 'GET'
            });
            if (response.success) {
                setCourses(response.data);
            }
        } catch (err) {
            console.error('Error fetching courses:', err);
        }
    };

    const handleStudentChange = async (e) => {
        const studentId = e.target.value;
        setSelectedStudent(studentId);
        setSelectedCourse('');
        setError('');

        if (!studentId) {
            setCompletedCourses([]);
            return;
        }

        // Fetch student's completed courses from user data
        setIsLoading(true);
        try {
            const response = await apiRequest(API_ENDPOINTS.USER_BY_ID(studentId), {
                method: 'GET'
            });
            
            if (response.success && response.data) {
                const completedCoursesData = response.data.completedCourses || [];
                
                // Get the course IDs from completedCourses array
                const completedCourseIds = completedCoursesData.map(cc => cc.courseId.toString());
                
                // Fetch course details for each completed course
                const completedCourseList = [];
                for (const courseId of completedCourseIds) {
                    try {
                        const courseResponse = await apiRequest(API_ENDPOINTS.COURSE_BY_ID(courseId), {
                            method: 'GET'
                        });
                        if (courseResponse.success && courseResponse.data) {
                            completedCourseList.push(courseResponse.data);
                        }
                    } catch (err) {
                        console.error(`Error fetching course ${courseId}:`, err);
                    }
                }
                
                setCompletedCourses(completedCourseList);
                
                if (completedCourseList.length === 0) {
                    setError('This student has not completed any courses yet.');
                }
            }
        } catch (err) {
            console.error('Error fetching student data:', err);
            setError('Failed to fetch student completed courses.');
            setCompletedCourses([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCourseChange = (e) => {
        setSelectedCourse(e.target.value);
    };

    const getStudentName = () => {
        const student = students.find(s => s._id === selectedStudent);
        return student ? `${student.firstName} ${student.lastName}` : '';
    };

    const getCourseName = () => {
        const course = courses.find(c => c._id === selectedCourse);
        return course ? course.title : '';
    };

    const getCourseDetails = () => {
        const course = courses.find(c => c._id === selectedCourse);
        return course;
    };

    const downloadCertificate = async () => {
        if (!selectedStudent || !selectedCourse) {
            alert('Please select both a student and a course');
            return;
        }

        // Convert certificate to PDF using modern browser API
        try {
            const certificate = certificateRef.current;
            
            // Use html2canvas to capture the certificate
            const html2canvas = (await import('html2canvas')).default;
            const canvas = await html2canvas(certificate, {
                scale: 2,
                backgroundColor: '#ffffff',
                logging: false
            });

            // Convert canvas to blob
            canvas.toBlob(async (blob) => {
                // Use jsPDF to create PDF
                const { jsPDF } = await import('jspdf');
                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'px',
                    format: [canvas.width, canvas.height]
                });

                const imgData = canvas.toDataURL('image/png');
                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                
                const studentName = getStudentName().replace(/\s+/g, '_');
                const courseName = getCourseName().replace(/\s+/g, '_');
                pdf.save(`Certificate_${studentName}_${courseName}.pdf`);
            });
        } catch (err) {
            console.error('Error generating PDF:', err);
            alert('Error generating certificate. Please try again.');
        }
    };

    const courseDetails = getCourseDetails();
    const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    return (
        <main className="manage-generic-container">
            <div className="manage-users-controls">
                <button className="btn-back" onClick={() => navigate('dashboard')}>
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>
            </div>

            <div className="certificate-generator-header">
                <Award size={40} />
                <h2>Generate Course Certificate</h2>
                <p>Select a student and their completed course to generate a certificate</p>
            </div>

            <div className="certificate-form-section">
                <div className="form-row">
                    <div className="form-group">
                        <label>
                            <User size={16} className="label-icon" />
                            Select Student *
                        </label>
                        <select 
                            value={selectedStudent} 
                            onChange={handleStudentChange}
                            disabled={isLoading}
                        >
                            <option value="">-- Select a Student --</option>
                            {students.map(student => (
                                <option key={student._id} value={student._id}>
                                    {student.firstName} {student.lastName} ({student.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>
                            <BookOpen size={16} className="label-icon" />
                            Select Completed Course *
                        </label>
                        <select 
                            value={selectedCourse} 
                            onChange={handleCourseChange}
                            disabled={!selectedStudent || isLoading || completedCourses.length === 0}
                        >
                            <option value="">-- Select a Course --</option>
                            {completedCourses.map(course => (
                                <option key={course._id} value={course._id}>
                                    {course.title} - {course.duration} hours
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}
                {isLoading && <div className="loading-message">Loading completed courses...</div>}
            </div>

            {selectedStudent && selectedCourse && courseDetails && (
                <>
                    <div className="certificate-preview-section">
                        <h3>Certificate Preview</h3>
                        <div className="certificate-container" ref={certificateRef}>
                            <div className="certificate-border">
                                <div className="certificate-content">
                                    <div className="certificate-header">
                                        <Award size={80} className="certificate-icon" />
                                        <h1 className="certificate-title">CERTIFICATE OF COMPLETION</h1>
                                    </div>

                                    <div className="certificate-body">
                                        <p className="certificate-text">This is to certify that</p>
                                        <h2 className="certificate-name">{getStudentName()}</h2>
                                        <p className="certificate-text">has successfully completed the course</p>
                                        <h3 className="certificate-course">{getCourseName()}</h3>
                                        
                                        <div className="certificate-details">
                                            <div className="detail-item">
                                                <span className="detail-label">Duration:</span>
                                                <span className="detail-value">{courseDetails.duration} Hours</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Course Type:</span>
                                                <span className="detail-value">{courseDetails.type}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Date of Completion:</span>
                                                <span className="detail-value">{currentDate}</span>
                                            </div>
                                        </div>

                                        <div className="certificate-signature">
                                            <div className="signature-line">
                                                <div className="signature-border"></div>
                                                <p className="signature-label">Authorized Signature</p>
                                            </div>
                                            <div className="signature-line">
                                                <div className="signature-border"></div>
                                                <p className="signature-label">Date</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="certificate-footer">
                                        <p>Driving School Management System</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="certificate-actions">
                        <button className="btn btn-create download-btn" onClick={downloadCertificate}>
                            <Download size={18} /> Download Certificate as PDF
                        </button>
                    </div>
                </>
            )}
        </main>
    );
};

export default GenerateCertificate;
