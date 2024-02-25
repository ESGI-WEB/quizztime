import QuizStats from "../components/QuizStats";

export default function QuizEnded() {
    return (
        <div className="flex flex-column gap-16 flex-wrap align-center col-6 margin-auto">
            <h1>Le quizz est terminé !</h1>
            <QuizStats/>
        </div>
    );
}