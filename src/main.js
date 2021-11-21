import React, { useEffect, useState } from "react";
import firebase from "firebase";
import "firebase/firestore";
import { useHistory } from "react-router-dom";
import { TextField, MenuItem } from "@mui/material";
import LoopIcon from "@mui/icons-material/Loop";

if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyAMO2sUNzINlbGLTlViWXK3V0NPW8xBPcM",
        authDomain: "ecommerce-project-d81cf.firebaseapp.com",
        projectId: "ecommerce-project-d81cf",
        storageBucket: "ecommerce-project-d81cf.appspot.com",
        messagingSenderId: "668329592221",
        appId: "1:668329592221:web:3cee420b9354852fc41b74",
        measurementId: "G-E0N2SQ0B5W"
    });
} else {
    firebase.app();
}

export default function Main(props) {
    const history = useHistory();
    const [quiznames, setQuiznames] = useState("");
    const [numberquestions, setnumberquestions] = useState(0);
    const [categories, setCategories] = useState(9);
    const [difficulties, setDifficulties] = useState();
    const [id, setId] = useState("");
    const [success, setSuccess] = useState(false);
    const [local, setLocal] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let myName = localStorage.getItem("quiz");
        setLocal(JSON.parse(myName));
    }, []);

    if (success) {
        history.push(id);
    }

    async function addData(quizname, numberquestion, category, Difficulty) {
        setLoading(true);
        await firebase
            .firestore()
            .collection("quiz")
            .add({
                quizname: quizname,
                numberquestion: numberquestion,
                category: category,
                Difficulty: Difficulty
            })
            .then(function (docRef) {
                setId("/" + docRef.id);
                localStorage.setItem(
                    "quiz",
                    local
                        ? JSON.stringify([...local, { name: quizname, class: docRef.id }])
                        : JSON.stringify([{ name: quizname, class: docRef.id }])
                );
            })
            .then(() => setLoading(false))
            .then(() => setSuccess(true));
    }

    return loading ? (
        <div className="loading">
            <LoopIcon sx={{ fontSize: 50, color: "#000000", padding: 10 }} />
        </div>
    ) : (
        <div>
            <div className="main_header">
                <h3>QUIZZER</h3>
            </div>
            <div className="qoute">
                <h2>"MAKE YOUR STUDENTS PREPARED FOR COMPETITIONS"</h2>
            </div>
            <div>
                <div className="register_box">
                    <h3>Create Quiz</h3>
                    <form className="textinput">
                        <TextField
                            sx={{ m: 1, width: "35ch" }}
                            label="name of the quiz"
                            onChange={(val) => setQuiznames(val.target.value)}
                            required
                        />
                        <TextField
                            sx={{ m: 1, width: "35ch" }}
                            label="Number of Question"
                            onChange={(val) => setnumberquestions(val.target.value)}
                            required
                        />
                        <TextField
                            id="standard-select-currency"
                            select
                            label="Category"
                            value={categories}
                            onChange={(val) => setCategories(val.target.value)}
                            sx={{ m: 1, width: "35ch" }}
                        >
                            <MenuItem value={9}>General Knowledge</MenuItem>
                            <MenuItem value={17}>Science and Nature</MenuItem>\
                            <MenuItem value={18}>Computer Science</MenuItem>
                            <MenuItem value={19}>Mathematics</MenuItem>
                            <MenuItem value={24}>Politics</MenuItem>
                            <MenuItem value={21}>Sports</MenuItem>
                        </TextField>
                        <TextField
                            id="standard-select-currency"
                            select
                            label="Difficulty"
                            value={difficulties}
                            onChange={(val) => setDifficulties(val.target.value)}
                            sx={{ m: 1, width: "35ch" }}
                        >
                            <MenuItem value="easy">Easy</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="hard">Hard</MenuItem>
                        </TextField>
                    </form>
                    <button
                        className="submit"
                        onClick={() =>
                            addData(quiznames, numberquestions, categories, difficulties)
                        }
                    >
                        Start
                    </button>
                </div>
            </div>
            <div className="quizes">
                <h3>Your Quiz</h3>
                <div className="box">
                    {local ? (
                        local.map((item) => (
                            <div
                                className="list"
                                onClick={async () => {
                                    setId("/admin/" + item.class);
                                    setSuccess(true);
                                }}
                            >
                                <h4>{item.name}</h4>
                            </div>
                        ))
                    ) : (
                        <div className="client">
                            <h2>No Quiz Created</h2>
                        </div>
                    )}
                </div>
            </div>
            <div className="footer">
                <h2>Organised by VAR</h2>
            </div>
        </div>
    );
}
