function parseJwt(token: string | null): Map<string, any> | null {
  if (token == null) {
    return null;
  }
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload); // {sub: "admin", iat: 1717394860, exp: 1717481260}
}

export default parseJwt;
