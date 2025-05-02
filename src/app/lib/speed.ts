// Show 4dp
// export const formatToScientific = (value: number) => {
//   if (value < 10_000) return value;

//   const sci = value.toExponential();
//   const [mantissa, exponent] = sci.split("e");

//   let formatted = `${parseFloat(mantissa).toFixed(1)}e${parseInt(exponent)}`;
//   if (formatted.length <= 4) return formatted;

//   formatted = `${Math.round(parseFloat(mantissa))}e${parseInt(exponent)}`;
//   if (formatted.length <= 4) return formatted;

//   return `1e${Math.floor(Math.log10(value))}`;
// };

export const formatToScientific = (value: number) => {
  if (value < 100_000) return value;

  const sci = value.toExponential();
  const [mantissa, exponent] = sci.split("e");
  const parsedMantissa = parseFloat(mantissa);

  // Format mantissa with up to 2 decimals, strip trailing zeros
  const formattedMantissa = parsedMantissa.toFixed(2).replace(/\.?0+$/, "");
  let formatted = `${formattedMantissa}e${parseInt(exponent)}`;
  if (formatted.length <= 5) return formatted;

  // Try rounded integer mantissa
  formatted = `${Math.round(parsedMantissa)}e${parseInt(exponent)}`;
  if (formatted.length <= 5) return formatted;

  // Fallback to log10 estimate
  return `1e${Math.floor(Math.log10(value))}`;
};
