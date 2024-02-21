import {Card} from "../domain/entities/Card";

export default function CardTile(
    {
        card,
        hideResponse = false,
    }: {
        card: Card
        hideResponse?: boolean
    }
) {
    return (
        <div className="card">
            <div className="flex space-between align-center gap-8">
                <h3>{card.question}</h3>
                {card.tag && <span className="badge">{card.tag}</span>}
            </div>
            {!hideResponse && <p>{card.answer}</p>}
        </div>
    )
}
