import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import firebase from "firebase";
import "firebase/firestore";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShareIcon from "@mui/icons-material/Share";

export default function Admin() {
    const { id } = useParams();
    const history = useHistory();
    const [idData, setIdData] = useState([]);
    const [maindata, setMaindata] = useState("");
    const [back, setBack] = useState(false);
    const [quiz, setQuiz] = useState(false);

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
                .collection("scores")
                .orderBy("score", "desc")
                .startAt("name")
                .get()
                .then((data) => {
                    let datas = [];
                    data.forEach((each) => {
                        datas.push({ ...each.data() });
                    });
                    setIdData(datas);
                });
            await firebase
                .firestore()
                .collection("quiz")
                .doc(id)
                .get()
                .then((data) => {
                    setMaindata(data.data().quizname);
                });
        })();
    }, []);

    if (back) {
        history.push("/");
    }
    if (quiz) {
        history.push(`/${id}`);
    }

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14
        }
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.action.hover
        },
        // hide last border
        "&:last-child td, &:last-child th": {
            border: 0
        }
    }));

    const handleOnSubmit = async () => {
        if (navigator.share) {
            await navigator.share({
                title: maindata,
                text: `
        Press the link given below and participate in ${maindata}
        `,
                url: `${window.location.origin}/${id}`
            });
        } else {
            alert(`Your system does not support sharing files.`);
        }
    };

    return (
        <div>
            {/* <div onClick={() => setBack(true)} className="back">
        <ArrowBackIcon sx={{ fontSize: 35, color: "#ffffff" }} />
      </div> */}
            <div className="adminheader">
                <div onClick={() => setBack(true)} className="back">
                    <ArrowBackIcon sx={{ fontSize: 35, color: "#ffffff" }} />
                </div>
                <h3>{maindata}</h3>
            </div>
            <div className="link">
                <h3>Quiz link</h3>
                <div className="box">
                    <div className="box_link" onClick={() => setQuiz(true)}>
                        <h5>{`${window.location.origin}/${id}`}</h5>
                    </div>
                    <div className="share_link">
                        <ShareIcon
                            onClick={() => handleOnSubmit()}
                            sx={{ fontSize: 25, color: "#ffffff" }}
                        />
                    </div>
                </div>
            </div>
            <div className="table">
                <h3>Results</h3>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Name</StyledTableCell>
                                <StyledTableCell>Class</StyledTableCell>
                                <StyledTableCell>Email</StyledTableCell>
                                <StyledTableCell>Score</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {idData.map((item) => (
                                <StyledTableRow key={item.name}>
                                    <StyledTableCell component="th" scope="row">
                                        {item.name}
                                    </StyledTableCell>
                                    <StyledTableCell>{item.class}</StyledTableCell>
                                    <StyledTableCell>{item.email}</StyledTableCell>
                                    <StyledTableCell>{item.score}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}

