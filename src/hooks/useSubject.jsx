import { useState, useEffect } from 'react';
import axios from 'axios';

const useSubject = () => {
    const [checkSub, setSubCheck] = useState(false);
    const [checkProf, setProfCheck] = useState(false);
    const [checkClass, setClassCheck] = useState(false);

    const [subjectId, setSubjectID] = useState(0);
    const [professorId, setProfessorID] = useState(0);
    const [classNumId, setClassNumID] = useState(0);

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false); setSubCheck(false); setProfCheck(false); setClassCheck(false);
    };
    const handleShow = () => setShow(true);

    const [userSubject, setUserSubject] = useState([]);

    const [allData, setAllData] = useState([]);

    const subjectChange = (e) => {
        if (e.target.value === '0'){
            setSubCheck(false)
            setProfCheck(false)
            setClassCheck(false)
        } else {
            setSubCheck(true)
            setProfCheck(false)
            setClassCheck(false)
        }
        e.target.value === '0' ? setSubjectID(Number(e.target.value)) : setSubjectID(Number(e.target.value))
    }

    const professorChange = (e) => {
        if (e.target.value === '0'){
            setProfCheck(false)
            setClassCheck(false)
        } else {
            setProfCheck(true)
            setClassCheck(false)
        }
        e.target.value === '0' ? setProfessorID(Number(e.target.value)) : setProfessorID(Number(e.target.value))
    }

    const classNumChange = (e) => {
        e.target.value === '0' ? setClassCheck(false) : setClassCheck(true)
        setClassNumID(Number(e.target.value))
    }

    const refreshSubject = () => {
        axios.delete(`http://43.201.34.118:3306/usersubject/${localStorage.getItem('id')}`).then(()=>{}).catch()
        setUserSubject([])
        setSubCheck(false)
        setProfCheck(false)
        setClassCheck(false)
        setSubjectID(0)
        setProfessorID(0)
    }

    const deleteSubject = (e) => {
        const userSubjectid = e.target.value
        axios.delete(`http://43.201.34.118:3306/usersubject/${localStorage.getItem('id')}/${userSubjectid}`).then(()=>{
            axios.get(`http://43.201.34.118:3306/usersubject/${localStorage.getItem('id')}`)
            .then((response)=> {
                setUserSubject(response.data);
            })
        }).catch()
    }

    const addSubjectLabel = () => {
        setSubjectID(0); setProfessorID(0); setClassNumID(0);
        setSubCheck(false); setProfCheck(false); setClassCheck(false);
        axios.post(`http://43.201.34.118:3306/usersubject/`,{
            user_id : localStorage.getItem('id'),   
            subject_id : subjectId,
            professor_id : professorId,
            classnum : classNumId
        }).then(()=>{
            axios.get(`http://43.201.34.118:3306/usersubject/${localStorage.getItem('id')}`)
            .then((response)=> {
                setUserSubject(response.data);
            }).catch()
        })
    }

    useEffect(() => {
        axios.get("http://43.201.34.118:3306/subject/")
        .then((response)=> {
            setAllData(response.data)
            axios.get(`http://43.201.34.118:3306/usersubject/${localStorage.getItem('id')}`)
            .then((response)=> {
                console.log(response.data)
                setUserSubject(response.data)
            }).catch()
        }).catch()
    }, []);

    return {
        setSubjectID, setProfessorID,
        checkSub, checkProf, checkClass,
        subjectId, professorId, 
        show, handleClose, handleShow, 
        userSubject, allData,
        subjectChange, professorChange, classNumChange,
        refreshSubject, deleteSubject, addSubjectLabel
    };
}

export default useSubject;