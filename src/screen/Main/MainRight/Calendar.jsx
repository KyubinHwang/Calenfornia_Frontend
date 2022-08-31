import {React, useState, useEffect} from 'react';
import "./cal.css";
import {MdChevronRight, MdChevronLeft} from 'react-icons/md';
import { format, addMonths, subMonths } from 'date-fns';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { isSameMonth, isSameDay, addDays, parse } from 'date-fns';
import axios from 'axios';
import AddSchedule from './addSchedule';

const RenderHeader = ({currentMonth, prevMonth, nextMonth }) => {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div className="header">
                <span className = "year">
                    {format(currentMonth, 'yyyy')}
                </span>
                <span className = "month">
                        <button style={{border: 'none', background:'transparent'}} onClick={prevMonth}><MdChevronLeft/></button>
                            <span className = "text month">
                                {format(currentMonth, 'M')}
                            </span>
                        <button style={{border: 'none', background:'transparent'}} onClick={nextMonth}><MdChevronRight/></button>
                 </span>
                 <span>
                    <button className="plusSchedule" onClick={handleShow}>일정 추가하기</button>
                    <AddSchedule  show={show} handleClose ={handleClose}/>
                    {/* <AddSchedule show={show}/> */}
                 </span>
        </div>
    );
};


const RenderCells = ({currentMonth, info}) => {

    const dayWeek = [];
    const date = ['Sunday', 'Monday', 'Tuesday','Wednesday','Thursday','Friday','Saturday'];

    dayWeek.push( <td className ="col" style={{color : 'red'}} key={0}>{date[0]}</td>);
    for ( let i=1; i<7; i++){
        dayWeek.push (
            <td className ="col" key={i}>
                {date[i]}
            </td>,
        ); 
    }

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedYear='';
    let formattedMonth='';
    let formattedDate = '';
    let dayString = '';
    let now = new Date()
    let nowDate = String(now.getDate());
    let nowMonth = String(now.getMonth() + 1);
    const delimiter ='-';

    // let yearNum =format(currentMonth, 'yyyy')
    // let monthNum = format(currentMonth,'M')
    // let dayNum = formattedDate;
    // const delimiter ='-';
    // let whatDay = [yearNum, monthNum, dayNum].join(delimiter);
    // console.log(whatDay);

    while (day <= endDate) {
        
        for (let i = 0; i < 7; i++) {
            //비교를 위한 모든 날짜 string 형식 맞추기
            formattedYear = format(currentMonth, 'yyyy')
            formattedMonth = format(currentMonth,'M')
            formattedDate = format(day, 'd');
            dayString = [formattedYear, formattedMonth, formattedDate].join(delimiter);
            // console.log(dayString);

            //오늘 날짜에 일정추가일때 : 오늘이 아닌 날짜에 일정추가일때(but currentMonth여야함ㅜ)
            days.push(
                <td className={
                    `td ${format(currentMonth, 'M') !== format(day, 'M')
                    ? 'not-valid'
                    : ' '}`} key={i}
                >
                {
                    //오늘 날짜 빨간표시
                    (format(currentMonth, 'M') === nowMonth) && (formattedDate === nowDate)
                    ? <div>
                        <div style={{background:'#FFAB72', color : 'white', borderRadius : '100%', width : '35px', textAlign : 'center'}}>
                            {formattedDate}
                        </div>
                        <div>
                            <div>
                             {/* 일정 추가 부분-1 */}
                             {
                                true && info.map((t) => {
                                    if(dayString === t.date)
                                        return (
                                            <div key={t.id}>
                                                <button className='info-box'>
                                                    {t.title}
                                                </button>
                                            </div>
                                        )
                                })
                                // roomData.map((r) =>{
                    //     return (
                    //         <div key={r.id} >
                    //             <Link to={`/myrooms/${r.id}`}>
                    //                     <button 
                    //                         className="roomTitle-box" 
                    //                         style={{backgroundColor:randomColor}}
                    //                     >{r.title}</button>
                    //             </Link>
                    //         </div>
                    //     );
                    // })
                            }
                            </div> 
                        </div>
                    </div>
                    : <div>
                        {
                            i == 0 ?
                            <p style={{color : '#FF0000'}}>{formattedDate}</p>
                            : formattedDate
                        }
                        <div>
                            <div>
                            {/* 일정 추가 부분-2 */}
                            {/* {
                                true && infoData.map((t) => {
                                    if(dayString === t.date)
                                        return (
                                            <div key={t.id}>
                                                <button className='info-box'>
                                                    {t.title}
                                                </button>
                                            </div>
                                        )
                                })
                            } */}
                            </div> 
                        </div>
                    </div>

                    // roomData.map((r) =>{
                    //     return (
                    //         <div key={r.id} >
                    //             <Link to={`/myrooms/${r.id}`}>
                    //                     <button 
                    //                         className="roomTitle-box" 
                    //                         style={{backgroundColor:randomColor}}
                    //                     >{r.title}</button>
                    //             </Link>
                    //         </div>
                    //     );
                    // })
                    
                }
             
                </td>
            );
            day = addDays(day,1);
        }
        rows.push(
            <tr className="tr" key={day}>
                {days}
            </tr>
        );
        days=[];
    }
    return (
        <table>
            <tbody>
                <tr>{dayWeek}</tr> 
                {rows}
            </tbody>
        </table>
    );
};



const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [infoData, setInfoData] = useState([]);
    const [check, setCheck] = useState(false);


    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const eventHandler = () => {
        setCheck(!check);
    }

    useEffect(()=> {
        axios.get(`http://localhost:8000/infos/${localStorage.getItem('id')}`,
            ).then((response) => {
                console.log(response.data);
                setInfoData(response.data);
            }
            ).catch();
    },[check]);
    

    return (
        <div className="calBody">
            {/* <div className="header">Header</div> */}
            <RenderHeader
                currentMonth = {currentMonth}
                prevMonth={prevMonth}
                nextMonth={nextMonth}
            />
            <RenderCells
                currentMonth={currentMonth}
                info = {infoData}
            />
        </div>
    );
};

export default Calendar;