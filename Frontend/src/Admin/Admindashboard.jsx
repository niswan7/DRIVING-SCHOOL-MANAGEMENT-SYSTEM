import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, Settings, FileText, MessageSquare, 
    BookOpen, CreditCard, Users, LogOut, UserPlus, Trash2, Edit3, Search, ArrowLeft,
    History, CheckSquare, FilePlus, Edit
} from 'lucide-react';
import './Admindashboard.css';
import { Navigation } from 'lucide-react';

function AdminDashboard() {
  const [view, setView] = useState('dashboard'); // 'dashboard', 'manageUsers', 'managePayments', etc.

  const navigate = (newView) => {
    setView(newView);
  };
  
  const handleLogout = () => {
    alert("Loging Out");
    window.location.href = '/';
  };

  const renderView = () => {
    switch (view) {
      case 'manageUsers':
        return <ManageUsersView navigate={navigate} />;
      case 'managePayments':
        return <ManagePaymentsView navigate={navigate} />;
      case 'overseeReports':
        return <PlaceholderView title="Oversee Reports" icon={FileText} navigate={navigate} />;
      case 'monitorFeedback':
        return <PlaceholderView title="Monitor Feedback" icon={MessageSquare} navigate={navigate} />;
      case 'manageCourses':
        return <PlaceholderView title="Manage Courses" icon={BookOpen} navigate={navigate} />;
      case 'configureNotifications':
        return <PlaceholderView title="Configure Notifications" icon={Settings} navigate={navigate} />;
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
  const initialUsers = [
    { id: 1, name: 'Priya Sharma', email: 'priya.sharma@example.com', role: 'Admin' },
    { id: 2, name: 'Rajesh Kumar', email: 'rajesh.kumar@example.com', role: 'Instructor' },
    { id: 3, name: 'Anjali Singh', email: 'anjali.singh@example.com', role: 'Student' },
    { id: 4, name: 'Vikram Mehta', email: 'vikram.mehta@example.com', role: 'Student' },
  ];

  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleCreateUser = () => alert("Modal to create user would open here.");
  const handleEditUser = (id) => alert(`Modal to edit user ${id} would open here.`);
  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
        setUsers(users.filter(user => user.id !== id));
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
        <div className="table-section">
            <table id="usersTable">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td><span className={`role-badge role-${user.role.toLowerCase()}`}>{user.role}</span></td>
                            <td className="actions">
                                <button className="btn btn-edit" onClick={() => handleEditUser(user.id)}><Edit3 size={16} /> Edit</button>
                                <button className="btn btn-delete" onClick={() => handleDeleteUser(user.id)}><Trash2 size={16} /> Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </main>
  );
}

// --- Manage Payments View ---
function ManagePaymentsView({ navigate }) {
    return (
        <main className="manage-generic-container">
            <div className="manage-users-controls">
                 <button className="btn-back" onClick={() => navigate('dashboard')}>
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>
            </div>
            <div className="admin-card-container">
                <PaymentActionCard
                    icon={History}
                    title="View Payment History"
                    description="Check historical transactions and records."
                    buttonText="View History"
                />
                <PaymentActionCard
                    icon={CheckSquare}
                    title="Verify & Approve Payments"
                    description="Review and approve pending payments."
                    buttonText="Verify Payments"
                />
                <PaymentActionCard
                    icon={FilePlus}
                    title="Create New Payment Request"
                    description="Request instructor payouts or student refunds."
                    buttonText="Create Request"
                />
                 <PaymentActionCard
                    icon={Edit}
                    title="Update Payment Records"
                    description="Edit payment details or fix any errors."
                    buttonText="Update Records"
                />
            </div>
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

const PaymentActionCard = ({ icon: Icon, title, description, buttonText }) => (
    <div className="payment-card">
        <Icon size={32} className="admin-card-icon" />
        <h3>{title}</h3>
        <p>{description}</p>
        <button className="btn btn-create">{buttonText}</button>
    </div>
);
export default AdminDashboard;