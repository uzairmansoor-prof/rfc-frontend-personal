import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
import duration from "dayjs/plugin/duration";
import { DatePickerProps } from "antd/es/date-picker";
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_DATE_TIME_FORMAT,
} from "../constants/date-time-constants";
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(duration);

export const formatToDayMonthYear = (date) => {
  return dayjs(date).format("DD MMMM, YYYY");
};

// Function to convert local time to UTC
export const convertLocalToUtc = (localTime, format = undefined) => {
  return dayjs(localTime).utc().format(format);
};
export const convertUtcToLocalDateTime = (dateTime, format = undefined) => {
  return dayjs.utc(dateTime).local().format(format);
};

export const utcUnixToDateTime = (timestamp) =>
  dayjs.unix(timestamp).format(DEFAULT_DATE_TIME_FORMAT);

export const convertFractionOfDay = (fraction) => {
  // Convert fraction to total seconds
  const totalSeconds = fraction * 60 * 60;

  // Create a dayjs duration object from total seconds
  const durationObj = dayjs.duration(totalSeconds, "seconds");

  // Extract hours, minutes, and seconds from the duration object
  const hours = Math.floor(durationObj.asHours());
  const minutes = durationObj.minutes();
  const seconds = durationObj.seconds();

  // Format the time in HH:MM:SS
  return dayjs.duration({ hours, minutes, seconds }).format("HH:mm:ss");
};

export const convertToLocalDateTime = (dateTime, format = undefined) => {
  return dayjs(dateTime).local().format(format);
};

export const formatTimeToCurrentTime = (time: string): dayjs.Dayjs => {
  return dayjs(`${dayjs().format("L")} ${time}`);
};

export const disabledDate: DatePickerProps["disabledDate"] = (current) => {
  // Can not select days before today and today
  return (
    current &&
    (current?.isSame(dayjs().startOf("day")) ||
      current?.isBefore(dayjs().endOf("day")))
  );
};

export const formatDateTime = (dateFormat, format = DEFAULT_DATE_FORMAT) => {
  const dateObject = dateFormat ? dayjs(dateFormat) : dayjs();
  return dateObject.format(format);
};

const generateRangeArray = (count: number) => {
  return count ? [...Array(count)].map((data, index) => index) : [];
};

export const disabledDateTime = (currentDate: any) => {
  const isCurrentDate = dayjs(currentDate, DEFAULT_DATE_FORMAT).isSame(
    dayjs(),
    "day",
  );
  const isCurrentHour =
    dayjs(currentDate, DEFAULT_DATE_FORMAT).hour() === dayjs().hour();

  let disableHour: number[] = [];
  let disableMinutes: number[] = [];
  if (isCurrentDate) {
    disableHour = generateRangeArray(dayjs().hour());
    if (isCurrentHour) {
      disableMinutes = generateRangeArray(dayjs().minute());
    }
  }

  return {
    disabledHours: () => disableHour,
    disabledMinutes: () => disableMinutes,
  };
};
