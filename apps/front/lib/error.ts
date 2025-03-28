/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from "axios";
import { toast } from "sonner";

export const getUiError = (error: unknown) => {
  if ((error as AxiosError).isAxiosError) {
    const e = error as AxiosError<any>;
    return e?.response?.data?.message || e?.response?.data?.error || e?.response?.statusText;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return error;
};

export const silentTryCatcher = async (cb: () => any) => {
  try {
    await cb();
  } catch (error) {
    console.error(getUiError(error), error);
  }
};

export const tryCatcher = async (cb: () => any) => {
  try {
    await cb();
  } catch (error) {
    toast.error(getUiError(error));
  }
};
