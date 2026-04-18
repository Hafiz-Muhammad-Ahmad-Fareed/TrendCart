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

    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        req.body[key] = value;
        continue;
      }

      if (key === "image") {
        req.file = {
          fieldname: key,
          originalname: value.name,
          mimetype: value.type,
          size: value.size,
          buffer: Buffer.from(await value.arrayBuffer()),
        };
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default parseMultipartForm;
