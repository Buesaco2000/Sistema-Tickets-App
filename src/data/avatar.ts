export const getAvatarLetter = (email?: string, nombres?: string): string => {
  if (email && email.trim().length > 0) {
    return email.trim().charAt(0).toUpperCase();
  }
  if (nombres && nombres.trim().length > 0) {
    return nombres.trim().charAt(0).toUpperCase();
  }

  return "?";
};
