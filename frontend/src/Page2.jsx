import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Page2() {
    const [searchId, setSearchId] = useState("");
    const [result, setResult] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }
            try {
                const res = await axios.get("https://deploy-znae.onrender.com/auth", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.data.valid) navigate("/");
            } catch {
                navigate("/");
            }
        };
        checkAuth();
    }, [navigate]);

    const handleSearch = async () => {
        try {
            const res = await axios.get(`https://deploy-znae.onrender.com/find/${searchId}`);
            if (res.data.name) setResult(`User Found: ${res.data.name}`);
            else setResult("No user found");
        } catch {
            setResult("Error searching user");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Search User</h2>
            <input
                type="text"
                placeholder="Enter User ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
            />
            <br /><br />
            <button onClick={handleSearch}>Find User</button>
            <p>{result}</p>
        </div>
    );
}

export default Page2;
