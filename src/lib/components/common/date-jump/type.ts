export interface IDateJumpProps {
    jumpDay: number;
    disabled?: boolean;
    onChooseDate?: (date: string) => void;
}