import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Feed() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    console.log(token);

    return (
        <>
            <h1>Feed</h1>

            <button onClick={() => navigate("/me")}>
                Go to Profile
            </button>
        </>
    );
}