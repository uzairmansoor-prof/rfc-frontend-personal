export const getUserInitials = (username: string) => {
  const names: string[] = username?.split(" ") ?? [];
  let initials: string = "";

  names.forEach((name: string) => {
    const initial = name.at(0);

    if (initial && initials.length < 2) {
      initials = initials.concat(initial).toUpperCase();
    }
  });
  return initials;
};

export const capitilizFirstLetter = (text: string) =>
  text?.slice(0, 1).toUpperCase().concat(text?.slice(1));

export const concatToFullName = (firstName: string, lastName: string) =>
  (firstName ?? ``).concat(lastName ? ` ${lastName}` : ``);

const colorMap: { [key: string]: string } = {
  A: "#FF5733",
  B: "#33FF57",
  C: "#3357FF",
  D: "#FF33A8",
  E: "#A833FF",
  F: "#33FFA1",
  G: "#FF8333",
  H: "#FF3333",
  I: "#33FFFF",
  J: "#FF33FF",
  K: "#5733FF",
  L: "#57FF33",
  M: "#FF3357",
  N: "#A8FF33",
  O: "#33A8FF",
  P: "#FF5733",
  Q: "#33FF57",
  R: "#3357FF",
  S: "#FF33A8",
  T: "#A833FF",
  U: "#33FFA1",
  V: "#FF8333",
  W: "#FF3333",
  X: "#33FFFF",
  Y: "#FF33FF",
  Z: "#5733FF",
};

export const randomColor = (username?: string) => {
  if (username) {
    const initials = getUserInitials(username);
    const firstLetter = initials.charAt(0);
    return colorMap[firstLetter] || "#000000"; // Fallback color if not found
  }
  return "#000000";
};
