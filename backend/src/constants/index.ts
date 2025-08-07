export const DATA_TYPES = {
  TRADE_AREA: "tradeArea",
  HOME_ZIPCODES: "homeZipcodes",
} as const;

export const ERROR_MESSAGES = {
  INVALID_DATA_TYPE: "Geçersiz dataType değeri.",
  PLACE_ID_NOT_FOUND: "Bu place ID için ev posta kodu verisi bulunamadı.",
  REQUIRED_FIELDS: "placeId ve dataType gereklidir.",
  INVALID_REQUEST: "Invalid request",
  DATA_NOT_FOUND: "Data is not found.",
} as const;

export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  OK: 200,
} as const;
