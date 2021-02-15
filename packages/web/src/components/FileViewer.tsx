import { Button, Card, Tooltip, useClipboard, useToasts } from "@geist-ui/react";
import { Download, Eye, FileText, Share2 } from "@geist-ui/react-icons";
import { File as APIFile } from "@micro/api";
import prettyBytes from "pretty-bytes";
import styled from "styled-components";
import { downloadUrl } from "../helpers/downloadUrl";
import { FileContent } from "./FileContent/FileContent";

const FileContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  h1 {
    font-size: 2.25rem;
    margin-bottom: 0;
  }
  span {
    color: var(--accents-5);
    font-size: 0.75rem;
  }
`;

const FileContentRight = styled.div`
  display: flex;
`;

const FileContentButtons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  > :first-child {
    margin-bottom: 0.5em;
  }
`;

const FileContentName = styled.div`
  * + * {
    margin-right: 1em !important;
  }
`;

const FileDetail = styled.span`
  display: inline-flex;
  align-items: center;
  svg {
    height: 1rem;
    width: 1rem;
    margin-right: 0.25em;
  }
`;

// todo: video preview
export const FileViewer = (props: { file: APIFile }) => {
  const [, setToast] = useToasts();
  const clipboard = useClipboard();

  const download = () => {
    downloadUrl(props.file.url.direct);
  };

  const copy = () => {
    clipboard.copy(props.file.url.view);
    setToast({
      text: `Copied view link to clipboard`,
      type: "success",
    });
  };

  return (
    <Card>
      <FileContent file={props.file} />
      <Card.Content>
        <FileContentHeader>
          <FileContentName>
            <h1>{props.file.displayName}</h1>
            <Tooltip text="Views">
              <FileDetail>
                <Eye /> {props.file.views.toLocaleString()}
              </FileDetail>
            </Tooltip>
            <Tooltip text="File Size">
              <FileDetail>
                <FileText /> {prettyBytes(props.file.size)}
              </FileDetail>
            </Tooltip>
          </FileContentName>
          <FileContentRight>
            <FileContentButtons>
              <Button icon={<Share2 />} onClick={copy}>
                Copy Link
              </Button>
              <Button icon={<Download />} onClick={download}>
                Download
              </Button>
            </FileContentButtons>
          </FileContentRight>
        </FileContentHeader>
      </Card.Content>
    </Card>
  );
};
