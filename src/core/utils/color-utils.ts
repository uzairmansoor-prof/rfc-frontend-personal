export const getRandomColor = () => {
  const letters = "0123456789ABCDEF".split("");
  let color = "#";

  for (let i = 0; i < 6; i++) {
    color += letters[Math.round(Math.random() * 15)];
  }
  return color;
};

export const getRandomRGBAColor = () => {
  // Generate random values for red, green, blue, and alpha channels
  let red = Math.floor(Math.random() * 256);
  let green = Math.floor(Math.random() * 256);
  let blue = Math.floor(Math.random() * 256);
  let alpha = Math.random().toFixed(2); // Fixed to 2 decimal places for alpha channel

  // Construct the RGBA color string
  let rgbaRandom =
    "rgba(" + red + ", " + green + ", " + blue + ", " + alpha + ")";

  let rgbaDark = "rgba(" + red + ", " + green + ", " + blue + ", " + 1 + ")";
  let rgbaPlain = "rgba(" + red + ", " + green + ", " + blue + ", " + 0.6 + ")";
  let rgbaLight = "rgba(" + red + ", " + green + ", " + blue + ", " + 0.3 + ")";
  return {
    rgbaRandom,
    rgbaDark,
    rgbaPlain,
    rgbaLight,
  };
};
