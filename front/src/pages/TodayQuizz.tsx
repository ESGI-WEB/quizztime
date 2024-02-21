import CardTile from "../components/CardTile";
import {FormEvent, useEffect, useState} from "react";
import useCardsService from "../domain/services/useCardsService";
import {Card} from "../domain/entities/Card.ts";

/* eslint-disable react-hooks/exhaustive-deps */

export default function TodayQuizz() {
    const cardsService = useCardsService();
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [isRight, setIsRight] = useState<null | boolean>(null);

    useEffect(() => {
        cardsService.get().then((cards) => {
            setCards(cards);
            setLoading(false);
        });
    }, [])

    const currentCard = cards[currentCardIndex];

    const handleAnswer = (event: FormEvent) => {
        event.preventDefault();
        if (answer === "") {
            return;
        }
        setIsRight(currentCard.answer === answer); // no lower case for physics cards for eq
    }

    const saveAnswer = (isValid: boolean) => {
        setAnswer("");
        setIsRight(null);
        setCurrentCardIndex(currentCardIndex + 1);
        cardsService.answer(currentCard.id, isValid);
    }

    if (loading) {
        return <p>Chargement en cours...</p>
    }

    if (cards.length === 0) {
        return <p>Pas de carte à répondre aujourd'hui ! :( Ajoutez de nouvelles cartes pour lancer un quizz :D</p>
    }

    if (currentCardIndex >= cards.length) {
        return <p>Bravo ! Vous avez répondu à toutes les cartes du jour ! :D</p>
    }

    return (
        <div className="flex flex-column gap-16 flex-wrap align-center">
            <CardTile card={currentCard} hideResponse/>

            {isRight === null &&
                <form onSubmit={handleAnswer}>
                    <input type="text"
                           className={"mb-4"}
                           placeholder="Réponse"
                           value={answer}
                           onChange={(e) => setAnswer(e.target.value)}
                    />
                    <button type="submit">Valider</button>
                </form>
            }

            {isRight !== null && (
                <div>
                    <h3>{isRight ? "Bonne réponse ! :D" : "Mauvaise réponse :("}</h3>

                    {!isRight && <>
                        <p>La réponse était : {currentCard.answer}</p>
                        <p>Vous avez répondu : {answer}</p>
                    </>}

                    <button onClick={() => saveAnswer(true)}>
                        {isRight ? "Question suivante" : "Forcer la validation"}
                    </button>
                    {!isRight &&
                        <button onClick={() => saveAnswer(false)}>Passer à la question suivante</button>
                    }
                </div>
            )}
        </div>
    )
}
