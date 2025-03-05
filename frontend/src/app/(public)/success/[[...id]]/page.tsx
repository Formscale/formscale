import CardTemplate from "@/components/card-template";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import SuccessButton from "./button";

export default async function SuccessPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  return (
    <CardTemplate Icon={CheckCircledIcon} title="Submission received!" description="Your form has been submitted.">
      <SuccessButton id={id} />
    </CardTemplate>
  );
}
