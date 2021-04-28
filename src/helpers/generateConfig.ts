export function generateConfig(token: string, hosts: string[], direct: boolean) {
  const host = window.location.host;
  const protocol = window.location.protocol;
  const upload = `${protocol}//${host}/api/sharex`;
  const joined = hosts.join(", ");
  const name = `micro - ${joined}.sxcu`;
  const content = {
    Version: "13.2.1",
    Name: `micro - ${joined}`,
    DestinationType: "ImageUploader, TextUploader, FileUploader, URLShortener",
    RequestMethod: "POST",
    RequestURL: upload,
    Body: "MultipartFormData",
    FileFormName: "file",
    URL: direct ? "$json:direct$" : "$json:view$",
    ThumbnailURL: "$json:thumbnail$",
    DeletionURL: "$json:delete$",
    Parameters: {
      input: "$input$",
    },
    Headers: {
      Authorization: token,
      "X-Micro-Host": joined,
    },
  };

  return {
    name: name,
    content: JSON.stringify(content, null, 2),
  };
}
