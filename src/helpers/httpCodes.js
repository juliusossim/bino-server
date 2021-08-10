// Note: Only the widely used HTTP status codes are documented

module.exports = {
  
  // Informational
  HTTP_CONTINUE: 100,
  HTTP_SWITCHING_PROTOCOLS: 101,
  HTTP_PROCESSING: 102,
  
  // Success
  /**
   * The request has succeeded
   */
  HTTP_OK: 200,

  /**
   * The server successfully created a new resource
   */
  HTTP_CREATED: 201,
  HTTP_ACCEPTED: 202,
  HTTP_NON_AUTHORITATIVE_INFORMATION: 203,

  /**
   * The server successfully processed the request, though no content is returned
   */
  HTTP_NO_CONTENT: 204,
  HTTP_RESET_CONTENT: 205,
  HTTP_PARTIAL_CONTENT: 206,
  HTTP_MULTI_STATUS: 207,          // RFC4918
  HTTP_ALREADY_REPORTED: 208,      // RFC5842
  HTTP_IM_USED: 226,               // RFC3229

  // Redirection

  HTTP_MULTIPLE_CHOICES: 300,
  HTTP_MOVED_PERMANENTLY: 301,
  HTTP_FOUND: 302,
  HTTP_SEE_OTHER: 303,

  /**
   * The resource has not been modified since the last request
   */
  HTTP_NOT_MODIFIED: 304,
  HTTP_USE_PROXY: 305,
  HTTP_RESERVED: 306,
  HTTP_TEMPORARY_REDIRECT: 307,
  HTTP_PERMANENTLY_REDIRECT: 308,  // RFC7238

  // Client Error

  /**
   * The request cannot be fulfilled due to multiple errors
   */
  HTTP_BAD_REQUEST: 400,

  /**
   * The user is unauthorized to access the requested resource
   */
  HTTP_UNAUTHORIZED: 401,
  HTTP_PAYMENT_REQUIRED: 402,

  /**
   * The requested resource is unavailable at this present time
   */
  HTTP_FORBIDDEN: 403,

  /**
   * The requested resource could not be found
   *
   * Note: This is sometimes used to mask if there was an UNAUTHORIZED (401) or
   * FORBIDDEN (403) error, for security reasons
   */
  HTTP_NOT_FOUND: 404,

  /**
   * The request method is not supported by the following resource
   */
  HTTP_METHOD_NOT_ALLOWED: 405,

  /**
   * The request was not acceptable
   */
  HTTP_NOT_ACCEPTABLE: 406,
  HTTP_PROXY_AUTHENTICATION_REQUIRED: 407,
  HTTP_REQUEST_TIMEOUT: 408,

  /**
   * The request could not be completed due to a conflict with the current state
   * of the resource
   */
  HTTP_CONFLICT: 409,
  HTTP_GONE: 410,
  HTTP_LENGTH_REQUIRED: 411,
  HTTP_PRECONDITION_FAILED: 412,
  HTTP_REQUEST_ENTITY_TOO_LARGE: 413,
  HTTP_REQUEST_URI_TOO_LONG: 414,
  HTTP_UNSUPPORTED_MEDIA_TYPE: 415,
  HTTP_REQUESTED_RANGE_NOT_SATISFIABLE: 416,
  HTTP_EXPECTATION_FAILED: 417,
  HTTP_I_AM_A_TEAPOT: 418,
  HTTP_UNPROCESSABLE_ENTITY: 422,
  HTTP_LOCKED: 423,
  HTTP_FAILED_DEPENDENCY: 424,
  HTTP_UPGRADE_REQUIRED: 426,
  HTTP_PRECONDITION_REQUIRED: 428,
  HTTP_TOO_MANY_REQUESTS: 429,
  HTTP_REQUEST_HEADER_FIELDS_TOO_LARGE: 431,                             
  // Server Error

  /**
   * The server encountered an unexpected error
   *
   * Note: This is a generic error message when no specific message
   * is suitable
   */
  HTTP_SERVER_ERROR: 500,

  /**
   * The server does not recognise the request method
   */
  HTTP_NOT_IMPLEMENTED: 501,
  HTTP_BAD_GATEWAY: 502,
  HTTP_SERVICE_UNAVAILABLE: 503,
  HTTP_GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  HTTP_INSUFFICIENT_STORAGE: 507, 
  HTTP_LOOP_DETECTED: 508,                 
  HTTP_NOT_EXTENDED: 510,                  
  HTTP_NETWORK_AUTHENTICATION_REQUIRED: 511,   
}