import useApi from './useApi';

const useQuizService = () => {
    const api = useApi();

    const getAllQuizzes = () : Promise<Quiz[]> => api('quizzes', { method: 'GET' });

    return { getAllQuizzes };
};

export default useQuizService;
