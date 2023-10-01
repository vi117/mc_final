/**
 * 닉네임을 limit개까지 제공합니다.
 * @param {string} original_nickname - original nickname
 * @param {number} limit - max length of nickname
 * @example
 * ```js
 * cutNickname("hello world");  // "hello w..."
 * cutNickname("hello world", 8);  // "hello..."
 * ```
 */
export function cutNickname(original_nickname, limit = 10) {
  if (original_nickname.length > limit) {
    return original_nickname.substring(0, limit - 3) + "...";
  }
  return original_nickname;
}
