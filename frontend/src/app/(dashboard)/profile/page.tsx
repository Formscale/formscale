import DashTitle from "../components/title";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  return (
    <>
      <DashTitle title="Profile" />
      <Card className="w-full shadow-sm">
        <CardHeader className="py-4 border-b-[0.5px] border-border">
          <CardTitle className="text-md font-bold">Your email</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Dris Elamri</p>
          <p>Email: dris@formhook.com</p>
        </CardContent>
      </Card>
    </>
  );
}
