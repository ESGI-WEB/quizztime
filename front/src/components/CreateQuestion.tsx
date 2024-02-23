import React from "react";
import { TextField, Button, FormControlLabel, Checkbox } from "@mui/material";

function CreateQuestion({ index, question, onChangeQuestion, onChangeChoice, onAddChoice, onDeleteChoice, onChangeAnswer }) {
    return (
        <div key={index}>
            <TextField
                label={`Question ${index + 1}`}
                variant="outlined"
                fullWidth
                value={question.question}
                onChange={(e) => onChangeQuestion(index, e.target.value)}
            />
            <div className="flex flex-column gap-16 flex-wrap align-center col-8 margin-auto">
                {question.choices.map((choice, choiceIndex) => (
                    <div key={choiceIndex}>
                        <TextField
                            label={`Choice ${choiceIndex + 1}`}
                            variant="outlined"
                            fullWidth
                            value={choice}
                            onChange={(e) => onChangeChoice(index, choiceIndex, e.target.value)}
                        />
                        <Button variant="outlined" onClick={() => onDeleteChoice(index, choiceIndex)}>
                            Supprimer ce choix
                        </Button>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={question.answers.some((answer) => answer.index === choiceIndex)}
                                    onChange={(e) => onChangeAnswer(index, choiceIndex, e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Réponse"
                        />
                    </div>
                ))}
                <Button variant="outlined" onClick={() => onAddChoice(index)}>
                    Ajouter un choix
                </Button>
            </div>
        </div>
    );
}

export default CreateQuestion;
