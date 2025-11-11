import React from 'react';
import { ArrowLeft, FileText, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './legal.css';

function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="legal-page-container">
      <div className="legal-overlay"></div>
      
      <div className="legal-card">
        <div className="legal-header">
          <button onClick={() => navigate('/')} className="back-button">
            <ArrowLeft size={20} />
          </button>
          <div className="header-content">
            <FileText className="header-icon" size={48} />
            <h1 className="legal-title">Terms of Service</h1>
            <p className="legal-subtitle">Last Updated: November 12, 2025</p>
          </div>
        </div>

        <div className="legal-content">
          <section className="legal-section">
            <h2><CheckCircle size={24} /> 1. Acceptance of Terms</h2>
            <p>
              By accessing and using the DriveEasy Driving School Management System, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.
            </p>
            <p>
              These Terms of Service apply to all users of the system, including students, instructors, administrators, and visitors to our platform.
            </p>
          </section>

          <section className="legal-section">
            <h2><Shield size={24} /> 2. Services Provided</h2>
            <h3>2.1 Driving Instruction</h3>
            <p>
              DriveEasy provides professional driving instruction services including but not limited to:
            </p>
            <ul>
              <li>Two Wheeler Only training (motorcycles and scooters)</li>
              <li>Four Wheeler Only training (cars and SUVs)</li>
              <li>Combined Two Wheeler and Four Wheeler training</li>
              <li>Heavy Vehicle License training (trucks and buses)</li>
            </ul>

            <h3>2.2 Platform Services</h3>
            <p>
              Our management system provides:
            </p>
            <ul>
              <li>Online lesson booking and scheduling</li>
              <li>Progress tracking and feedback systems</li>
              <li>Instructor-student communication</li>
              <li>Payment processing and management</li>
              <li>License test preparation resources</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2><AlertCircle size={24} /> 3. User Responsibilities</h2>
            <h3>3.1 Account Registration</h3>
            <p>
              Users must:
            </p>
            <ul>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of their account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be at least 16 years old to register for two-wheeler courses</li>
              <li>Be at least 18 years old to register for four-wheeler and heavy vehicle courses</li>
            </ul>

            <h3>3.2 Student Obligations</h3>
            <p>
              Students agree to:
            </p>
            <ul>
              <li>Attend scheduled lessons punctually</li>
              <li>Follow all safety instructions provided by instructors</li>
              <li>Possess valid identification and learner's permit when required</li>
              <li>Maintain appropriate behavior and respect towards instructors and staff</li>
              <li>Pay all fees and charges on time as per the agreed schedule</li>
              <li>Provide at least 24 hours notice for lesson cancellations</li>
            </ul>

            <h3>3.3 Instructor Obligations</h3>
            <p>
              Instructors agree to:
            </p>
            <ul>
              <li>Maintain valid driving instructor certification</li>
              <li>Provide professional and safe instruction</li>
              <li>Arrive on time for scheduled lessons</li>
              <li>Maintain vehicle safety standards</li>
              <li>Provide constructive feedback to students</li>
              <li>Report any safety concerns immediately</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2><FileText size={24} /> 4. Payment Terms</h2>
            <h3>4.1 Fees and Charges</h3>
            <ul>
              <li>Course fees are clearly displayed before enrollment</li>
              <li>Payment must be made before or at the time of lesson booking</li>
              <li>We accept payments via credit/debit cards, UPI, and bank transfers</li>
              <li>All prices are in Indian Rupees (INR) unless otherwise specified</li>
            </ul>

            <h3>4.2 Refund Policy</h3>
            <ul>
              <li>Cancellations made 24 hours before scheduled lesson: 100% refund</li>
              <li>Cancellations made less than 24 hours before lesson: 50% refund</li>
              <li>No-shows without prior notice: No refund</li>
              <li>Unused lesson packages can be refunded within 30 days with 20% administrative fee</li>
              <li>Refunds are processed within 7-10 business days</li>
            </ul>

            <h3>4.3 Course Packages</h3>
            <ul>
              <li>Package validity: 6 months from date of purchase</li>
              <li>Lessons cannot be transferred to another person</li>
              <li>Package extensions may be available for a fee</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2><Shield size={24} /> 5. Safety and Liability</h2>
            <h3>5.1 Safety Requirements</h3>
            <ul>
              <li>Students must follow all traffic rules and regulations</li>
              <li>Use of mobile phones while driving is strictly prohibited</li>
              <li>Students under the influence of alcohol or drugs will not be allowed to drive</li>
              <li>Seat belts must be worn at all times during four-wheeler training</li>
              <li>Helmets must be worn during two-wheeler training</li>
            </ul>

            <h3>5.2 Limitation of Liability</h3>
            <p>
              DriveEasy and its instructors shall not be liable for:
            </p>
            <ul>
              <li>Any injuries sustained during training (covered by insurance)</li>
              <li>Failure to pass driving tests administered by licensing authorities</li>
              <li>Delays or cancellations due to weather conditions or vehicle maintenance</li>
              <li>Personal belongings lost or damaged during lessons</li>
            </ul>

            <h3>5.3 Insurance Coverage</h3>
            <ul>
              <li>All training vehicles are fully insured</li>
              <li>Students are covered under our liability insurance during lessons</li>
              <li>Personal injury insurance is recommended but not mandatory</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2><AlertCircle size={24} /> 6. Intellectual Property</h2>
            <p>
              All content, materials, and resources provided through the DriveEasy platform, including but not limited to:
            </p>
            <ul>
              <li>Training materials and documentation</li>
              <li>Videos and instructional content</li>
              <li>Software and system interface</li>
              <li>Logos, trademarks, and branding</li>
            </ul>
            <p>
              are the property of DriveEasy Driving School and are protected by copyright laws. Unauthorized use, reproduction, or distribution is prohibited.
            </p>
          </section>

          <section className="legal-section">
            <h2><FileText size={24} /> 7. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Please review our <a href="/privacy" className="legal-link">Privacy Policy</a> to understand how we collect, use, and protect your personal information.
            </p>
            <ul>
              <li>We collect only necessary personal information</li>
              <li>Data is stored securely and not shared with third parties without consent</li>
              <li>Users can request data deletion at any time</li>
              <li>We comply with applicable data protection regulations</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2><Shield size={24} /> 8. Termination of Services</h2>
            <h3>8.1 By User</h3>
            <p>
              Users may terminate their account at any time by contacting our support team. Refunds for unused services will be processed according to our refund policy.
            </p>

            <h3>8.2 By DriveEasy</h3>
            <p>
              We reserve the right to terminate or suspend access to our services immediately, without prior notice, for:
            </p>
            <ul>
              <li>Violation of these Terms of Service</li>
              <li>Fraudulent or illegal activities</li>
              <li>Abusive behavior towards staff or other users</li>
              <li>Non-payment of fees</li>
              <li>Safety violations</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2><CheckCircle size={24} /> 9. Dispute Resolution</h2>
            <h3>9.1 Complaints Procedure</h3>
            <ul>
              <li>All complaints should be submitted in writing to support@driveeasy.com</li>
              <li>We aim to respond to all complaints within 48 hours</li>
              <li>Escalated issues will be reviewed by management</li>
            </ul>

            <h3>9.2 Governing Law</h3>
            <p>
              These Terms of Service are governed by the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.
            </p>

            <h3>9.3 Arbitration</h3>
            <p>
              In the event of a dispute, both parties agree to first attempt resolution through mediation before pursuing legal action.
            </p>
          </section>

          <section className="legal-section">
            <h2><AlertCircle size={24} /> 10. Changes to Terms</h2>
            <p>
              DriveEasy reserves the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to the platform. Users will be notified of significant changes via email.
            </p>
            <p>
              Continued use of our services after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="legal-section">
            <h2><FileText size={24} /> 11. Contact Information</h2>
            <p>
              For questions or concerns regarding these Terms of Service, please contact us:
            </p>
            <div className="contact-info">
              <p><strong>DriveEasy Driving School</strong></p>
              <p>123 Driving Range Rd, New Delhi, 110001</p>
              <p>Email: legal@driveeasy.com</p>
              <p>Phone: +91 12345 67890</p>
              <p>Business Hours: Monday-Saturday, 8:00 AM - 8:00 PM</p>
            </div>
          </section>

          <section className="legal-section disclaimer">
            <h2><Shield size={24} /> 12. Disclaimer</h2>
            <p>
              <strong>THE SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND.</strong> While we strive to provide the best instruction and resources, we cannot guarantee specific results, including but not limited to passing driving tests or obtaining licenses.
            </p>
            <p>
              Success in obtaining a driving license depends on multiple factors including student effort, practice, and performance during official testing by licensing authorities.
            </p>
          </section>

          <div className="legal-agreement">
            <CheckCircle size={24} className="agreement-icon" />
            <p>
              By using DriveEasy services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>

        <div className="legal-footer">
          <button onClick={() => navigate('/')} className="back-home-btn">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;
