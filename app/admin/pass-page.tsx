import PageSection from "@/components/page-section";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Dispatch, SetStateAction } from "react";

function PassPage({
  pass,
  setPass,
}: {
  pass: string;
  setPass: Dispatch<SetStateAction<string>>;
}) {
  return (
    <PageSection title="Acceso Limitado">
      <div className="flex flex-col gap-2 justify-center items-center h-[300px]">
        <h2 className="font-bold">Introduce la Contraseña</h2>
        <InputOTP maxLength={4} value={pass} onChange={(pass) => setPass(pass)}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </div>
    </PageSection>
  );
}

export default PassPage;
