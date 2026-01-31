import { showError } from "@/utils/client/toast";
import { useState } from "react";

export type FieldMessageT<TField extends string> = {
    field: TField
    message: string
}

export const useCustomForm = () => {
    const [isLoading, setIsLoading] = useState(false);

    const onFormSubmit = async <T extends Record<string, unknown>, F extends (data: T) => Promise<any>>(
        data: T,
        executingFunction: F,
        setError: (name: keyof T, error: { type: string; message: string }) => void
    ): Promise<ReturnType<F> extends Promise<infer R> ? R : never> => {
        if (isLoading) return undefined as ReturnType<F> extends Promise<infer R> ? R : never;

        setIsLoading(true);

        try {
            const resp = await executingFunction(data);
            setIsLoading(false);
            return resp;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "An unexpected error occurred";
            showError(message);

            if (error.response?.data?.validations)
                error.response.data.validations?.map((fieldMessage: FieldMessageT<string>) => {
                    setError(fieldMessage.field, {
                        type: "manual",
                        message: fieldMessage.message
                    });
                });
            setIsLoading(false);
            throw error;
        }
    };

    return { onFormSubmit, isLoading, setIsLoading };
};