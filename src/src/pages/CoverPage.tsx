import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import broIllustration from "../assets/bro.svg";
import { useAuth } from "../context/AuthContext";

const F = "'Signika Negative', sans-serif";

const CoverPage = () => {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f0f5" }}>
      <NavBar variant={user ? "cover" : "guest"} />
      <div
        className="cover-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
          alignItems: "center",
          padding: "100px 80px 60px",
        }}
      >
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <h1
            className="cover-title"
            style={{ fontFamily: F, fontWeight: 700, fontSize: 42, lineHeight: 1.2, color: "#0f0f0f", margin: 0 }}
          >
            Manage your Tasks on
            <br />
            <span style={{ color: "#7c3aed" }}>TaskDuty</span>
          </h1>
          <p style={{ fontFamily: F, fontSize: 16, lineHeight: 1.8, color: "rgba(0,0,0,0.65)", margin: 0, maxWidth: 420 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non tellus,
            sapien, morbi ante nunc euismod ac felis ac. Massa et, at platea
            tempus duis non eget. Hendrerit tortor fermentum bibendum mi nisl
            semper porttitor. Nec accumsan.
          </p>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link
              to={user ? "/alltasks" : "/register"}
              style={{
                textDecoration: "none", display: "inline-block",
                padding: "13px 32px", borderRadius: 10,
                backgroundColor: "#7c3aed", fontFamily: F,
                fontWeight: 700, fontSize: 16, color: "white",
                boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
              }}
            >
              {user ? "Go to My Tasks" : "Get Started"}
            </Link>
            {!user && (
              <Link
                to="/login"
                style={{
                  textDecoration: "none", display: "inline-block",
                  padding: "13px 32px", borderRadius: 10,
                  backgroundColor: "white", fontFamily: F,
                  fontWeight: 700, fontSize: 16, color: "#7c3aed",
                  border: "1.5px solid #7c3aed",
                }}
              >
                Log In
              </Link>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="cover-img" style={{ display: "flex", justifyContent: "center" }}>
          <div style={{
            border: "2px solid #7c3aed", borderRadius: 14,
            overflow: "hidden", backgroundColor: "white",
            padding: 8, width: "100%", maxWidth: 500,
            boxShadow: "0 8px 32px rgba(124,58,237,0.15)",
          }}>
            <img src={broIllustration} alt="Task management illustration" style={{ width: "100%", height: "auto", display: "block" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverPage;
