import useApi from './useApi';

const useQuizService = () => {
    const api = useApi();

    const getAllQuizzes = () : Promise<Quiz[]> => api('quizzes', { method: 'GET' });
    const postQuiz = (quiz: Quiz) : Promise<Quiz> => api('quizzes', { method: 'POST', body: JSON.stringify(quiz) });

    return { getAllQuizzes, postQuiz };
};

export default useQuizService;
