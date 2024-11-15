import {
  MEDIA_SUPPORTED_FORMATS,
  SUPPORTED_FORMATS,
} from "../constants/file-constants";
import { Quill } from "react-quill";
const Delta = Quill.import("delta");
export const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === "string" && !value.trim().length) ||
  (typeof value === "object" && !Object.keys(value).length);

export const debounce = (func, timeout = 500) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

export const verifyImageFormats = (value) => {
  const nameSplit = value?.name?.split(".");
  const typeSplit = value?.type?.split("/");

  if (Array.isArray(nameSplit) && Array.isArray(typeSplit)) {
    const extenion = nameSplit[nameSplit.length - 1];
    const type = typeSplit[typeSplit.length - 1];

    return (
      SUPPORTED_FORMATS.includes(extenion?.toLowerCase()) &&
      SUPPORTED_FORMATS.includes(type?.toLowerCase())
    );
  }

  return false;
};
export const getMediaFormates = (value) => {
  const nameSplit = value?.name?.split(".");
  const typeSplit = value?.type?.split("/");

  if (Array.isArray(nameSplit) && Array.isArray(typeSplit)) {
    const extension = nameSplit[nameSplit.length - 1];
    const type = typeSplit[typeSplit.length - 1];

    return {
      extension,
      type,
    };
  }
  return null;
};

export const verifyMediaFormats = (value) => {
  const nameSplit = value?.name?.split(".");
  const typeSplit = value?.type?.split("/");

  if (Array.isArray(nameSplit) && Array.isArray(typeSplit)) {
    const extenion = nameSplit[nameSplit.length - 1];
    const type = typeSplit[typeSplit.length - 1];
    return (
      MEDIA_SUPPORTED_FORMATS.includes(extenion?.toLowerCase()) &&
      MEDIA_SUPPORTED_FORMATS.includes(type?.toLowerCase())
    );
  }

  return false;
};

export const objectToFormData = (data: any) => {
  if (isEmpty(data)) return undefined;
  const formData = new FormData();
  if (typeof data === "object") {
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File && value.size > 0) {
        formData.append(key, value as any);
      } else if (!isEmpty(value)) {
        if (typeof value === "object") {
          formData.append(
            key,
            new Blob([JSON.stringify(value)], {
              type: "application/json",
            }),
          );
          return;
        }
        formData.append(key, value as any);
      }
    });
  }
  return formData;
};

export const transformData = (data, rowStartIndex, projectId) => {
  const transformed = {}; // Initialize an object for the transformed data

  // Iterate through each key in the input data
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const section = data[key];
      const sectionName = section.sectionName; // Get the section name

      // Initialize the array for this sectionName if it doesn't exist
      if (!transformed[sectionName]) {
        transformed[sectionName] = []; // Create an array for the questions and answers
      }

      // Extract questions and answers
      const questionsArray = section.questions.flatMap((q) => q.questions); // Flatten questions
      const answersArray = section.answers[0]?.answers || []; // Get answers from the first answer object

      // Create new items for each question
      questionsArray.forEach((question, index) => {
        const startIndex = rowStartIndex?.[sectionName] ?? 0;
        //  console.log("hey chck", { startIndex, index, question });
        if (question && index >= startIndex) {
          // Only process if question is not null
          const answer = answersArray[index] || ""; // Get corresponding answer or default to empty string

          const newItem = {
            question: question,
            answer: answer,
            customPrompt: "", // Add customPrompt field
            markReviewed: false,
            markCompleted: false,
            project: projectId, // Example project ID
          };

          // Push the new item into the corresponding section array
          transformed[sectionName].push(newItem);
        }
      });
    }
  }

  return transformed;
};

export const generateDeltaString = (text) => {
  const activeElements = document.querySelectorAll(".ql-active");

  // Create an array to hold class names
  let classNames = [];

  // Loop through the NodeList of active elements
  activeElements.forEach((element) => {
    // Get the class names and convert to an array
    const classes = element.className.split(" ");
    let mapClass = [...classes];
    if ((element as any)?.value === "ordered") {
      mapClass[0] = `ql-ordered`;
    } else if ((element as any)?.value === "bullet") {
      mapClass[0] = `ql-bullet`;
    }
    // Push the class names into the array
    classNames.push(...mapClass);
  });
  classNames = classNames.filter((_, i) => i % 2 === 0);
  classNames = classNames.reduce((prev, curr) => {
    const [_, activeClass] = curr.split("-");
    if (activeClass === "ordered" || activeClass === "bullet") {
      prev["list"] = activeClass;
    } else {
      prev[activeClass] = true;
    }
    return prev;
  }, {});

  return new Delta().insert(text.concat("\n"), classNames as any);
};
// Utility function to format the current time
export const getFormattedTime = () => {
  const now = new Date();
  return now.toLocaleTimeString(); // Formats time as HH:MM:SS
};
