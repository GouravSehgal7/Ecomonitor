
export function ConvertToSec(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  const istTotalSeconds = hours * 3600 + minutes * 60;
  let utcTotalSeconds = istTotalSeconds - (5.5 * 3600);

  if (utcTotalSeconds < 0) {
    utcTotalSeconds += 86400;
  }

  console.log("usertime (UTC seconds)", utcTotalSeconds);
  return Math.floor(utcTotalSeconds);
}


