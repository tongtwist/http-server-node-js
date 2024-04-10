const net = require("net");
const {parseArgs} = require("./programArgs");
const {getFilenameFromPath, saveFile, readFile} = require("./fileUtils");
const {parseHeadersAndBody, dataToLines, parseStartLine, respondAndClose, buildResponse} = require("./httpUtils");

const { flags } = parseArgs();
const { directory } = flags;
const server = net.createServer((socket) => {
  socket.on("close", () => socket.end());
  socket.on("data", async (data) => handleHTTP(socket, data));
});
server.listen({ port: 4221, host: "localhost" }, (e) => {
  if (e) {
    console.log("Error when bounding the server.", e);
    return;
  }
  console.log("Server is listening...");
});

async function handleHTTP(socket, data) {
  let response;
  const lines = dataToLines(data);
  if (lines.length > 0) {
    const startLine = parseStartLine(lines[0]);
    if (startLine) {
      const { method, path } = startLine;
      console.log(`${Date.now()} -> ${method} ${path}`);
      switch (method) {
        case "GET": {
          switch (path) {
            case "/":
              response = buildResponse("HTTP/1.1 200 OK", {}, "");
              break;
            case "/user-agent":
              response = userAgentResponse(lines);
              break;
          }
          response = response
            ?? echoResponse(path)
            ?? (await getFileResponse(path));
          break;
        }
        case "POST": {
          response = response ?? (await postFileResponse(path, lines));
          break;
        }
      }
    }
  }
  response = response ?? "HTTP/1.1 404 Not Found\r\n\r\n";
  let txtResponse = JSON.stringify(response);
  const maxLength = 120;
  if (txtResponse.length > maxLength) {
    txtResponse = txtResponse.slice(0, maxLength - 3) + "...";
  }
  console.log(`${Date.now()} <- [${txtResponse}]`);
  respondAndClose(socket, response);
}

function echoResponse(path) {
  const echoPathShouldStartsWith = "/echo/";
  if (path.startsWith(echoPathShouldStartsWith)) {
    const body = path.slice(echoPathShouldStartsWith.length);
    return buildResponse(
      "HTTP/1.1 200 OK",
      {
        "Content-Type": "text/plain",
        "Content-Length": body.length,
      },
      body
    );
  }
}

function userAgentResponse(lines) {
  const { headers } = parseHeadersAndBody(lines);
  const body = headers["user-agent"];
  return buildResponse(
    "HTTP/1.1 200 OK",
    {
      "Content-Type": "text/plain",
      "Content-Length": body.length,
    },
    body
  );
}

async function getFileResponse(path) {
  const pathPrefix = "/files/";
  if (path.startsWith(pathPrefix) && path.length > pathPrefix.length) {
    const filename = getFilenameFromPath(path, pathPrefix);
    const content = await getFileContent(filename);
    if (content) {
      return buildResponse(
        "HTTP/1.1 200 OK",
        {
          "Content-Type": "application/octet-stream",
          "Content-Length": content.length,
        },
        content
      );
    }
  }
}

async function getFileContent(filename) {
  try {
    return await readFile(directory, filename);
  } catch (err) {
    console.log(`Cannot read "${filename}" file. ${err.message}`);
  }
}

async function postFileResponse(path, lines) {
  const pathPrefix = "/files/";
  if (path.startsWith(pathPrefix) && path.length > pathPrefix.length) {
    const filename = getFilenameFromPath(path, pathPrefix);
    const { body } = parseHeadersAndBody(lines);
    const fileSaved = await saveFile(directory, filename, body);
    if (fileSaved) {
      return buildResponse("HTTP/1.1 201 OK", {}, "");
    }
  }
}

