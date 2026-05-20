import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// App Pages
import Dashboard from './pages/dashboard/Dashboard';
import StudentList from './pages/students/StudentList';
import TeacherList from './pages/teachers/TeacherList';
import ClassList from './pages/classes/ClassList';
import SubjectList from './pages/subjects/SubjectList';
import Attendance from './pages/attendance/Attendance';
import ExamList from './pages/exams/ExamList';
import FeeManagement from './pages/fees/FeeManagement';
import NoticeBoard from './pages/notices/NoticeBoard';
import Timetable from './pages/timetable/Timetable';
import Settings from './pages/settings/Settings';

const App = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950 bg-grid">
        <div className="bg-gradient-radial fixed inset-0" />
        <div className="relative z-10">
          <LoadingSpinner size="xl" text="Loading School ERP..." />
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/students" element={<ProtectedRoute><Layout><StudentList /></Layout></ProtectedRoute>} />
      <Route path="/teachers" element={<ProtectedRoute><Layout><TeacherList /></Layout></ProtectedRoute>} />
      <Route path="/classes" element={<ProtectedRoute><Layout><ClassList /></Layout></ProtectedRoute>} />
      <Route path="/subjects" element={<ProtectedRoute><Layout><SubjectList /></Layout></ProtectedRoute>} />
      <Route path="/attendance" element={<ProtectedRoute><Layout><Attendance /></Layout></ProtectedRoute>} />
      <Route path="/exams" element={<ProtectedRoute><Layout><ExamList /></Layout></ProtectedRoute>} />
      <Route path="/fees" element={<ProtectedRoute><Layout><FeeManagement /></Layout></ProtectedRoute>} />
      <Route path="/notices" element={<ProtectedRoute><Layout><NoticeBoard /></Layout></ProtectedRoute>} />
      <Route path="/timetable" element={<ProtectedRoute><Layout><Timetable /></Layout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
