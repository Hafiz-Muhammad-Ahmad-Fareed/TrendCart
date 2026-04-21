const parseMultipartForm = async (req, res, next) => {
  const contentType = req.headers["content-type"] || "";

  if (!contentType.includes("multipart/form-data")) {
    return next();
  }

  try {
    const request = new Request("http://localhost", {
      method: req.method,
      headers: req.headers,
      body: req,
      duplex: "half",
    });
    const formData = await request.formData();

    req.body = {};
    req.file = null;
    req.files = [];

    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        if (req.body[key] === undefined) {
          req.body[key] = value;
        } else if (Array.isArray(req.body[key])) {
          req.body[key].push(value);
        } else {
          req.body[key] = [req.body[key], value];
        }
        continue;
      }
      const parsedFile = {
        fieldname: key,
        originalname: value.name,
        mimetype: value.type,
        size: value.size,
        buffer: Buffer.from(await value.arrayBuffer()),
      };

      if (key === "images") {
        req.files.push(parsedFile);
      }

      if (key === "image") {
        req.file = parsedFile;
      }
    }

    if (!req.file && req.files.length > 0) {
      req.file = req.files[0];
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default parseMultipartForm;
