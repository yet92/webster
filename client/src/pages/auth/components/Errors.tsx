import { Card } from "flowbite-react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { ClientError } from "../../../store/errorsSlice";
import { getErrorMessage } from "../utils";

export default function Errors() {

    const errors = useSelector((state: RootState) => state.errors.errors);

    if (errors.length === 0) {
        return null;
    }

    

    return (
        <div className="text-center">
            {errors.map((error, index) => {
                return (
                    <div key={index}>
                        <p className="text-red-500">{getErrorMessage(error)}</p>
                    </div>
                )
            })}
        </div>

    )
}