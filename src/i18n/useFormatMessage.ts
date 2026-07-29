import { useMemo } from "react";
import { useIntl } from "react-intl";

export type PrimitiveType = string | number | boolean | null | undefined | Date;

export const useFormatMessage = <T extends {}>(
  id: Extract<keyof T, string>,
  values?: Record<string, PrimitiveType>,
): string => {
  const intl = useIntl();
  const msg = useMemo(() => {
    return intl.formatMessage({ id }, values);
  }, [intl, id, values]);
  return msg;
};
