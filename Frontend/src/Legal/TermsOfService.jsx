import React from 'react';
import { Car, ArrowLeft, FileText, Shield, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Legal.css';

function TermsOfService() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="legal-page">
      {/* Navigation Bar */}
      <nav className="legal-navbar">
        <button className="back-button" onClick={goBack}>
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="nav-logo">
          <Car className="logo-icon" size={28} />
          <span className="logo-text">DriveEasy</span>
        </div>
        <a href="/" className="home-link">Home</a>
      </nav>

      {/* Header */}
      <div className="legal-header">
        <FileText size={48} className="legal-icon" />
        <h1 className="legal-title">Terms of Service</h1>
        <p className="legal-subtitle">Last Updated: November 12, 2025</p>
      </div>

      {/* Content */}
      <div className="legal-content">
        <section className="legal-section">
          <div className="section-icon">
            <FileText size={24} />
          </div>
          <h2>1. Agreement to Terms</h2>
          <p>
            Welcome to DriveEasy Driving School Management System ("we," "us," "our," or "DriveEasy"). 
            These Terms of Service ("Terms") constitute a legally binding agreement between you and DriveEasy 
            regarding your access to and use of our driving school management system, website, and related services.
          </p>
          <p>
            By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy. 
            If you disagree with any part of these terms, you may not access our services.
          </p>
          <p>
            <strong>IMPORTANT:</strong> These Terms contain provisions that limit our liability to you and 
            require you to resolve disputes with us through binding arbitration on an individual basis, not as 
            part of a class action (see Section 15 - Dispute Resolution).
          </p>
        </section>

        <section className="legal-section">
          <div className="section-icon">
            <CheckCircle size={24} />
          </div>
          <h2>2. Eligibility and Account Registration</h2>
          
          <h3>2.1 Age Requirements</h3>
          <ul>
            <li>You must be at least 16 years old to register as a student</li>
            <li>Users under 18 must have parental or guardian consent</li>
            <li>Instructors must be at least 21 years old and hold valid certifications</li>
            <li>You must be legally eligible to obtain a driver's license in your jurisdiction</li>
          </ul>

          <h3>2.2 Account Creation</h3>
          <p>When you create an account, you agree to:</p>
          <ul>
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and promptly update your account information</li>
            <li>Maintain the security of your password and account</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
          </ul>

          <h3>2.3 Account Types</h3>
          <ul>
            <li><strong>Student Accounts:</strong> For individuals enrolling in driving courses</li>
            <li><strong>Instructor Accounts:</strong> For certified driving instructors (by invitation only)</li>
            <li><strong>Admin Accounts:</strong> For DriveEasy staff and management (by authorization only)</li>
          </ul>
        </section>

        <section className="legal-section">
          <div className="section-icon">
            <Shield size={24} />
          </div>
          <h2>3. Services Provided</h2>
          
          <h3>3.1 Our Services Include:</h3>
          <ul>
            <li>Online course enrollment and management</li>
            <li>Driving lesson scheduling and coordination</li>
            <li>Progress tracking and performance reports</li>
            <li>Payment processing for courses and lessons</li>
            <li>Communication between students, instructors, and administrators</li>
            <li>Certificate issuance upon course completion</li>
            <li>Feedback and review systems</li>
            <li>Notification services for lessons and updates</li>
          </ul>

          <h3>3.2 Service Availability</h3>
          <p>
            While we strive to provide continuous service, we do not guarantee that our services will be uninterrupted, 
            timely, secure, or error-free. We reserve the right to modify, suspend, or discontinue any part of our 
            services at any time with or without notice.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. User Responsibilities and Conduct</h2>
          
          <h3>4.1 Acceptable Use</h3>
          <p>You agree to use our services only for lawful purposes and in accordance with these Terms. You agree NOT to:</p>
          <ul>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe upon the rights of others</li>
            <li>Impersonate any person or entity</li>
            <li>Upload or transmit viruses or malicious code</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with or disrupt the service or servers</li>
            <li>Use automated systems to access the service without permission</li>
            <li>Collect or harvest information about other users</li>
            <li>Post false, misleading, or fraudulent information</li>
            <li>Harass, abuse, or harm another person</li>
          </ul>

          <h3>4.2 Student Responsibilities</h3>
          <p>As a student, you agree to:</p>
          <ul>
            <li>Attend scheduled lessons on time or provide adequate notice of cancellation</li>
            <li>Follow instructor guidance and safety protocols during lessons</li>
            <li>Maintain valid identification and learner's permit as required</li>
            <li>Pay for enrolled courses and services on time</li>
            <li>Comply with all traffic laws and regulations during lessons</li>
            <li>Report any concerns or incidents to your instructor or DriveEasy management</li>
            <li>Complete required coursework and assessments honestly</li>
          </ul>

          <h3>4.3 Instructor Responsibilities</h3>
          <p>Instructors agree to:</p>
          <ul>
            <li>Maintain current driving instructor certifications and licenses</li>
            <li>Provide professional, safe, and effective instruction</li>
            <li>Arrive punctually for scheduled lessons</li>
            <li>Maintain vehicle safety and cleanliness standards</li>
            <li>Provide accurate progress reports and feedback</li>
            <li>Comply with all DriveEasy policies and procedures</li>
            <li>Report any safety concerns or incidents immediately</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>5. Course Enrollment and Fees</h2>
          
          <h3>5.1 Course Fees</h3>
          <ul>
            <li>All fees are stated in Indian Rupees (INR) and are subject to change</li>
            <li>Current pricing is available on our website and in the course catalog</li>
            <li>Fees must be paid in full or according to approved payment plans before services begin</li>
            <li>Promotional discounts may be offered at our discretion and are subject to specific terms</li>
          </ul>

          <h3>5.2 Payment Terms</h3>
          <ul>
            <li>Payment is due at the time of enrollment unless alternative arrangements are made</li>
            <li>We accept credit cards, debit cards, UPI, and other approved payment methods</li>
            <li>All payments are processed securely through our payment partners</li>
            <li>A receipt will be provided for all transactions</li>
            <li>Late payments may result in suspension of services</li>
          </ul>

          <h3>5.3 Refund Policy</h3>
          <ul>
            <li><strong>Full Refund:</strong> Available within 7 days of enrollment if no lessons have been taken</li>
            <li><strong>Partial Refund:</strong> Calculated on unused lessons minus a 15% administrative fee</li>
            <li><strong>No Refund:</strong> After 50% of course completion or for completed courses</li>
            <li><strong>Medical/Emergency:</strong> Special consideration given with supporting documentation</li>
            <li>Refunds will be processed within 14 business days of approval</li>
            <li>Refunds will be issued to the original payment method</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>6. Scheduling and Cancellation</h2>
          
          <h3>6.1 Lesson Scheduling</h3>
          <ul>
            <li>Students can schedule lessons through the online platform</li>
            <li>Lesson availability is subject to instructor schedules</li>
            <li>We recommend booking lessons at least 48 hours in advance</li>
            <li>Lesson times are confirmed via email and in-app notifications</li>
          </ul>

          <h3>6.2 Cancellation Policy</h3>
          <ul>
            <li><strong>24+ Hours Notice:</strong> Full lesson credit retained, can be rescheduled</li>
            <li><strong>12-24 Hours Notice:</strong> 50% lesson credit retained</li>
            <li><strong>Less than 12 Hours:</strong> Full lesson fee forfeited</li>
            <li><strong>No-Show:</strong> Full lesson fee forfeited</li>
            <li><strong>Emergency Exceptions:</strong> May be granted at management's discretion with documentation</li>
          </ul>

          <h3>6.3 Instructor Cancellations</h3>
          <p>
            If DriveEasy or an instructor must cancel a lesson, you will receive a full credit and priority rescheduling. 
            In rare cases of repeated cancellations, we may offer compensation or alternative arrangements.
          </p>
        </section>

        <section className="legal-section">
          <div className="section-icon">
            <AlertCircle size={24} />
          </div>
          <h2>7. Safety and Liability</h2>
          
          <h3>7.1 Safety Requirements</h3>
          <ul>
            <li>All students must follow instructor safety directions at all times</li>
            <li>Vehicles are equipped with dual controls for instructor intervention</li>
            <li>Students must be physically and mentally fit to drive safely</li>
            <li>Students must disclose any medical conditions that may affect driving ability</li>
            <li>Use of alcohol or drugs before or during lessons is strictly prohibited</li>
          </ul>

          <h3>7.2 Assumption of Risk</h3>
          <p>
            You acknowledge that driving involves inherent risks, including the risk of property damage, personal injury, 
            or death. By enrolling in our courses, you voluntarily assume these risks.
          </p>

          <h3>7.3 Limitation of Liability</h3>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, DRIVEEASY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
            SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY 
            OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM:
          </p>
          <ul>
            <li>Your use or inability to use our services</li>
            <li>Any unauthorized access to or use of our servers and/or personal information</li>
            <li>Any interruption or cessation of transmission to or from our services</li>
            <li>Any bugs, viruses, or similar items transmitted through our services by third parties</li>
            <li>Accidents or incidents during driving lessons</li>
            <li>Failure to pass driving tests or obtain licenses</li>
          </ul>
          <p>
            Our total liability for any claims arising out of or relating to these Terms or our services shall not 
            exceed the amount you paid to us in the twelve (12) months preceding the claim.
          </p>

          <h3>7.4 Insurance</h3>
          <p>
            All vehicles used for instruction are insured as required by law. Students are covered under our commercial 
            driving instruction insurance policy during scheduled lessons. Personal liability coverage details are 
            available upon request.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Intellectual Property Rights</h2>
          
          <h3>8.1 Our Content</h3>
          <p>
            The service and its original content, features, and functionality are owned by DriveEasy and are protected 
            by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>

          <h3>8.2 License to Use</h3>
          <p>
            We grant you a limited, non-exclusive, non-transferable, revocable license to access and use our services 
            for personal, non-commercial purposes in accordance with these Terms.
          </p>

          <h3>8.3 Restrictions</h3>
          <p>You may not:</p>
          <ul>
            <li>Copy, modify, or create derivative works based on our services</li>
            <li>Distribute, transmit, or display our content publicly</li>
            <li>Reverse engineer or attempt to extract source code</li>
            <li>Remove or alter any copyright, trademark, or proprietary notices</li>
            <li>Use our services for commercial purposes without authorization</li>
          </ul>

          <h3>8.4 User Content</h3>
          <p>
            You retain ownership of content you submit to our services (reviews, feedback, photos). However, by submitting 
            content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display 
            such content for the purpose of operating and improving our services.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Privacy and Data Protection</h2>
          <p>
            Your use of our services is also governed by our Privacy Policy, which is incorporated into these Terms by reference. 
            Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
          </p>
          <p>Key points include:</p>
          <ul>
            <li>We collect personal information necessary to provide our services</li>
            <li>We use industry-standard security measures to protect your data</li>
            <li>We do not sell your personal information to third parties</li>
            <li>You have rights to access, correct, and delete your personal information</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>10. Account Termination</h2>
          
          <h3>10.1 Termination by You</h3>
          <p>
            You may terminate your account at any time by contacting us at support@driveeasy.com. Upon termination, 
            you will lose access to your account and all associated data. Any unused course credits may be eligible 
            for refund according to our refund policy.
          </p>

          <h3>10.2 Termination by Us</h3>
          <p>We may suspend or terminate your account immediately, without prior notice, if you:</p>
          <ul>
            <li>Breach any provision of these Terms</li>
            <li>Engage in fraudulent or illegal activities</li>
            <li>Pose a safety risk to instructors or other students</li>
            <li>Provide false or misleading information</li>
            <li>Fail to pay for services rendered</li>
            <li>Engage in harassment or abusive behavior</li>
          </ul>

          <h3>10.3 Effect of Termination</h3>
          <p>
            Upon termination, all licenses and rights granted to you will immediately cease. Sections of these Terms 
            that by their nature should survive termination shall survive, including ownership provisions, warranty 
            disclaimers, indemnity, and limitations of liability.
          </p>
        </section>

        <section className="legal-section">
          <div className="section-icon">
            <XCircle size={24} />
          </div>
          <h2>11. Disclaimers and Warranties</h2>
          
          <h3>11.1 No Guarantee of Results</h3>
          <p>
            While we strive to provide high-quality instruction, we cannot guarantee that you will pass your driving 
            test or obtain a driver's license. Success depends on many factors including your effort, practice, and performance.
          </p>

          <h3>11.2 Service "As Is"</h3>
          <p>
            OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, 
            INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF 
            PERFORMANCE.
          </p>

          <h3>11.3 Third-Party Services</h3>
          <p>
            Our services may contain links to third-party websites or services. We are not responsible for the content, 
            accuracy, or practices of any third-party services. Your use of third-party services is at your own risk.
          </p>
        </section>

        <section className="legal-section">
          <h2>12. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless DriveEasy, its officers, directors, employees, instructors, 
            and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable 
            attorney's fees, arising out of or in any way connected with:
          </p>
          <ul>
            <li>Your access to or use of our services</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any third-party right, including intellectual property or privacy rights</li>
            <li>Any claim that your content caused damage to a third party</li>
            <li>Your conduct during driving lessons or use of our vehicles</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>13. Force Majeure</h2>
          <p>
            DriveEasy shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable 
            control, including acts of God, natural disasters, war, terrorism, riots, labor disputes, government actions, 
            pandemics, or failure of telecommunications or internet services.
          </p>
        </section>

        <section className="legal-section">
          <h2>14. Modifications to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time at our sole discretion. If we make material 
            changes, we will notify you by:
          </p>
          <ul>
            <li>Posting the updated Terms on our website</li>
            <li>Sending an email to your registered email address</li>
            <li>Displaying a prominent notice on our platform</li>
          </ul>
          <p>
            Your continued use of our services after such modifications constitutes your acceptance of the updated Terms. 
            If you do not agree to the modified Terms, you must stop using our services and may request account termination.
          </p>
        </section>

        <section className="legal-section">
          <h2>15. Dispute Resolution</h2>
          
          <h3>15.1 Informal Resolution</h3>
          <p>
            If you have any concerns or disputes, please contact us first at legal@driveeasy.com. We will attempt to 
            resolve the dispute informally within 30 days.
          </p>

          <h3>15.2 Binding Arbitration</h3>
          <p>
            If we cannot resolve the dispute informally, you and DriveEasy agree to resolve any claims through final 
            and binding arbitration, except as set forth below. This includes disputes arising out of or relating to 
            interpretation or application of this arbitration clause.
          </p>

          <h3>15.3 Exceptions</h3>
          <p>
            Either party may seek relief in small claims court for disputes within its jurisdiction. Additionally, 
            either party may seek injunctive or other equitable relief in court to protect intellectual property rights.
          </p>

          <h3>15.4 Class Action Waiver</h3>
          <p>
            You and DriveEasy agree that any proceedings to resolve disputes will be conducted on an individual basis 
            and not in a class, consolidated, or representative action.
          </p>
        </section>

        <section className="legal-section">
          <h2>16. Governing Law and Jurisdiction</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India, without regard to its 
            conflict of law provisions. Any legal action or proceeding shall be brought exclusively in the courts located 
            in New Delhi, India.
          </p>
        </section>

        <section className="legal-section">
          <h2>17. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or 
            eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.
          </p>
        </section>

        <section className="legal-section">
          <h2>18. Entire Agreement</h2>
          <p>
            These Terms, together with our Privacy Policy and any other legal notices or agreements published by us on 
            our services, constitute the entire agreement between you and DriveEasy concerning our services and supersede 
            all prior agreements and understandings.
          </p>
        </section>

        <section className="legal-section">
          <h2>19. Contact Information</h2>
          <p>If you have any questions about these Terms, please contact us:</p>
          
          <div className="contact-info">
            <p><strong>DriveEasy Driving School</strong></p>
            <p>Email: <a href="mailto:legal@driveeasy.com">legal@driveeasy.com</a></p>
            <p>Support: <a href="mailto:support@driveeasy.com">support@driveeasy.com</a></p>
            <p>Phone: +91 12345 67890</p>
            <p>Address: 123 Driving Range Rd, New Delhi, 110001</p>
          </div>
        </section>

        <section className="legal-section acknowledgment">
          <h2>20. Acknowledgment</h2>
          <p>
            BY USING OUR SERVICES, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE AND AGREE TO BE BOUND BY THEM. 
            IF YOU DO NOT AGREE TO THESE TERMS, DO NOT USE OUR SERVICES.
          </p>
          <p>
            Thank you for choosing DriveEasy Driving School. We look forward to helping you achieve your driving goals safely and successfully.
          </p>
        </section>
      </div>

      {/* Footer */}
      <footer className="legal-footer">
        <p>&copy; {new Date().getFullYear()} DriveEasy Driving School. All rights reserved.</p>
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/Login">Login</a>
        </div>
      </footer>
    </div>
  );
}

export default TermsOfService;
