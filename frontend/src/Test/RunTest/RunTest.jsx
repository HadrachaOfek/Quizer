import Question from "./components/Question/Question";
import './RunTest.css';
import ofekLogo from '../resources/images/ofek.png';
import hadrachaLogo from '../resources/images/hadracha.png';
import { example1, example2, example3, example4 } from "./QuestionsBank/Questions";


function RunTest(props) {

    // answers:[{answer, grade}]
    // type, question, answers, totalGrade

    return <div id="run-test" >
        <div className="run-test-header">
            <img className='ofek' src={ofekLogo} alt='' />
            <h1>{props.test}</h1>
            <img className='hadracha' src={hadrachaLogo} alt='' />
        </div>
        <div className="questions-part">
            <Question {...example1}></Question>
            <Question {...example2}></Question>
            <Question {...example3}></Question>
            <Question {...example4}></Question>

        </div>

    </div>
}

export default RunTest;