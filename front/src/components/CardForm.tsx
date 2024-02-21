import {CardUserData} from "../domain/entities/CardUserData";
import {useState} from "react";
import useCardsService from "../domain/services/useCardsService";

export default function CardForm({
    onNewCard
}: {
    onNewCard: () => void
}) {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [tag, setTag] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<FormErrors>({});
    const cardsService = useCardsService();

    const handleSumbit = () => {
        setError({});

        const cardUserData: CardUserData = {
            question,
            answer,
            tag
        };

        const formErrors = validateForm(cardUserData);
        if (Object.keys(formErrors).length > 0) {
            setError(formErrors);
            return;
        } else {
            submit(cardUserData);
        }
    }

    const submit = (cardUserData: CardUserData) => {
        setSubmitting(true);
        cardsService.post(cardUserData).then(() => {
            setSubmitting(false);
            setQuestion("");
            setAnswer("");
            setTag("");
            onNewCard();
        });
    }

    const validateForm = (cardUserData: CardUserData): FormErrors => {
        const errors: {
            question?: string,
            answer?: string,
            tag?: string
        } = {};

        if (!cardUserData.question) {
            errors.question = "La question est obligatoire";
        }

        if (!cardUserData.answer) {
            errors.answer = "La réponse est obligatoire";
        }

        return errors;
    }

    return (
        <div className="card card-large">
            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Question"
            />
            {error.question && <p className="error">{error.question}</p>}

            <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Réponse"
            />
            {error.answer && <p className="error">{error.answer}</p>}

            <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Tag"
            />
            {error.tag && <p className="error">{error.tag}</p>}

            <button onClick={handleSumbit} disabled={submitting} className="mt-8">Ajouter</button>
        </div>
    )
}

interface FormErrors {
    question?: string,
    answer?: string,
    tag?: string
}