const parseDurationHH_MM_SS = (input: number | string) => {
    const total_seconds = typeof input === "string" ? parseInt(input) : input
    const hours = total_seconds / 3600 | 0
    const minutes = (total_seconds - hours*3600)/60 | 0
    const seconds = total_seconds - hours*3600 - minutes*60 | 0

    const hourStr = hours < 10 ? "0" + hours.toString() : hours.toString()
    const minStr = minutes < 10 ? "0" + minutes.toString() : minutes.toString()
    const secStr = seconds < 10 ? "0" + seconds.toString() : seconds.toString()
    return hourStr + ":" + minStr + ":" + secStr
  }
  
  export default parseDurationHH_MM_SS;