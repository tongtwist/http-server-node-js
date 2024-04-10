function parseHeadersAndBody(lines) {
  lines.shift();
  const headers = parseHeaders(lines);
  const body = lines.join("\r\n");
  return { headers, body };
}

function parseHeaders(lines) {
  let blankLineReached = false;
  const headers = {};
  const keyValueSeparator = ": ";
  while (lines.length > 0 && !blankLineReached) {
    const line = lines.shift();
    blankLineReached = line === "";
    if (!blankLineReached) {
      const separatorPos = line.indexOf(keyValueSeparator);
      if (separatorPos >= 0) {
        const header = line.slice(0, separatorPos);
        const value = line.slice(separatorPos + keyValueSeparator.length);
        headers[header.toLowerCase()] = value;
      }
    }
  }
  return headers;
}

function dataToLines(data) {
  const strData = typeof data === "string" ? data : data.toString();
  return strData.split("\r\n");
}

function parseStartLine(line) {
  const parts = line.split(" ");
  if (parts.length < 3) {
    return false;
  }
  const method = parts[0];
  const path = parts[1];
  const version = parts[2];
  return { method, path, version };
}

function respondAndClose(socket, response) {
  socket.write(response);
  socket.end();
}

function buildResponse(startLine, headers, body) {
  const responseParts = [startLine];
  for (const header in headers) {
    responseParts.push(`${header}: ${headers[header]}`);
  }
  responseParts.push("");
  responseParts.push(body);
  return responseParts.join("\r\n");
}

module.exports = {
  parseHeadersAndBody,
  dataToLines,
  parseStartLine,
  respondAndClose,
  buildResponse
};