import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "sweetalert2/dist/sweetalert2.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";
import Register from "./page/Register";
import ContentWrap from "./components/wrapper/ContentWrap";
import TablePage from "./page/TablePage";
import PageConfirm from "./page/PageConfirm";
import PageEdit from "./page/PageEdit";
export default function App() {
  const location = useLocation();
  return (
    <div>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<ContentWrap content={Register} />} />
        <Route path="/table" element={<ContentWrap content={TablePage} />} />
        <Route
          path="/confirm"
          element={<ContentWrap content={PageConfirm} />}
        />
        <Route path="/edit" element={<ContentWrap content={PageEdit} />} />
      </Routes>
    </div>
  );
}
