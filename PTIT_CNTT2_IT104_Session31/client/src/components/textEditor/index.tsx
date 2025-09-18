import MDEditor, { commands } from "@uiw/react-md-editor";
import "./index.scss";
import { memo } from "react";

function TextEditor({
  value,
  onChange,
  height,
}: {
  value: string;
  onChange: (value?: string) => void;
  height: number;
}) {
  return (
    <>
      <MDEditor
        height={height}
        value={value}
        onChange={onChange}
        commands={[
          commands.group(
            [
              commands.title1,
              commands.title2,
              commands.title3,
              commands.title4,
              commands.title5,
              commands.title6,
            ],
            {
              name: "title",
              groupName: "title",
              buttonProps: { "aria-label": "Insert title" },
            }
          ),
          commands.bold,
          commands.italic,
          commands.code,
          commands.comment,
          commands.divider,
          commands.hr,
          commands.link,
          commands.checkedListCommand,
          commands.codeBlock,
          commands.quote,
          commands.strikethrough,
          commands.table,
          commands.orderedListCommand,
          commands.unorderedListCommand,
        ]}
      />
    </>
  );
}

export default memo(TextEditor);
