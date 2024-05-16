import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import AdminPdfUpload from "./pages/admin-pdf-upload";
import AdminPdfUpload2 from "./pages/admin-pdf-upload-2";
import AdminPdfUpload3 from "./pages/admin-pdf-upload-3";
import UserSearch from "./pages/user-search";
import Results from "./pages/results/results";
import Dashboard from "./pages/dashboard/dashboard";
import PdfView from "./pages/pdf-view/view";
import AllBooks from "./pages/all-books/all_books";
import How from "./pages/how/how";


function App() {
  return (
    <div className="App">
      {/* <Navbar /> */}

      <Routes>
        {/* <Route path="/" element={<Results />} /> */}
        <Route path="/" element={<UserSearch />} />
        <Route path="/admin" element={<AdminPdfUpload2 />} />
        <Route path="/upload-success" element={<AdminPdfUpload3 />} />
        <Route path="/results" element={<Results />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/view-pdf" element={<PdfView />} />
        <Route path="/all-books" element={<AllBooks />} />
        <Route path="/how" element={<How />} />
        
      </Routes>
    </div>
  );
}

export default App;
