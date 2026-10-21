export const isGeneralServerSide = () => {
  return !!process.env.IS_GENERAL;
};

export const getAppName = () => {
  return process.env.APP_NAME || 'NexPulse';
};
