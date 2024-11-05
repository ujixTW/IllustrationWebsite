function textOverLimitHelper(profile: string, limit = 90, ellipsis = "...") {
  const result =
    profile.trimEnd().length > limit
      ? profile.substring(limit) + ellipsis
      : profile;
  return result;
}

export { textOverLimitHelper };
