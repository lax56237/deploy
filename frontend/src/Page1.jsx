import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Page1() {
    const [name, setName] = useState("");
    const [userId, setUserId] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const res = await axios.post("http://localhost:5000/register", {
                name,
                userId,
            });
            localStorage.setItem("token", res.data.token);
            navigate("/page2");
        } catch (err) {
            console.error(err);
            alert("Error registering user");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Register User</h2>
            <input
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <br /><br />
            <input
                type="text"
                placeholder="Enter User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />
            <br /><br />
            <button onClick={handleRegister}>Submit</button>
        </div>
    );
}

export default Page1;
