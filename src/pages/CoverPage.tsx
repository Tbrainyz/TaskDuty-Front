import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import broIllustration from "../assets/bro.svg";

const CoverPage = () => {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <NavBar variant="cover" />

      {/* Hero section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
          alignItems: "center",
          padding: "64px 80px",
        }}
      >
        {/* Left — text */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-start" }}>
          <h1
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: 38,
              lineHeight: 1.25,
              color: "#0f0f0f",
              margin: 0,
            }}
          >
            Manage your Tasks on
            <br />
            <span style={{ color: "#7c3aed" }}>TaskDuty</span>
          </h1>

          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 400,
              fontSize: 16,
              lineHeight: 1.75,
              color: "rgba(0,0,0,0.7)",
              margin: 0,
              maxWidth: 420,
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non tellus,
            sapien, morbi ante nunc euismod ac felis ac. Massa et, at platea
            tempus duis non eget. Hendrerit tortor fermentum bibendum mi nisl
            semper porttitor. Nec accumsan.
          </p>

          <Link
            to="/alltasks"
            style={{
              textDecoration: "none",
              padding: "12px 28px",
              borderRadius: 10,
              backgroundColor: "#7c3aed",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: "white",
            }}
          >
            Go to My Tasks
          </Link>
        </div>

        {/* Right — illustration */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              border: "2px solid #7c3aed",
              borderRadius: 12,
              overflow: "hidden",
              backgroundColor: "white",
              padding: 8,
              width: "100%",
              maxWidth: 500,
            }}
          >
            <img
              src={broIllustration}
              alt="Task management illustration"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverPage;
