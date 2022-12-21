import { useEffect, useState } from "react"
import './Question.css'

function Question(props) {
    /*
    answers:[{answer, grade}]
    type, question, answers, totalGrade
    */

    return <div id="question">

        <fieldset>
            <legend>{props.question}</legend>
            {props.answers.map((answer, index) => {
                return <div key={index} className='answer'>
                    <input type="radio" name={props.question} value={answer.answer} />
                    <label for={answer.answer}>{answer.answer}</label><br />
                </div>
            }
            )}
        </fieldset>
    </div>


}

export default Question;