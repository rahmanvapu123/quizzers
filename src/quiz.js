import React, { useEffect, useState } from "react";
import firebase from "firebase";
import "firebase/firestore";
import { useParams } from "react-router-dom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import ShareIcon from "@mui/icons-material/Share";
import FormControlLabel from "@mui/material/FormControlLabel";
import LoopIcon from "@mui/icons-material/Loop";

export default function Quiz() {
    const { id } = useParams();
    const [iddata, setIddata] = useState([]);
    const [score, setScore] = useState(0);
    const [name, setName] = useState("");
    const [quizClass, setQuizClass] = useState("");
    const [email, setEmail] = useState("");
    const [data, setdata] = useState([]);
    const [quizpage, setQuizpage] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (navigator.share === undefined) {
            if (window.location.protocol === "http:") {
                window.location.replace(
                    window.location.href.replace(/^http:/, "https:")
                );
            }
        }
    }, []);

    useEffect(() => {
        (async () => {
            await firebase
                .firestore()
                .collection("quiz")
                .doc(id)
                .get()
                .then(async (data) => {
                    setIddata(data.data());
                    const res = await fetch(
                        `https://opentdb.com/api.php?amount=${data.data().numberquestion
                        }&category=${data.data().category}&difficulty=${data.data().Difficulty
                        }&type=multiple`
                    );
                    const datas = await res.json();
                    setdata(datas.results);
                });
        })();
    }, []);

    const adddata = async (name, quizclass, email, score) => {
        setLoading(true);
        await firebase
            .firestore()
            .collection("quiz")
            .doc(id)
            .collection("scores")
            .add({
                name: name,
                class: quizclass,
                email: email,
                score: score
            })
            .then(() => setQuizpage(false))
            .then(() => setLoading(false));
    };

    const handleOnSubmit = async () => {
        if (navigator.share) {
            await navigator.share({
                title: iddata.quizname,
                text: `
      ${name} scored ${score}/10 in ${iddata.quizname} and I advice you all to participate in it by clicking the link given below
      `,
                url: `${window.location.origin}/${id}`
            });
        } else {
            alert(`Your system does not support sharing files.`);
        }
    };

    return loading ? (
        <div className="loading">
            <LoopIcon sx={{ fontSize: 50, color: "#000000", padding: 10 }} />
        </div>
    ) : quizpage ? (
        <div className="bodyquiz">
            <div className="header">
                <h3>{iddata.quizname}</h3>
            </div>
            <div className="questionbox1">
                <h3>Name</h3>
                <TextField
                    sx={{ width: "30ch" }}
                    id="standard-basic"
                    label="Name"
                    onChange={(val) => setName(val.target.value)}
                    variant="standard"
                />
            </div>
            <div className="questionbox">
                <h3>Class</h3>
                <TextField
                    onChange={(val) => setQuizClass(val.target.value)}
                    sx={{ width: "30ch" }}
                    id="standard-basic"
                    label="Class"
                    variant="standard"
                />
            </div>
            <div className="questionbox">
                <h3>Email</h3>
                <TextField
                    onChange={(val) => setEmail(val.target.value)}
                    sx={{ width: "30ch" }}
                    id="standard-basic"
                    label="Email"
                    variant="standard"
                />
            </div>
            {data.map((item) => {
                let number = Math.floor(Math.random() * 3);
                return (
                    <div key={item.question} className="questionbox">
                        <h3>
                            {item.question.includes("&#039;")
                                ? item.question.replace(/&#039;/g, " ")
                                : item.question.includes("&quot;")
                                    ? item.question.replace(/&quot;/g, " ")
                                    : item.question.includes("&ldquo;")
                                        ? item.question.replace(/&ldquo;/g, " ")
                                        : item.question.includes("&hellip;")
                                            ? item.question.replace(/&hellip;/g, " ")
                                            : item.question.includes("&rdquo;")
                                                ? item.question.replace(/&rdquo;/g, " ")
                                                : item.question.includes("&amp;")
                                                    ? item.question.replace(/&amp;/g, " ")
                                                    : item.question}
                        </h3>
                        <RadioGroup
                            onChange={(val) => {
                                if (val.target.value === item.correct_answer) {
                                    setScore((prev) => prev + 1);
                                }
                            }}
                            name="radio-buttons-group"
                        >
                            {item.incorrect_answers.map((ite, index) =>
                                index === number ? (
                                    <>
                                        <FormControlLabel
                                            value={item.correct_answer}
                                            control={<Radio />}
                                            label={
                                                item.correct_answer.includes("&#039;")
                                                    ? item.correct_answer.replace(/&#039;/g, " ")
                                                    : item.correct_answer.includes("&quot;")
                                                        ? item.correct_answer.replace(/&quot;/g, " ")
                                                        : item.correct_answer.includes("&ldquo;")
                                                            ? item.correct_answer.replace(/&ldquo;/g, " ")
                                                            : item.correct_answer.includes("&hellip;")
                                                                ? item.correct_answer.replace(/&hellip;/g, " ")
                                                                : item.correct_answer.includes("&rdquo;")
                                                                    ? item.correct_answer.replace(/&rdquo;/g, " ")
                                                                    : item.correct_answer.includes("&amp;")
                                                                        ? item.correct_answer.replace(/&amp;/g, " ")
                                                                        : item.correct_answer
                                            }
                                        />
                                        <FormControlLabel
                                            value={ite}
                                            control={<Radio />}
                                            label={
                                                ite.includes("&#039;")
                                                    ? ite.replace(/&#039;/g, " ")
                                                    : ite.includes("&quot;")
                                                        ? ite.replace(/&quot;/g, " ")
                                                        : ite.includes("&ldquo;")
                                                            ? ite.replace(/&ldquo;/g, " ")
                                                            : ite.includes("&hellip;")
                                                                ? ite.replace(/&hellip;/g, " ")
                                                                : ite.includes("&rdquo;")
                                                                    ? ite.replace(/&rdquo;/g, " ")
                                                                    : ite.includes("&amp;")
                                                                        ? ite.replace(/&amp;/g, " ")
                                                                        : ite
                                            }
                                        />
                                    </>
                                ) : (
                                    <FormControlLabel
                                        value={ite}
                                        control={<Radio />}
                                        label={
                                            ite.includes("&#039;")
                                                ? ite.replace(/&#039;/g, " ")
                                                : ite.includes("&quot;")
                                                    ? ite.replace(/&quot;/g, " ")
                                                    : ite.includes("&ldquo;")
                                                        ? ite.replace(/&ldquo;/g, " ")
                                                        : ite.includes("&hellip;")
                                                            ? ite.replace(/&hellip;/g, " ")
                                                            : ite.includes("&rdquo;")
                                                                ? ite.replace(/&rdquo;/g, " ")
                                                                : ite.includes("&amp;")
                                                                    ? ite.replace(/&amp;/g, " ")
                                                                    : ite
                                        }
                                    />
                                )
                            )}
                        </RadioGroup>
                    </div>
                );
            })}
            <div className="gridlayout">
                <div
                    onClick={() => adddata(name, quizClass, email, score)}
                    className="quiz_submit"
                >
                    <h3>Submit</h3>
                </div>
            </div>
        </div>
    ) : (
        <div className="bodyquiz">
            <div className="questionbox">
                <div className="gridlayout">
                    <h3>{iddata.quizname}</h3>
                    <h1>{score}/10</h1>
                </div>
            </div>
            <div onClick={handleOnSubmit} className="share">
                <ShareIcon sx={{ fontSize: 35, color: "#ffffff" }} />
            </div>
        </div>
    );
}
