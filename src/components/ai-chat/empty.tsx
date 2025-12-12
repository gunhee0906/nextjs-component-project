import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

export function AIChatEmpty() {
  return (
    <Empty>
      <EmptyHeader className="pt-[9rem]">
        <EmptyTitle className="text-3xl">안녕하세요.</EmptyTitle>
        <EmptyTitle className="text-3xl">무엇이든 물어보세요.</EmptyTitle>
        <EmptyDescription className="text-xl"></EmptyDescription>
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
