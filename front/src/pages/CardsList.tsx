import {useEffect, useState} from "react";
import useCardsService from "../domain/services/useCardsService.js";
import {Card} from "../domain/entities/Card";
import CardTile from "../components/CardTile";
import CardForm from "../components/CardForm";
import Chips from "../components/Chips";

/* eslint-disable react-hooks/exhaustive-deps */

export default function CardsList() {
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);
    const [tags, setTags] = useState<string[]>([]);
    const cardsService = useCardsService();

    useEffect(() => {
        loadCards();
    }, [])

    const loadCards = (tags: string[] = []) => {
        cardsService.getCollection(tags).then((cards) => {
            setCards(cards);
            setLoading(false);
        });
    }

    const onTagsChange = (tags: string[]) => {
        setTags(tags);
        loadCards(tags);
    }

    return (
        <>
            <h1>Mes fiches</h1>
            <div className="flex gap-8 flex-align-end mb-32">
                <Chips placeholder="Chercher par tags" onTagsChange={onTagsChange}/>
            </div>
            {loading && <p>Chargement en cours...</p>}
            <div className="flex gap-16 flex-wrap">
                <CardForm onNewCard={() => loadCards(tags)}/>
                {cards.map(card => <CardTile key={card.id} card={card} mustRespond={false} />)}
            </div>
        </>
    )
}