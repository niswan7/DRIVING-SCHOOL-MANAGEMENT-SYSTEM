import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, Settings, FileText, MessageSquare, 
    BookOpen, CreditCard, Users, LogOut, UserPlus, Trash2, Edit3, Search, ArrowLeft,
    History, CheckSquare, FilePlus, Edit, X
} from 'lucide-react';
import './Admindashboard.css';
import './modal.css';
import { Navigation } from 'lucide-react';
import { apiRequest, getCurrentUser, logout } from '../utils/apiHelper';
import { API_ENDPOINTS } from '../config/api';

import OverseeReports from './OverseeReports';
import AdminFeedback from './AdminFeedback';
import AdminNotifications from './AdminNotifications';

function AdminDashboard() {
  const [view, setView] = useState('dashboard'); // 'dashboard', 'manageUsers', 'managePayments', etc.

  const navigate = (newView) => {
    setView(newView);
  };
  
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const renderView = () => {
    switch (view) {
      case 'manageUsers':
        return <ManageUsersView navigate={navigate} />;
      case 'managePayments':
        return <ManagePaymentsView navigate={navigate} />;
      case 'overseeReports':
        return <OverseeReports navigate={navigate} />;
      case 'monitorFeedback':
        return <AdminFeedback navigate={navigate} />;
      case 'manageCourses':
        return <ManageCoursesView navigate={navigate} />;
      case 'configureNotifications':
        return <AdminNotifications navigate={navigate} />;
      case 'dashboard':
      default:
        return <AdminDashboardView navigate={navigate} />;
    }
  };

  const getHeaderIcon = () => {
    switch (view) {
        case 'manageUsers': return Users;
        case 'managePayments': return CreditCard;
        case 'overseeReports': return FileText;
        case 'monitorFeedback': return MessageSquare;
        case 'manageCourses': return BookOpen;
        case 'configureNotifications': return Settings;
        default: return LayoutDashboard;
    }
  };

  const getHeaderTitle = () => {
     switch (view) {
        case 'manageUsers': return 'Manage Users';
        case 'managePayments': return 'Manage Payments';
        case 'overseeReports': return 'Oversee Reports';
        case 'monitorFeedback': return 'Monitor Feedback';
        case 'manageCourses': return 'Manage Courses';
        case 'configureNotifications': return 'Configure Notifications';
        default: return 'Administrator Dashboard';
    }
  };
  
  const HeaderIcon = getHeaderIcon();

  return (
    <div className="admin-dashboard-container">
      <header className="admin-header">
        <div className="admin-header-content">
          <HeaderIcon size={40} />
          <h1>{getHeaderTitle()}</h1>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </header>
      
      {renderView()}

      <footer className="admin-footer">
        <p>&copy; 2025 Driving School Management System</p>
      </footer>
    </div>
  );
}


// --- Admin Dashboard View ---
function AdminDashboardView({ navigate }) {
  return (
    <main className="admin-card-container">
      <AdminCard 
        icon={FileText} 
        title="Oversee Reports" 
        description="View, analyze, and export system and user reports."
        onClick={() => navigate('overseeReports')}
      />
      <AdminCard 
        icon={MessageSquare} 
        title="Monitor Feedback" 
        description="Check user feedback and suggestions in real-time."
        onClick={() => navigate('monitorFeedback')}
      />
      <AdminCard 
        icon={BookOpen} 
        title="Manage Courses" 
        description="Add, edit, or remove driving courses and modules."
        onClick={() => navigate('manageCourses')}
      />
      <AdminCard 
        icon={Settings} 
        title="Configure Notifications" 
        description="Manage system alerts and notification preferences."
        onClick={() => navigate('configureNotifications')}
      />
      <AdminCard 
        icon={CreditCard} 
        title="Manage Payments" 
        description="Oversee transaction history and payment gateways."
        onClick={() => navigate('managePayments')}
      />
      <AdminCard 
        icon={Users} 
        title="Manage Users" 
        description="Add, remove, or update user roles and profiles."
        onClick={() => navigate('manageUsers')}
      />
    </main>
  );
}

