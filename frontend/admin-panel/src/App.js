import React from 'react';
import { ToastContainer } from 'react-toastify';
import { ReviewsProvider } from './context/ReviewsContext';
import 'react-toastify/dist/ReactToastify.css';
import Homepage from './components/Screens/Dashboard/homepage';
import Profile from './components/Screens/Profile/Profile';
import Dashboard from './components/Screens/Dashboard/Dashboard';
import Category from './components/Screens/Categeory/Category';
import Tags from './components/Screens/Tags/Tags';
import Blog from './components/Screens/Blog/Blog';
import Register from './components/Screens/onboarding/Register';
import Login from './components/Screens/onboarding/Login';
import User from './components/Screens/Users/User';
import Media from './components/Screens/Media/Media'
import { Routes, Route } from 'react-router-dom';
import AddInterview from './components/Screens/Interview/AddInterview';
import AllInterviews from './components/Screens/Interview/AllInterviews';
import PrivateRoute from './components/Routes/PrivateRoute'; 
import './App.css'; 
import AddServices from './components/Screens/Services/AddServices';
import AllServices from './components/Screens/Services/AllServices';
import ServiceCategory from './components/Screens/Services/ServiceCategory';
import Faq from './components/Screens/FAQ/Faq';
import ReviewsPage from './components/Screens/Users/ReviewsPage';
function App() {
  return (<ReviewsProvider>
    <div>
      <Routes>
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Homepage />
            </PrivateRoute>
          }
        >
          <Route path="AddServices" element={<AddServices />} />
          <Route path="AllServices" element={<AllServices />} />
          <Route index element={<Dashboard />} />
          <Route path="blog" element={<Blog />} />
          <Route path="category" element={<Category />} />
          <Route path="tags" element={<Tags />} />
          <Route path="user" element={<User />} />
          <Route path="faqs" element={<Faq />} />
          <Route path="media" element={<Media />} />
          <Route path="dash" element={<Dashboard />} />
          <Route path="/ADDInterview" element={<AddInterview />} />
          <Route path="/AllInterviews" element={<AllInterviews />} />
          <Route path="ServiceCategories" element={<ServiceCategory />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Public Routes */}
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={2000} />
    </div></ReviewsProvider>
  );
}

export default App;
