declare module "dayjs" {
  type DayjsInput = string | number | Date | null | undefined;
  type DiffUnit = "millisecond" | "second" | "minute" | "hour" | "day";

  interface DayjsInstance {
    diff(input: DayjsInput | DayjsInstance, unit?: DiffUnit, float?: boolean): number;
    isValid(): boolean;
  }

  interface Dayjs {
    (input?: DayjsInput): DayjsInstance;
  }

  const dayjs: Dayjs;
  export default dayjs;
}

