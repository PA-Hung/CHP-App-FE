import { useSelector } from "react-redux";
import BrtLogo from "../../assets/brt.png";

const Logo = () => {
  const themeMode = useSelector((state) => state.theme.themeMode);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themeMode === "light" ? "white" : "#141414",
      }}
    >
      <div style={{ padding: "10px" }}>
        <img src={BrtLogo} alt="logo" style={{ width: 75, height: 25 }} />
      </div>
    </div>
  );
};

export default Logo;
