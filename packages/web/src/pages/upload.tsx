import { GetFileData } from "@ryanke/micro-api";
import { useRouter } from "next/router";
import React, { ChangeEventHandler, DragEventHandler, useEffect, useRef, useState } from "react";
import { Upload as UploadIcon } from "react-feather";
import { Button } from "../components/button/button";
import { Card } from "../components/card";
import { Container } from "../components/container";
import { Select } from "../components/input/select";
import { PageLoader } from "../components/page-loader";
import { Spinner } from "../components/spinner";
import { Title } from "../components/title";
import { getErrorMessage } from "../helpers/get-error-message.helper";
import { http } from "../helpers/http.helper";
import { replaceUsername } from "../helpers/replace-username.helper";
import { useConfig } from "../hooks/use-config.hook";
import { useToasts } from "../hooks/use-toasts.helper";
import { useUser } from "../hooks/use-user.helper";

export default function Upload() {
  const user = useUser();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [hover, setHover] = useState(false);
  const setToast = useToasts();
  const [selectedHost, setSelectedHost] = useState<string | undefined>();
  const config = useConfig();

  useEffect(() => {
    if (user.error) router.replace("/");
  }, [user.error, router]);

  const onDragEvent =
    (entering?: boolean): DragEventHandler =>
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (entering === true) setHover(true);
      else if (entering === false) setHover(false);
    };

  const onDrop: DragEventHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setHover(false);
    const transfer = event.dataTransfer;
    const file = transfer.files.item(0);
    if (file) {
      setFile(file);
    }
  };

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleUpload = async () => {
    try {
      if (!file || !user.data || !config.data) return;
      setUploading(true);
      const form = new FormData();
      form.append(file.name, file);
      const headers: HeadersInit = {};
      if (selectedHost) headers["X-Micro-Host"] = selectedHost;
      const response = await http(`file`, {
        method: "POST",
        body: form,
        headers: headers,
      });

      const body: GetFileData = await response.json();
      const route = `/file/${body.id}`;
      const isSameHost = body.host === config.data.host.normalised;
      if (isSameHost) {
        router.push(route);
      }

      location.href = body.urls.direct;
    } catch (error: unknown) {
      const message = getErrorMessage(error) ?? "An unknown error occured.";
      setToast({ error: true, text: message });
    } finally {
      setFile(null);
      setUploading(false);
    }
  };

  const openFileBrowser = () => {
    if (file) return;
    inputRef.current?.click();
  };

  if (!user.data || !config.data) {
    return <PageLoader title="Upload" />;
  }

  if (uploading) {
    return (
      <Container center>
        <Title>Uploading</Title>
        <Card className="flex flex-col items-center justify-center w-full h-2/4">
          <Spinner />
          <p className="text-gray-400 select-none">Uploading</p>
        </Card>
      </Container>
    );
  }

  if (file) {
    return (
      <Container center>
        <Title>Upload {file.name}</Title>
        <Card className="flex flex-col items-center justify-center w-full h-2/4">
          <h1 className="mb-4 text-2xl">{file.name}</h1>
          <div className="flex items-center justify-center">
            <Select
              prefix="Host"
              className="shrink-0 w-40 mr-2"
              value={selectedHost}
              onChange={(event) => setSelectedHost(event.target.value)}
            >
              {config.data.hosts.map((host) => (
                <option key={host.normalised} value={host.normalised} selected={host.normalised === selectedHost}>
                  {replaceUsername(host.normalised, user.data!.username)}
                </option>
              ))}
            </Select>
            <Button primary onClick={handleUpload}>
              Upload
            </Button>
          </div>
          <span className="mt-4 cursor-pointer text-brand" onClick={() => setFile(null)}>
            Cancel
          </span>
        </Card>
      </Container>
    );
  }

  return (
    <Container center>
      <Title>Upload</Title>
      <Card
        className="flex flex-col items-center justify-center w-full h-2/4"
        onDrop={onDrop}
        onDragOver={onDragEvent()}
        onDragEnter={onDragEvent(true)}
        onDragLeave={onDragEvent(false)}
        onClick={openFileBrowser}
      >
        <input type="file" id="file" className="hidden" ref={inputRef} onChange={onFileChange} />
        <h1 className="mb-2 text-2xl">
          {hover ? (
            <span className="flex items-center">
              Release to upload <UploadIcon className="ml-2" />
            </span>
          ) : (
            <span>Drag and drop a file to upload</span>
          )}
        </h1>
        <p className="text-gray-400 select-none">
          Or <span className="text-brand">click here</span> to select a file.
        </p>
      </Card>
    </Container>
  );
}
