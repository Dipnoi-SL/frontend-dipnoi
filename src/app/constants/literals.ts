export const EMAIL_VALIDATION_REGEXP =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

export const PASSWORD_VALIDATION_REGEXP =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]).{8,}$/;

export const PASSWORD_VALIDATION_MIN_LENGTH = 8;

export const NICKNAME_VALIDATION_REGEXP = /^[a-zA-Z0-9_-]{3,15}$/;

export const NICKNAME_VALIDATION_MIN_LENGTH = 3;

export const NICKNAME_VALIDATION_MAX_LENGTH = 15;
