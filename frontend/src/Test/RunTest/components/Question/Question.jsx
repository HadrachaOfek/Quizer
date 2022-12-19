import { useState } from "react"
import './Question.css'

function Question(props) {

   const [chosen, setChosen] = useState([])

    function checkIfchosen(index){
        let chosensAnswers = chosen;
        console.log(index)
        if(chosensAnswers.includes(index)){
            chosensAnswers.splice(chosensAnswers.indexOf(index))
        }else{
            chosensAnswers.push(index)
        }
        setChosen(chosensAnswers);
        console.log(chosen)
    }

    /*
    answers:[{answer, grade}]
    type, question, answers, totalGrade
    */
    return <div>
        <div className="title">
            {props.question}
        </div>
        <div className="answers">
            {props.answers.map((answer, index) => {
                return <div key={index}>
                    <div className="circle" onClick={() => checkIfchosen(index)} >
                        {chosen.includes(index) ? <div className="chosen">

                        </div> : ''}
                    </div>
                    <p className="text">{answer.answer}</p>
                </div>
            }
            )}
        </div>
    </div>
}

export default Question;