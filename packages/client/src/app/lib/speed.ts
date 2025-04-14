export const formatToScientific = (value: number) => {
  if (value < 10_000) return value;

  const sci = value.toExponential();
  const [mantissa, exponent] = sci.split("e");

  let formatted = `${parseFloat(mantissa).toFixed(1)}e${parseInt(exponent)}`;
  if (formatted.length <= 4) return formatted;

  formatted = `${Math.round(parseFloat(mantissa))}e${parseInt(exponent)}`;
  if (formatted.length <= 4) return formatted;

  return `1e${Math.floor(Math.log10(value))}`;
};
