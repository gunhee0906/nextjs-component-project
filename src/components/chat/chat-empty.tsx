import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

export function ChatEmpty() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle className="text-3xl">안녕하세요.</EmptyTitle>
        <EmptyDescription className="text-xl">
          이래에 채팅을 입력을 해주세요.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent></EmptyContent>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      ></Button>
    </Empty>
  );
}
