import React, { FC } from "react";
import Markdown from "react-markdown";
type Props = {
  summary?: string;
};
const Summarybox: FC<Props> = ({ summary }) => {
  return (
    <div className="h-[60vh] overflow-auto">
      <h1 className="font-bold mb-4">Summary of Your Conversation</h1>
      <Markdown>{summary}</Markdown>
    </div>
  );
};

export default Summarybox;
