module.exports = (card) => {
    return {
        id: card.id,
        category: card.category,
        question: card.question,
        answer: card.answer,
        tag: card.tag,
    }
}