// --- Manage Users View ---
function ManageUsersView({ navigate }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    role: 'student',
    dateOfBirth: '',
    address: { street: '', city: '', state: '', zipCode: '' }
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest(API_ENDPOINTS.USERS, {
        method: 'GET'
      });
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      alert('Error fetching users: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleCreateUser = () => {
    setEditingUser(null);
    setFormData({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      phone: '',
      role: 'student',
      dateOfBirth: '',
      address: { street: '', city: '', state: '', zipCode: '' }
    });
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username || '',
      email: user.email || '',
      password: '',
      phone: user.phone || '',
      role: user.role || 'student',
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
      address: user.address || { street: '', city: '', state: '', zipCode: '' }
    });
    setShowModal(true);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await apiRequest(API_ENDPOINTS.USER_BY_ID(id), {
          method: 'DELETE'
        });
        if (response.success) {
          alert('User deleted successfully');
          fetchUsers();
        }
      } catch (error) {
        alert('Error deleting user: ' + error.message);
      }
    }
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingUser) {
        // Update existing user
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password; // Don't send empty password
        }
        const response = await apiRequest(API_ENDPOINTS.USER_BY_ID(editingUser._id), {
          method: 'PUT',
          body: JSON.stringify(updateData)
        });
        if (response.success) {
          alert('User updated successfully');
          setShowModal(false);
          fetchUsers();
        }
      } else {
        // Create new user
        const response = await apiRequest(API_ENDPOINTS.REGISTER, {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        if (response.success) {
          alert('User created successfully');
          setShowModal(false);
          fetchUsers();
        }
      }
    } catch (error) {
      alert('Error saving user: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <main className="manage-users-container">
        <div className="manage-users-controls">
            <button className="btn-back" onClick={() => navigate('dashboard')}>
                <ArrowLeft size={20} /> Back to Dashboard
            </button>
            <div className="search-wrapper">
                <Search size={20} className="search-icon" />
                <input 
                    type="text" 
                    id="searchInput" 
                    placeholder="Search by name, email, or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button className="btn btn-create" onClick={handleCreateUser}>
                <UserPlus size={18} /> Create User
            </button>
        </div>
        {isLoading && <div style={{textAlign: 'center', padding: '20px'}}>Loading...</div>}
        <div className="table-section">
            <table id="usersTable">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user._id}>
                            <td>{user.firstName} {user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td><span className={`role-badge role-${user.role.toLowerCase()}`}>{user.role}</span></td>
                            <td className="actions">
                                <button className="btn btn-edit" onClick={() => handleEditUser(user)}><Edit3 size={16} /> Edit</button>
                                <button className="btn btn-delete" onClick={() => handleDeleteUser(user._id)}><Trash2 size={16} /> Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* User Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingUser ? 'Edit User' : 'Create New User'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmitUser} className="modal-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleFormChange} required />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleFormChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Username *</label>
                    <input type="text" name="username" value={formData.username} onChange={handleFormChange} required disabled={editingUser} />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleFormChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Password {!editingUser && '*'}</label>
                    <input type="password" name="password" value={formData.password} onChange={handleFormChange} required={!editingUser} placeholder={editingUser ? 'Leave blank to keep current' : ''} />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Role *</label>
                    <select name="role" value={formData.role} onChange={handleFormChange} required>
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleFormChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Street Address</label>
                  <input type="text" name="address.street" value={formData.address.street} onChange={handleFormChange} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input type="text" name="address.city" value={formData.address.city} onChange={handleFormChange} />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input type="text" name="address.state" value={formData.address.state} onChange={handleFormChange} />
                  </div>
                  <div className="form-group">
                    <label>Zip Code</label>
                    <input type="text" name="address.zipCode" value={formData.address.zipCode} onChange={handleFormChange} />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-create" disabled={isLoading}>
                    {isLoading ? 'Saving...' : (editingUser ? 'Update User' : 'Create User')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </main>
  );
}

// --- Manage Payments View ---
function ManagePaymentsView({ navigate }) {
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        setIsLoading(true);
        try {
            const response = await apiRequest(API_ENDPOINTS.PAYMENTS, {
                method: 'GET'
            });
            if (response.success) {
                setPayments(response.data);
            }
        } catch (error) {
            alert('Error fetching payments: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProcessPayment = async (id) => {
        try {
            const response = await apiRequest(API_ENDPOINTS.PROCESS_PAYMENT(id), {
                method: 'PUT'
            });
            if (response.success) {
                alert('Payment processed successfully');
                fetchPayments();
            }
        } catch (error) {
            alert('Error processing payment: ' + error.message);
        }
    };

    return (
        <main className="manage-generic-container">
            <div className="manage-users-controls">
                <button className="btn-back" onClick={() => navigate('dashboard')}>
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>
            </div>
            {isLoading && <div style={{textAlign: 'center', padding: '20px'}}>Loading...</div>}
            <div className="table-section">
                <h3>Payment Records</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map(payment => (
                            <tr key={payment._id}>
                                <td>{payment.studentId?.firstName} {payment.studentId?.lastName}</td>
                                <td>${payment.amount}</td>
                                <td>{payment.paymentMethod}</td>
                                <td><span className={`status-badge status-${payment.status}`}>{payment.status}</span></td>
                                <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                                <td>
                                    {payment.status === 'pending' && (
                                        <button className="btn btn-create" onClick={() => handleProcessPayment(payment._id)}>
                                            Process
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

// --- Manage Courses View ---
function ManageCoursesView({ navigate }) {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: '',
        price: '',
        type: 'practical'
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setIsLoading(true);
        try {
            const response = await apiRequest(API_ENDPOINTS.COURSES, {
                method: 'GET'
            });
            if (response.success) {
                setCourses(response.data);
            }
        } catch (error) {
            alert('Error fetching courses: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateCourse = () => {
        setEditingCourse(null);
        setFormData({
            title: '',
            description: '',
            duration: '',
            price: '',
            type: 'practical'
        });
        setShowModal(true);
    };

    const handleEditCourse = (course) => {
        setEditingCourse(course);
        setFormData({
            title: course.title || '',
            description: course.description || '',
            duration: course.duration || '',
            price: course.price || '',
            type: course.type || 'practical'
        });
        setShowModal(true);
    };

    const handleDeleteCourse = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                const response = await apiRequest(API_ENDPOINTS.COURSE_BY_ID(id), {
                    method: 'DELETE'
                });
                if (response.success) {
                    alert('Course deleted successfully');
                    fetchCourses();
                }
            } catch (error) {
                alert('Error deleting course: ' + error.message);
            }
        }
    };

    const handleSubmitCourse = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (editingCourse) {
                const response = await apiRequest(API_ENDPOINTS.COURSE_BY_ID(editingCourse._id), {
                    method: 'PUT',
                    body: JSON.stringify(formData)
                });
                if (response.success) {
                    alert('Course updated successfully');
                    setShowModal(false);
                    fetchCourses();
                }
            } else {
                const response = await apiRequest(API_ENDPOINTS.COURSES, {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
                if (response.success) {
                    alert('Course created successfully');
                    setShowModal(false);
                    fetchCourses();
                }
            }
        } catch (error) {
            alert('Error saving course: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <main className="manage-users-container">
            <div className="manage-users-controls">
                <button className="btn-back" onClick={() => navigate('dashboard')}>
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>
                <button className="btn btn-create" onClick={handleCreateCourse}>
                    <FilePlus size={18} /> Create Course
                </button>
            </div>
            {isLoading && <div style={{textAlign: 'center', padding: '20px'}}>Loading...</div>}
            <div className="table-section">
                <table>
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Type</th>
                            <th>Duration</th>
                            <th>Price</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(course => (
                            <tr key={course._id}>
                                <td>{course.title}</td>
                                <td><span className={`role-badge role-${course.type}`}>{course.type}</span></td>
                                <td>{course.duration} hours</td>
                                <td>${course.price}</td>
                                <td className="actions">
                                    <button className="btn btn-edit" onClick={() => handleEditCourse(course)}><Edit3 size={16} /> Edit</button>
                                    <button className="btn btn-delete" onClick={() => handleDeleteCourse(course._id)}><Trash2 size={16} /> Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Course Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingCourse ? 'Edit Course' : 'Create New Course'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmitCourse} className="modal-form">
                            <div className="form-group">
                                <label>Course Name *</label>
                                <input type="text" class="course_name_txt" name="title" value={formData.title} onChange={handleFormChange} required />
                            </div>
                            <div className="form-group">
                                <label>Description *</label>
                                <textarea name="description" value={formData.description} onChange={handleFormChange} required rows="4" />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Duration (hours) *</label>
                                    <input type="number" name="duration" value={formData.duration} onChange={handleFormChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Price ($) *</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleFormChange} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Type *</label>
                                <select name="type" value={formData.type} onChange={handleFormChange} required>
                                    <option value="practical">Practical</option>
                                    <option value="theory">Theory</option>
                                    <option value="combined">Combined</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-create" disabled={isLoading}>
                                    {isLoading ? 'Saving...' : (editingCourse ? 'Update Course' : 'Create Course')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}

// --- Placeholder for other admin views ---
function PlaceholderView({ title, icon: Icon, navigate }) {
    return (
        <main className="manage-generic-container placeholder-view">
            <div className="manage-users-controls">
                 <button className="btn-back" onClick={() => navigate('dashboard')}>
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>
            </div>
            <div className="placeholder-content">
                <Icon size={60} className="placeholder-icon"/>
                <h2>{title}</h2>
                <p>This section is under construction. Functionality will be added soon.</p>
            </div>
        </main>
    );
}


// --- Reusable Child Components ---
const AdminCard = ({ icon: Icon, title, description, onClick }) => (
  <div className="admin-card" onClick={onClick}>
    <Icon size={32} className="admin-card-icon" />
    <div className="admin-card-title">{title}</div>
    <div className="admin-card-description">{description}</div>
  </div>
);

export default AdminDashboard;
