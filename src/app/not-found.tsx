import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {} from "@/components/ui/input-group";
import Link from "next/link";

export default function EmptyInputGroup() {
  return (
    <Empty className="align-middle">
      <EmptyHeader>
        <EmptyTitle>404 - Not Found</EmptyTitle>
        <EmptyDescription>페이지를 찾을 수 없습니다.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <EmptyDescription>
          <Link href={"/"}>홈으로 돌아가기</Link>
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  );
}
