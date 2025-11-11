import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './legal.css';

function PrivacyPolicy() {
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
            <Shield className="header-icon" size={48} />
            <h1 className="legal-title">Privacy Policy</h1>
            <p className="legal-subtitle">Last Updated: November 12, 2025</p>
          </div>
        </div>

        <div className="legal-content">
          <section className="legal-section intro">
            <p className="intro-text">
              At DriveEasy Driving School, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Driving School Management System.
            </p>
            <p className="intro-text">
              Please read this privacy policy carefully. By using our services, you consent to the practices described in this policy.
            </p>
          </section>

          <section className="legal-section">
            <h2><Database size={24} /> 1. Information We Collect</h2>
            
            <h3>1.1 Personal Information</h3>
            <p>
              When you register for our services, we collect the following personal information:
            </p>
            <ul>
              <li><strong>Contact Information:</strong> Name, email address, phone number, residential address</li>
              <li><strong>Identification:</strong> Date of birth, age verification</li>
              <li><strong>Account Credentials:</strong> Username, password (encrypted)</li>
              <li><strong>Course Information:</strong> Selected course type, skill level, preferences</li>
              <li><strong>Payment Information:</strong> Billing address, payment method details (processed securely through third-party payment processors)</li>
            </ul>

            <h3>1.2 Learner Information</h3>
            <ul>
              <li>Learner's permit number (when applicable)</li>
              <li>Previous driving experience</li>
              <li>Medical conditions relevant to driving (optional, for safety purposes)</li>
              <li>Emergency contact information</li>
            </ul>

            <h3>1.3 Usage Data</h3>
            <p>
              We automatically collect certain information when you use our platform:
            </p>
            <ul>
              <li>Login and access times</li>
              <li>Pages visited and features used</li>
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Referral source</li>
            </ul>

            <h3>1.4 Training Records</h3>
            <ul>
              <li>Lesson attendance and completion records</li>
              <li>Progress assessments and evaluations</li>
              <li>Instructor feedback and ratings</li>
              <li>Student feedback and comments</li>
              <li>Test scores and performance metrics</li>
            </ul>

            <h3>1.5 Communication Data</h3>
            <ul>
              <li>Messages exchanged through our platform</li>
              <li>Email communications</li>
              <li>Phone call records (for quality assurance)</li>
              <li>Support tickets and inquiries</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2><Eye size={24} /> 2. How We Use Your Information</h2>
            
            <h3>2.1 Service Delivery</h3>
            <p>
              We use your information to:
            </p>
            <ul>
              <li>Create and manage your account</li>
              <li>Schedule and coordinate driving lessons</li>
              <li>Match students with appropriate instructors</li>
              <li>Track your learning progress</li>
              <li>Provide personalized training recommendations</li>
              <li>Issue certificates upon course completion</li>
            </ul>

            <h3>2.2 Communication</h3>
            <ul>
              <li>Send lesson confirmations and reminders</li>
              <li>Notify you of schedule changes or cancellations</li>
              <li>Share important updates about your training</li>
              <li>Respond to your inquiries and support requests</li>
              <li>Send educational content and safety tips</li>
            </ul>

            <h3>2.3 Payment Processing</h3>
            <ul>
              <li>Process your payments securely</li>
              <li>Generate invoices and receipts</li>
              <li>Handle refunds and disputes</li>
              <li>Maintain financial records as required by law</li>
            </ul>

            <h3>2.4 Service Improvement</h3>
            <ul>
              <li>Analyze usage patterns to improve our platform</li>
              <li>Conduct research and development</li>
              <li>Gather feedback to enhance our training programs</li>
              <li>Monitor and maintain system security</li>
            </ul>

            <h3>2.5 Marketing and Promotions</h3>
            <ul>
              <li>Send promotional offers and special discounts (with your consent)</li>
              <li>Share news about new courses and features</li>
              <li>Conduct surveys and request feedback</li>
            </ul>
            <p className="note">
              <strong>Note:</strong> You can opt-out of marketing communications at any time by clicking the unsubscribe link in emails or updating your notification preferences in your account settings.
            </p>
          </section>

          <section className="legal-section">
            <h2><Lock size={24} /> 3. Information Sharing and Disclosure</h2>
            
            <h3>3.1 Internal Sharing</h3>
            <p>
              Your information is shared within DriveEasy only with:
            </p>
            <ul>
              <li><strong>Instructors:</strong> Access to student profiles, progress records, and scheduling information</li>
              <li><strong>Administrative Staff:</strong> For customer support, billing, and operational purposes</li>
              <li><strong>Management:</strong> Aggregated data for business analysis (de-identified when possible)</li>
            </ul>

            <h3>3.2 Third-Party Service Providers</h3>
            <p>
              We may share your information with trusted third parties who assist us in operating our business:
            </p>
            <ul>
              <li><strong>Payment Processors:</strong> To handle transactions securely (e.g., Stripe, Razorpay)</li>
              <li><strong>Communication Services:</strong> For email and SMS notifications</li>
              <li><strong>Cloud Storage Providers:</strong> For secure data storage and backup</li>
              <li><strong>Analytics Services:</strong> To understand platform usage (anonymized data)</li>
            </ul>
            <p>
              All third-party providers are contractually obligated to maintain the confidentiality and security of your information.
            </p>

            <h3>3.3 Legal Requirements</h3>
            <p>
              We may disclose your information when required by law or to:
            </p>
            <ul>
              <li>Comply with legal processes (court orders, subpoenas)</li>
              <li>Enforce our Terms of Service</li>
              <li>Protect our rights, property, or safety</li>
              <li>Protect the rights and safety of our users and the public</li>
              <li>Respond to licensing authority requests for verification</li>
            </ul>

            <h3>3.4 Business Transfers</h3>
            <p>
              In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity. We will notify you of any such change and its implications for your data.
            </p>

            <h3>3.5 With Your Consent</h3>
            <p>
              We may share your information in other situations with your explicit consent.
            </p>
          </section>

          <section className="legal-section">
            <h2><Shield size={24} /> 4. Data Security</h2>
            
            <h3>4.1 Security Measures</h3>
            <p>
              We implement industry-standard security measures to protect your information:
            </p>
            <ul>
              <li><strong>Encryption:</strong> All data transmission uses SSL/TLS encryption</li>
              <li><strong>Password Protection:</strong> Passwords are hashed and salted using secure algorithms</li>
              <li><strong>Access Controls:</strong> Role-based access restrictions to limit data exposure</li>
              <li><strong>Secure Servers:</strong> Data stored on protected servers with regular security updates</li>
              <li><strong>Monitoring:</strong> Continuous monitoring for suspicious activities</li>
              <li><strong>Backup Systems:</strong> Regular data backups to prevent loss</li>
              <li><strong>Firewall Protection:</strong> Network security to prevent unauthorized access</li>
            </ul>

            <h3>4.2 Employee Training</h3>
            <p>
              All employees and instructors are trained on:
            </p>
            <ul>
              <li>Data privacy principles</li>
              <li>Secure handling of personal information</li>
              <li>Recognizing and reporting security threats</li>
              <li>Compliance with privacy regulations</li>
            </ul>

            <h3>4.3 Data Breach Protocol</h3>
            <p>
              In the unlikely event of a data breach:
            </p>
            <ul>
              <li>We will investigate and contain the breach immediately</li>
              <li>Affected users will be notified within 72 hours</li>
              <li>We will report the breach to relevant authorities as required</li>
              <li>Steps will be taken to prevent future incidents</li>
            </ul>

            <h3>4.4 Your Responsibility</h3>
            <p>
              You can help protect your information by:
            </p>
            <ul>
              <li>Using strong, unique passwords</li>
              <li>Not sharing your login credentials</li>
              <li>Logging out after each session on shared devices</li>
              <li>Reporting any suspicious activity immediately</li>
              <li>Keeping your contact information up to date</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2><UserCheck size={24} /> 5. Your Privacy Rights</h2>
            
            <h3>5.1 Access and Correction</h3>
            <p>
              You have the right to:
            </p>
            <ul>
              <li>Access your personal information stored in our system</li>
              <li>Request a copy of your data in a portable format</li>
              <li>Update or correct inaccurate information</li>
              <li>Review your training records and progress reports</li>
            </ul>

            <h3>5.2 Data Deletion</h3>
            <p>
              You can request deletion of your account and personal information. Please note:
            </p>
            <ul>
              <li>We must retain certain records for legal and accounting purposes (minimum 3 years)</li>
              <li>Aggregated, anonymized data may be retained for statistical purposes</li>
              <li>Deletion requests are processed within 30 days</li>
              <li>Some cached data may remain in our backup systems temporarily</li>
            </ul>

            <h3>5.3 Opt-Out Rights</h3>
            <ul>
              <li><strong>Marketing Communications:</strong> Unsubscribe from promotional emails at any time</li>
              <li><strong>SMS Notifications:</strong> Reply STOP to opt-out of text messages</li>
              <li><strong>Push Notifications:</strong> Disable in your device settings</li>
              <li><strong>Cookies:</strong> Manage preferences in your browser settings</li>
            </ul>

            <h3>5.4 Data Portability</h3>
            <p>
              You can request your data in a structured, commonly used format (CSV, PDF) for transfer to another service provider.
            </p>

            <h3>5.5 Objection and Restriction</h3>
            <ul>
              <li>Object to processing of your data for certain purposes</li>
              <li>Request restriction of processing in specific circumstances</li>
              <li>Withdraw consent for data processing (where consent-based)</li>
            </ul>

            <h3>5.6 How to Exercise Your Rights</h3>
            <p>
              To exercise any of these rights, contact us at:
            </p>
            <ul>
              <li>Email: privacy@driveeasy.com</li>
              <li>Phone: +91 12345 67890</li>
              <li>Submit request through your account settings</li>
            </ul>
            <p>
              We will respond to all requests within 30 days.
            </p>
          </section>

          <section className="legal-section">
            <h2><Database size={24} /> 6. Data Retention</h2>
            
            <h3>6.1 Active Accounts</h3>
            <ul>
              <li>Personal information retained while your account is active</li>
              <li>Training records maintained throughout your enrollment</li>
              <li>Communication history stored for reference</li>
            </ul>

            <h3>6.2 Inactive Accounts</h3>
            <ul>
              <li>Accounts inactive for 2 years may be archived</li>
              <li>You'll receive notice before archiving</li>
              <li>Archived data can be restored upon request</li>
            </ul>

            <h3>6.3 After Account Closure</h3>
            <ul>
              <li><strong>Financial Records:</strong> Retained for 7 years (legal requirement)</li>
              <li><strong>Training Records:</strong> Retained for 5 years (for certification verification)</li>
              <li><strong>Communication Records:</strong> Deleted after 1 year</li>
              <li><strong>Usage Data:</strong> Anonymized and aggregated after 1 year</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2><Bell size={24} /> 7. Cookies and Tracking Technologies</h2>
            
            <h3>7.1 Types of Cookies We Use</h3>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for platform functionality (login, security)</li>
              <li><strong>Performance Cookies:</strong> Help us understand how you use our site</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Analytics Cookies:</strong> Collect anonymized usage statistics</li>
            </ul>

            <h3>7.2 Managing Cookies</h3>
            <p>
              You can control cookies through your browser settings. However, disabling certain cookies may affect platform functionality.
            </p>

            <h3>7.3 Third-Party Cookies</h3>
            <p>
              Some third-party services (payment processors, analytics) may set their own cookies. Please review their privacy policies for details.
            </p>
          </section>

          <section className="legal-section">
            <h2><UserCheck size={24} /> 8. Children's Privacy</h2>
            <p>
              Our services are designed for users aged 16 and above for two-wheeler training, and 18 and above for four-wheeler and heavy vehicle training.
            </p>
            <ul>
              <li>We do not knowingly collect information from children under 16</li>
              <li>Parental consent required for users aged 16-17</li>
              <li>Parents/guardians can review their minor's information</li>
              <li>If we learn we've collected data from a child inappropriately, we will delete it immediately</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2><Shield size={24} /> 9. International Data Transfers</h2>
            <p>
              Your information is primarily stored and processed in India. If data is transferred internationally:
            </p>
            <ul>
              <li>We ensure adequate protection measures are in place</li>
              <li>Transfers comply with applicable data protection laws</li>
              <li>Standard contractual clauses are used when necessary</li>
              <li>You will be informed of any international transfers</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2><Lock size={24} /> 10. Changes to Privacy Policy</h2>
            <p>
              We may update this Privacy Policy periodically to reflect:
            </p>
            <ul>
              <li>Changes in our data practices</li>
              <li>New legal requirements</li>
              <li>Platform updates and new features</li>
              <li>User feedback and best practices</li>
            </ul>
            <p>
              <strong>Notification of Changes:</strong>
            </p>
            <ul>
              <li>Email notification for significant changes</li>
              <li>Updated "Last Updated" date at the top of this policy</li>
              <li>In-platform notification upon next login</li>
              <li>30-day notice period before major changes take effect</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2><Bell size={24} /> 11. Contact Us</h2>
            <p>
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="contact-info">
              <p><strong>Data Protection Officer</strong></p>
              <p>DriveEasy Driving School</p>
              <p>123 Driving Range Rd, New Delhi, 110001</p>
              <p><strong>Email:</strong> privacy@driveeasy.com</p>
              <p><strong>Phone:</strong> +91 12345 67890</p>
              <p><strong>Hours:</strong> Monday-Saturday, 9:00 AM - 6:00 PM</p>
            </div>
            <p className="note">
              We aim to respond to all privacy-related inquiries within 48 hours.
            </p>
          </section>

          <section className="legal-section">
            <h2><Shield size={24} /> 12. Regulatory Compliance</h2>
            <p>
              DriveEasy complies with:
            </p>
            <ul>
              <li>Information Technology Act, 2000 (India)</li>
              <li>Personal Data Protection Bill (India)</li>
              <li>ISO 27001 Information Security Management standards</li>
              <li>Payment Card Industry Data Security Standard (PCI DSS)</li>
            </ul>
          </section>

          <div className="legal-agreement privacy">
            <Shield size={24} className="agreement-icon" />
            <p>
              <strong>Your Privacy Matters:</strong> By using DriveEasy services, you acknowledge that you have read and understood this Privacy Policy and consent to the collection, use, and disclosure of your information as described herein.
            </p>
          </div>
        </div>

        <div className="legal-footer">
          <button onClick={() => navigate('/')} className="back-home-btn">
            Back to Home
          </button>
          <a href="/terms" className="legal-link-footer">Terms of Service</a>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
