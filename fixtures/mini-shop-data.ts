/**
 * Mini Shop login test data.
 *
 * The app has exactly one account — the one advertised on the form itself
 * ("Tài khoản mẫu: standard_user / secret_sauce"). There is no `locked_out_user`
 * or `problem_user`, so scenarios borrowed from other demo shops would pass for
 * the wrong reason.
 */

export const VALID_CREDENTIALS = {
  username: 'standard_user',
  password: 'secret_sauce',
} as const;

/**
 * The two distinct messages `POST /api/login` can return.
 *
 * Which one appears is decided purely by whether both fields are non-empty:
 * blank fields never reach the credential check.
 */
export const LOGIN_ERRORS = {
  /** Either field left blank. */
  MISSING_CREDENTIALS: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.',
  /** Both fields filled, but they do not match the account. */
  INVALID_CREDENTIALS: 'Tên đăng nhập hoặc mật khẩu không đúng.',
} as const;
