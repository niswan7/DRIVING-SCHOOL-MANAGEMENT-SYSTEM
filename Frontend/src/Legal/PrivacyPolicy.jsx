import React from 'react';
import { Car, ArrowLeft, Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Legal.css';

function PrivacyPolicy() {
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
        <Shield size={48} className="legal-icon" />
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-subtitle">Last Updated: November 12, 2025</p>
      </div>

      {/* Content */}
      <div className="legal-content">
        <section className="legal-section">
          <div className="section-icon">
            <FileText size={24} />
          </div>
          <h2>1. Introduction</h2>
          <p>
            Welcome to DriveEasy Driving School Management System. We are committed to protecting your personal 
            information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, 
            and safeguard your information when you use our driving school management system.
          </p>
          <p>
            By using our services, you agree to the collection and use of information in accordance with this policy. 
            If you do not agree with the terms of this privacy policy, please do not access our services.
          </p>
        </section>

        <section className="legal-section">
          <div className="section-icon">
            <Database size={24} />
          </div>
          <h2>2. Information We Collect</h2>
          
          <h3>2.1 Personal Information</h3>
          <p>We collect personal information that you voluntarily provide to us when you:</p>
          <ul>
            <li>Register for an account (student, instructor, or admin)</li>
            <li>Enroll in driving courses</li>
            <li>Make payments for lessons or courses</li>
            <li>Schedule driving lessons</li>
            <li>Contact us for support or inquiries</li>
          </ul>
          
          <p>The personal information we collect may include:</p>
          <ul>
            <li><strong>Contact Information:</strong> Full name, email address, phone number, physical address</li>
            <li><strong>Identification Information:</strong> Date of birth, driver's license number (if applicable)</li>
            <li><strong>Account Credentials:</strong> Username, password (encrypted)</li>
            <li><strong>Payment Information:</strong> Billing address, payment method details (processed securely)</li>
            <li><strong>Profile Information:</strong> Profile picture, preferences, emergency contact details</li>
          </ul>

          <h3>2.2 Automatically Collected Information</h3>
          <p>When you access our system, we automatically collect certain information, including:</p>
          <ul>
            <li>Device information (IP address, browser type, operating system)</li>
            <li>Usage data (pages visited, time spent, features used)</li>
            <li>Log data (access times, error logs)</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h3>2.3 Driving Performance Data</h3>
          <p>For students enrolled in our courses, we collect:</p>
          <ul>
            <li>Lesson attendance records</li>
            <li>Progress reports and assessments</li>
            <li>Instructor feedback and evaluations</li>
            <li>Test scores and certification records</li>
            <li>Driving practice hours and performance metrics</li>
          </ul>
        </section>

        <section className="legal-section">
          <div className="section-icon">
            <Eye size={24} />
          </div>
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect or receive for the following purposes:</p>
          
          <ul>
            <li><strong>Account Management:</strong> To create and manage your account, authenticate users, and maintain security</li>
            <li><strong>Course Delivery:</strong> To enroll you in courses, schedule lessons, and track your progress</li>
            <li><strong>Communication:</strong> To send you notifications about lessons, payments, updates, and important information</li>
            <li><strong>Payment Processing:</strong> To process payments for courses and services</li>
            <li><strong>Service Improvement:</strong> To analyze usage patterns and improve our system functionality</li>
            <li><strong>Customer Support:</strong> To respond to your inquiries and provide technical support</li>
            <li><strong>Legal Compliance:</strong> To comply with legal obligations and protect our rights</li>
            <li><strong>Safety and Security:</strong> To maintain the safety and security of our platform and users</li>
            <li><strong>Marketing:</strong> To send promotional materials (with your consent, and you can opt-out anytime)</li>
          </ul>
        </section>

        <section className="legal-section">
          <div className="section-icon">
            <UserCheck size={24} />
          </div>
          <h2>4. Information Sharing and Disclosure</h2>
          
          <h3>4.1 With Your Consent</h3>
          <p>We may share your information with third parties when we have your explicit consent to do so.</p>

          <h3>4.2 Service Providers</h3>
          <p>We may share your information with third-party service providers who perform services on our behalf, including:</p>
          <ul>
            <li>Payment processors</li>
            <li>Cloud hosting services</li>
            <li>Email service providers</li>
            <li>Analytics providers</li>
            <li>Customer support tools</li>
          </ul>

          <h3>4.3 Within Our Organization</h3>
          <p>Information may be shared between:</p>
          <ul>
            <li>Students and their assigned instructors (for lesson coordination and progress tracking)</li>
            <li>Administrators (for system management and quality assurance)</li>
            <li>Instructors (for scheduling and performance evaluation)</li>
          </ul>

          <h3>4.4 Legal Requirements</h3>
          <p>We may disclose your information if required to do so by law or in response to valid requests by public authorities, including:</p>
          <ul>
            <li>To comply with legal obligations</li>
            <li>To protect and defend our rights or property</li>
            <li>To prevent or investigate possible wrongdoing</li>
            <li>To protect the safety of users or the public</li>
          </ul>

          <h3>4.5 Business Transfers</h3>
          <p>
            In the event of a merger, acquisition, or sale of assets, your information may be transferred. 
            We will provide notice before your information is transferred and becomes subject to a different privacy policy.
          </p>
        </section>

        <section className="legal-section">
          <div className="section-icon">
            <Lock size={24} />
          </div>
          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction. These measures include:
          </p>
          <ul>
            <li>Encryption of data in transit and at rest</li>
            <li>Secure password hashing using industry-standard algorithms</li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>Access controls and authentication mechanisms</li>
            <li>Secure payment processing through PCI-DSS compliant providers</li>
            <li>Regular backups and disaster recovery procedures</li>
            <li>Employee training on data protection and privacy</li>
          </ul>
          <p>
            However, no method of transmission over the Internet or electronic storage is 100% secure. 
            While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Your Privacy Rights</h2>
          <p>Depending on your location, you may have the following rights regarding your personal information:</p>
          
          <ul>
            <li><strong>Right to Access:</strong> Request access to your personal information we hold</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete information</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your personal information (subject to legal requirements)</li>
            <li><strong>Right to Restriction:</strong> Request restriction of processing your information</li>
            <li><strong>Right to Data Portability:</strong> Request a copy of your information in a structured, machine-readable format</li>
            <li><strong>Right to Object:</strong> Object to processing of your information for certain purposes</li>
            <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for processing where consent was the basis</li>
          </ul>

          <p>To exercise these rights, please contact us at <strong>privacy@driveeasy.com</strong></p>
        </section>

        <section className="legal-section">
          <h2>7. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
            unless a longer retention period is required or permitted by law. Factors we consider in determining retention periods include:
          </p>
          <ul>
            <li>The duration of your relationship with us</li>
            <li>Legal and regulatory requirements</li>
            <li>Contractual obligations</li>
            <li>Tax and accounting purposes</li>
            <li>Dispute resolution and legal claims</li>
          </ul>
          <p>
            When your information is no longer needed, we will securely delete or anonymize it.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our service and store certain information. 
            Cookies are files with small amounts of data that may include an anonymous unique identifier.
          </p>
          
          <h3>Types of Cookies We Use:</h3>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
            <li><strong>Authentication Cookies:</strong> To keep you logged in and secure your session</li>
            <li><strong>Preference Cookies:</strong> To remember your settings and preferences</li>
            <li><strong>Analytics Cookies:</strong> To understand how you use our service</li>
          </ul>

          <p>
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. 
            However, if you do not accept cookies, you may not be able to use some portions of our service.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Third-Party Links</h2>
          <p>
            Our service may contain links to third-party websites or services that are not owned or controlled by us. 
            We have no control over and assume no responsibility for the content, privacy policies, or practices of any 
            third-party websites or services. We strongly advise you to review the privacy policy of every site you visit.
          </p>
        </section>

        <section className="legal-section">
          <h2>10. Children's Privacy</h2>
          <p>
            While our driving school services may be used by minors learning to drive, our online platform is not intended 
            for children under 16 years of age. We do not knowingly collect personal information from children under 16. 
            For users under 18, we require parental consent for account creation and enrollment.
          </p>
          <p>
            If you are a parent or guardian and you are aware that your child has provided us with personal information 
            without your consent, please contact us so we can take appropriate action.
          </p>
        </section>

        <section className="legal-section">
          <h2>11. International Data Transfers</h2>
          <p>
            Your information may be transferred to and maintained on computers located outside of your state, province, 
            country, or other governmental jurisdiction where data protection laws may differ from those in your jurisdiction.
          </p>
          <p>
            We will take all steps reasonably necessary to ensure that your data is treated securely and in accordance 
            with this Privacy Policy.
          </p>
        </section>

        <section className="legal-section">
          <h2>12. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by:
          </p>
          <ul>
            <li>Posting the new Privacy Policy on this page</li>
            <li>Updating the "Last Updated" date at the top of this policy</li>
            <li>Sending you an email notification (for significant changes)</li>
            <li>Displaying a prominent notice on our platform</li>
          </ul>
          <p>
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy 
            are effective when they are posted on this page.
          </p>
        </section>

        <section className="legal-section">
          <h2>13. Contact Us</h2>
          <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
          
          <div className="contact-info">
            <p><strong>DriveEasy Driving School</strong></p>
            <p>Email: <a href="mailto:privacy@driveeasy.com">privacy@driveeasy.com</a></p>
            <p>Phone: +91 12345 67890</p>
            <p>Address: 123 Driving Range Rd, New Delhi, 110001</p>
            <p>Data Protection Officer: dpo@driveeasy.com</p>
          </div>

          <p>
            We will respond to your inquiry within 30 days of receipt.
          </p>
        </section>

        <section className="legal-section acknowledgment">
          <h2>14. Consent and Acknowledgment</h2>
          <p>
            By using DriveEasy Driving School Management System, you acknowledge that you have read and understood 
            this Privacy Policy and agree to its terms. If you do not agree with this policy, please do not use our services.
          </p>
        </section>
      </div>

      {/* Footer */}
      <footer className="legal-footer">
        <p>&copy; {new Date().getFullYear()} DriveEasy Driving School. All rights reserved.</p>
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/terms">Terms of Service</a>
          <a href="/Login">Login</a>
        </div>
      </footer>
    </div>
  );
}

export default PrivacyPolicy;
