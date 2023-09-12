export const disabledPreviousDates = (time) => {
    console.log('Function called with time:', time);
    return time.getTime() < Date.now() - 8.64e7;
};
