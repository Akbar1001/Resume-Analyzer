import { useState } from "react";
import { InterviewContext } from "./interview.context.js";


export const InterviewProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState(null)

    return (
        <InterviewContext.Provider value={{ loading, setLoading, report, setReport }}>
            {children}
        </InterviewContext.Provider>
    )
}