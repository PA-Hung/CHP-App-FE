import { useEffect, useState } from "react";
import BrtLogo from "./assets/brt.png";
import "./styles/app.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAccount,
  setLogoutAction,
  setUserLoginInfo,
} from "./redux/slice/authSlice";
import { useNavigate } from "react-router-dom";

function App() {
  const account = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAccount());
  }, []);

  //console.log(">>>isAuthenticated", isAuthenticated);

  return (
    <div className="home">
      <div>
        <div className="home">
          <div>
            <img src={BrtLogo} className="logo" alt="brt logo" />
          </div>
          <h1>BRT Phòng Chuyên Đề</h1>
          <div className="card">
            <button onClick={() => navigate("/login")}>Login</button>
          </div>
          <p className="read-the-docs">BRT Home</p>
        </div>
      </div>
    </div>
  );
}

export default App;
