import { createContext, type Dispatch, type SetStateAction } from "react";

 type CounterContextType = {
  counter: number;
  setcounter: Dispatch<SetStateAction<number>>;
};
export const CounterContext = createContext<CounterContextType | null>(null);