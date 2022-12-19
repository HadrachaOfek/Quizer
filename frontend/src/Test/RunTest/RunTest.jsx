import Question from "./components/Question/Question";

function RunTest() {

    // answers:[{answer, grade}]
    // type, question, answers, totalGrade

    const example = {
        test: 'דוגמא', type: 0, question: '? נצליח',
        answers: [{ answer: 'בדוק', grade: 0 },
        {answer: 'נצליח', grade: 0},
        {answer: 'אין עלינו', grade: 10},
        {answer: 'אין אופציה אחרת', grade: 0}],
        totalGrade: 10
    }

    return <div>
        <Question {...example}></Question>
    </div>
}

export default RunTest;