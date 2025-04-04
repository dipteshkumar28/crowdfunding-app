export const daysLeft = (deadline) => {
  const timestamp = Number(deadline) * 1000; // convert seconds to ms
  const now = Date.now();

  // if (isNaN(timestamp)) {
  //   console.error("❌ Invalid deadline timestamp:", deadline);
  //   return "0";
  // }

  const difference = timestamp - now;
  const remainingDays = difference / (1000 * 60 * 60 * 24);

  return Math.max(0, Math.floor(remainingDays)).toString();
};

  
  export const calculateBarPercentage = (goal, raisedAmount) => {
    const percentage = Math.round((raisedAmount * 100) / goal);
  
    return percentage;
  };
  
  export const checkIfImage = (url, callback) => {
    const img = new Image();
    img.src = url;
  
    if (img.complete) callback(true);
  
    img.onload = () => callback(true);
    img.onerror = () => callback(false);
  };