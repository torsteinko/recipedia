

const parseDuration = (input: number | string) => {
  const seconds = typeof input === "string" ? parseInt(input) : input

  if (seconds / 60 < 60) {
    return /* "Tid: "  */+ seconds / 60 + " min"
  }
  else if (seconds / 60 > 60) {
    const hours = seconds / 3600;
    const minutter = seconds / 60 - Math.floor(hours) * 60;
    return Math.floor(hours) + "t " + minutter + "min"
  }
}

export default parseDuration;