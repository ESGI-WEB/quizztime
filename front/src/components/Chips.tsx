import React, {useState} from "react";

export default function Chips(
    {
        placeholder = "",
        onTagsChange = () => {}
    }: {
        placeholder?: string,
        // eslint-disable-next-line no-unused-vars
        onTagsChange?: (tags: string[]) => void
    }
) {
    const CHIP_ENTER_KEYS = ["Enter", "Tab", ",", ";", " "];

    const [chips, setChips] = useState<string[]>([]);
    const [currentTypedChip, setCurrentTypedChip] = useState<string>("");

    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (CHIP_ENTER_KEYS.includes(e.key)) {
            e.preventDefault();
            if (currentTypedChip.trim() !== "") {
                const newChips = [...chips, currentTypedChip];
                setChips(newChips);
                onTagsChange(newChips);
                setCurrentTypedChip("");
            }
        }
    }

    const onRemoveChip = (chip: string) => {
        const newChips = chips.filter(c => c !== chip);
        setChips(newChips);
        onTagsChange(newChips);
    }

    return (
        <div>
            <div className="flex gap-8 mb-8">
                {chips.map(chip => <span className="badge" key={chip}>
                    {chip}
                    <span onClick={() => onRemoveChip(chip)}>  X</span>
                </span>)}
            </div>
            <input
                type="text"
                value={currentTypedChip}
                onChange={(e) => setCurrentTypedChip(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder={placeholder}
            />
        </div>
    )
}