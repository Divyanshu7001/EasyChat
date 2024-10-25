import { createContext, useContext, useReducer } from "react";

// Create the context
export const StateContext = createContext();

// StateProvider component wrapping children with the context provider
export const StateProvider = ({ initialState, reducer, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Provide the state and dispatch correctly
  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};

// Custom hook to use the context
export const useStateProvider = () => useContext(StateContext);
