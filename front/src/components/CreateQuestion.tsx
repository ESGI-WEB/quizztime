import { TextField, Button, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";

function CreateQuestion(
    {
        questionObj = null,
        questionLabel = "Question",
        onChangeQuestion,
        onDeleteQuestion,
        isDeletable = true,
    }: {
        questionObj: Question | null,
        questionLabel: string,
        onChangeQuestion: (value: Question) => void,
        onDeleteQuestion: () => void | undefined,
        isDeletable: boolean,
    }
) {
    const [question, setQuestion] = useState<string>(questionObj?.question || "");
    const [answer, setAnswer] = useState<string>(questionObj?.choices?.find((c) => c.isCorrect)?.choice || "");
    const [choices, setChoices] = useState<string[]>([...questionObj?.choices?.filter((c) => !c.isCorrect)?.map((choice) => choice.choice) || ""]);

    useEffect(() => {
        const allChoices: Choice[] = [];

        allChoices.push({
            choice: answer,
            isCorrect: true,
        });

        allChoices.push(
            ...choices.map((choice) => {
                return {
                    choice: choice,
                    isCorrect: false,
                };
            })
        );

        onChangeQuestion({
            question,
            choices: allChoices,
        });
    }, [question, answer, choices]);

    const addChoice = () => {
        const newChoices = [...choices];
        newChoices.push("");
        setChoices(newChoices);
    };

    const updateChoice = (choiceIndex: number, value: string) => {
        const newChoices = [...choices];
        newChoices[choiceIndex] = value;
        setChoices(newChoices);
    };

    const deleteChoice = (choiceIndex: number) => {
        const newChoices = [...choices];
        newChoices.splice(choiceIndex, 1);
        setChoices(newChoices);
    };

    return (
        <>
            <TextField
                label={questionLabel}
                variant="outlined"
                fullWidth
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />

            <TextField
                label="Réponse à la question"
                variant="outlined"
                required
                fullWidth
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
            />

            {choices?.map((choice: string, choiceIndex: number) => (
                <div key={choiceIndex} className="flex gap-8">
                    <TextField
                        label={`Autre choix ${choiceIndex + 1}`}
                        variant="outlined"
                        required
                        fullWidth
                        value={choice}
                        onChange={(e) => updateChoice(choiceIndex, e.target.value)}
                    />
                    {choiceIndex >= 1 && (
                        <IconButton
                            onClick={() => deleteChoice(choiceIndex)}
                            aria-label={`Supprimer le choix ${choiceIndex + 1}`}
                        >
                            <Delete />
                        </IconButton>
                    )}
                </div>
            ))}

            <Button variant="outlined" onClick={() => addChoice()} aria-label="Ajouter un faux choix">
                Ajouter un faux choix
            </Button>

            {isDeletable && (
                <Button variant="outlined" onClick={() => onDeleteQuestion()} aria-label="Supprimer la question">
                    Supprimer la question
                </Button>
            )}
        </>
    );
}

export default CreateQuestion;
